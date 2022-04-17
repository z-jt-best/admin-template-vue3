<!--
    * Time    : 2021-12-15 17:23:49
    * Author  : zhangTj
    * Desc    : 用于一般的CRUD表格页面
-->
<template>
    <div :class="[full ? 'flex flex-col h-full w-full absolute' : '']">
        <slot name="header" :search="search" :reset="search" :getData="getTableData">
            <div class="m-3" v-if="!isEmpty(jsonFields)">
                <Card>
                    <JsonForm :jsonFields="jsonFields" @search="search" @reset="search" />
                </Card>
            </div>
        </slot>
        <slot name="create" :create-data="createData" :show-modal="showModal">
            <div class="bg-white mx-3" :class="{ 'p-4': create || select }">
                <Space>
                    <a-button v-if="create" @click="showModal('create')" type="primary">
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        新增
                    </a-button>
                    <a-button v-if="select" type="primary" danger :disabled="selectedRowKeys.length === 0" @click="handleMulDel">
                        <template #icon>
                            <DeleteOutlined />
                        </template>
                        批量删除
                    </a-button>
                </Space>
            </div>
        </slot>
        <div ref="tableWrapRef" class="mx-3 mb-3" style="flex: 1; overflow-y: hidden">
            <Table
                ref="tableRef"
                :rowSelection="select ? selectOptions : null"
                :rowKey="rowKey"
                :loading="loading"
                :columns="processCol"
                :data-source="tableData"
                :pagination="false"
                size="middle"
                bordered
                :scroll="scrollObj"
                class="ant-table-striped"
                :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === operationName">
                        <slot
                            name="operation"
                            :column="column"
                            :record="record"
                            :update-data="updateData"
                            :del-data="handleDel"
                            :show-modal="showModal"
                        >
                            <div class="table-operation">
                                <template v-if="update">
                                    <a-button @click="showModal('update', record)" type="link">
                                        <template #icon>
                                            <EditOutlined />
                                        </template>
                                        编辑
                                    </a-button>
                                    <Divider type="vertical" />
                                </template>
                                <a-button v-if="del" @click="handleDel(record.id)" type="link" danger>
                                    <template #icon>
                                        <DeleteOutlined />
                                    </template>
                                    删除
                                </a-button>
                            </div>
                        </slot>
                    </template>
                </template>
            </Table>
            <div class="p-3 flex justify-end bg-white" style="border-top: 1px solid #eee">
                <Pagination
                    ref="paginationRef"
                    size="small"
                    v-model:current="pagination.pageNo"
                    v-model:pageSize="pagination.pageSize"
                    :total="total"
                    :showTotal="total => `共${total}条`"
                    :pageSizeOptions="appStore.pageSizesList"
                    @change="pageChange"
                />
            </div>
        </div>
    </div>

    <Modal v-model:visible="visible" :title="modalTitle" :confirmLoading="modalLoading" @ok="validateForm" :width="modalWidth" v-bind="modalArgs">
        <slot name="modal" :form-data="formData" :is-edit="isEdit">
            <div>这里要自己填充内容</div>
        </slot>
        <template #footer v-if="selfFooter">
            <slot name="modalFooter" :ok="validateForm" :toggleModal="toggleModal" :form-data="formData"></slot>
        </template>
    </Modal>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted, onUnmounted, toRaw, nextTick } from 'vue'
import { Table, Pagination, Row, Divider, Modal, Card, Space } from 'ant-design-vue'
import { any, array, bool, func, number, object, oneOfType, string } from 'vue-types'
import { cloneDeep } from 'lodash-es'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'

import { useAncHeight } from './useAncHeight'
import { useAppStore } from '@/store/modules/app'
import JsonForm from '@/components/JsonForm'
import { isEmpty } from '@/utils/types'
import { useCrud } from '@/hook/useCrud'

import { useSelectHook } from './CrudHook'

export default defineComponent({
    name: 'CrudTable',
    components: { Table, Column: Table.Column, JsonForm, Pagination, Row, Divider, Modal, Card, PlusOutlined, DeleteOutlined, EditOutlined, Space },
    props: {
        full: bool().def(true), // 是否启用满屏
        rowKey: oneOfType([string(), func()]).def('id'), // table的rowKey
        rowSelection: object(), // table 的 rowSelection 选项
        showIndex: bool().def(true), // 是否显示 table 的序号, 默认开启
        columns: array().def([]), // table 的 columns 参数
        create: bool().def(false), // 是否启用create
        read: bool().def(false), // 是否启用read
        update: bool().def(false), // 是否启用update
        del: bool().def(false), // 是否启用del
        select: bool().def(false), // 是否启用select
        operationName: string().def('operation'), // table表单的操作插槽位
        crudApi: object().def({
            // crud的API接口
            curd: {
                get: () => Promise.resolve()
            }
        }),
        jsonFields: array().def([]), // 查询表单
        timeFields: array().def([]), // 时间字段数组, 后面会对时间字段进行统一处理
        timeFormat: string().def('YYYY-MM-DD'), // 时间字段格式
        modalFormRef: any(), // modal的Form表单实例, 如果使用到modal Form时必须传递, 用其进行参数校验
        modalWidth: number().def(850), // modal的宽度
        beforeSubmit: func(), // update && create 前的执行函数
        pageSize: number().def(50), // 查询页数
        selfFooter: bool().def(false), // 是否自定义modal的footer插槽, 因为moal的footer一旦定义了会导致就会使用, 使用参数判断是否渲染
        fixedParams: object().def({}), // 固定参数, 会传递给查询
        modalArgs: object().def({}) // modal的参数
    },
    emits: ['success', 'modal', 'getSuccess', 'getFail', 'delSuc', 'delFail', 'mulDel'],
    setup(props, context) {
        const appStore = useAppStore()

        // 动态计算table高度
        const tableWrapRef = ref(null)
        const tableRef = ref(null)
        const paginationRef = ref(null)
        const { scrollObj } = useAncHeight(props.full, tableWrapRef, tableRef, paginationRef)

        // 补充序号
        const processCol = computed(() => {
            if (props.showIndex) {
                const columns = cloneDeep(props.columns)
                columns.unshift({
                    title: '序号',
                    dataIndex: 'index',
                    key: 'index',
                    align: 'center',
                    width: 50,
                    customRender: ({ index }) => `${index + 1}`
                })
                return columns
            }
            return props.columns
        })

        // 时间字段处理
        const beforeSearch = params => {
            const data = cloneDeep(params)
            for (let field of props.timeFields) {
                data[`start${field.replace(field[0], field[0].toUpperCase())}`] =
                    data[field] && data[field].length ? data[field][0].format(props.timeFormat) : ''
                data[`end${field.replace(field[0], field[0].toUpperCase())}`] =
                    data[field] && data[field].length ? data[field][1].format(props.timeFormat) : ''
                delete data[field]
            }

            return data
        }

        // 获取数据
        const getTableData = values => {
            let data = values ? beforeSearch(values) : values
            if (!isEmpty(props.fixedParams)) {
                data = Object.assign({}, props.fixedParams, data)
            }
            getData(data)
                .then(res => {
                    context.emit('getSuccess', res)
                })
                .catch(err => {
                    context.emit('getFail', err)
                })
        }

        // 搜索
        const search = values => {
            pagination.pageNo = 1
            getTableData(toRaw(values))
        }

        // 分页
        const pageChange = (page, pageSize) => {
            pagination.pageNo = page
            pagination.pageSize = pageSize
            getTableData()
        }

        // 增删该查主要逻辑
        const {
            getLoading,
            tableData,
            total,
            pagination,
            getData,
            delData,
            confirmModal,
            visible,
            showModal,
            modalTitle,
            modalLoading,
            formData,
            isEdit,
            updateData,
            createData,
            toggleModal
        } = useCrud(props.crudApi.curd, {
            pageSize: props.pageSize,
            getImmediate: false,
            beforeSubmit: props.beforeSubmit
        })

        // 删除
        const handleDel = id => {
            delData(id)
                .then(() => {
                    // 如果当前页面只有一条数据，删除后当前页应当减一，当前页为1时不动
                    if (total.value === (pagination.pageNo - 1) * pagination.pageSize + 1) {
                        pagination.pageNo !== 1 && pagination.pageNo--
                    }
                    getTableData()
                    context.emit('delSuc')
                })
                .catch(err => {
                    context.emit('delFail', err)
                })
        }

        // 弹窗验证
        const validateForm = async () => {
            try {
                const data = await props.modalFormRef.validate()
                confirmModal(data).then(() => {
                    pagination.pageNo = 1
                    getTableData()
                    context.emit('success')
                })
            } catch (e) {
                console.log('modalForm validate err')
                console.log(e)
            }
        }

        // 重置弹窗状态
        watch(
            () => visible.value,
            async newVal => {
                if (newVal) {
                    await nextTick()
                    props.modalFormRef.clearValidate()
                }
                context.emit('modal', newVal, isEdit.value, formData.value)
            }
        )

        /** 多选部分 **/
        let selectOptions = null
        const { selectedRowKeys, selectedRows, getBaseOption, resetSelected } = useSelectHook()
        if (props.select) {
            selectOptions = getBaseOption(props.rowSelection)
        }

        const handleMulDel = () => {
            context.emit('mulDel', selectedRowKeys.value, selectedRows.value)
        }

        onMounted(() => {
            props.read && getTableData()
        })

        onUnmounted(() => {})

        return {
            tableWrapRef,
            tableRef,
            paginationRef,
            scrollObj,
            processCol,
            appStore,
            search,
            loading: getLoading,
            pagination,
            tableData,
            total,
            pageChange,
            delData,
            visible,
            confirmModal,
            showModal,
            modalTitle,
            modalLoading,
            formData,
            validateForm,
            isEdit,
            updateData,
            createData,
            isEmpty,
            getTableData,
            toggleModal,
            handleDel,
            selectOptions,
            selectedRowKeys,
            selectedRows,
            resetSelected,
            handleMulDel
        }
    }
})
</script>
