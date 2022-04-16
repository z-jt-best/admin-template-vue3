<!--
    * Time    : 2021-12-27 11:42:02
    * Author  : zhangTj
    * Desc    : crud组件示例页面
-->
<template>
    <div>
        <CrudTable :jsonFields="jsonFields" :columns="columns" read del update create :crudApi="demoApi" :modalFormRef="modalFormRef">
            <template #modal="{ formData, isEdit }">
                <Form
                    ref="modalFormRef"
                    :model="formData"
                    :labelCol="{ style: { width: '120px' } }"
                    :rules="formRules"
                    name="basic"
                    autocomplete="off"
                >
                    <FormItem label="用户名" name="username">
                        <Input v-model:value="formData.username" placeholder="请输入用户名" />
                    </FormItem>
                    <FormItem label="真实名称" name="realname">
                        <Input v-model:value="formData.realname" placeholder="请输入真实名称" />
                    </FormItem>
                    <FormItem v-if="!isEdit" label="密码" name="password">
                        <InputPassword v-model:value="formData.password" placeholder="请输入密码" />
                    </FormItem>
                    <FormItem label="用户角色" name="roleId">
                        <CheckboxGroup v-model:value="formData.roleId" :options="checkboxOptions"></CheckboxGroup>
                    </FormItem>
                    <FormItem label="所属客户" name="customerId">
                        <Select v-model:value="formData.customerId" :options="selectOptions" placeholder="请选择所属客户"></Select>
                    </FormItem>
                </Form>
            </template>
        </CrudTable>
    </div>
</template>

<script lang="jsx">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from 'vue'
import { Form, Input, CheckboxGroup, Select } from 'ant-design-vue'

import CrudTable from '@/components/CrudTable'
import { demoApi } from '@/api/demo.js'

export default defineComponent({
    name: 'userList',
    components: { CrudTable, Form, FormItem: Form.Item, Input, CheckboxGroup, Select, InputPassword: Input.Password },
    setup(props, context) {
        const jsonFields = [
            {
                label: '用户名',
                name: 'userName',
                defaltValue: '',
                type: 'input'
            },
            {
                label: '真实名称',
                name: 'name',
                defaltValue: '',
                type: 'input'
            },
            {
                label: '所属客户',
                name: 'status',
                defaltValue: '',
                type: 'select',
                options: [
                    {
                        value: 1,
                        label: '华南地区'
                    },
                    {
                        value: 0,
                        label: '华东地区'
                    }
                ],
                rules: []
            }
        ]
        const columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username'
            },
            {
                title: '真实名称',
                dataIndex: 'realname',
                key: 'realname'
            },
            {
                title: '用户角色',
                dataIndex: 'roleId',
                key: 'roleId',
                customRender: ({ text, record }) => {
                    return <div>{findTaget(record.roleId).join('、')}</div>
                }
            },
            {
                title: '所属客户',
                dataIndex: 'customerId',
                key: 'customerId',
                customRender: ({ record }) => {
                    return <div>{selectOptions.filter(item => item.value === record.customerId)[0].label}</div>
                }
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation'
            }
        ]

        const modalFormRef = ref(null)
        const formRules = reactive({
            username: [
                {
                    required: true,
                    message: '请输入用户名'
                }
            ],
            realname: [
                {
                    required: true,
                    message: '请输入真实名称'
                }
            ],
            password: [
                {
                    required: true,
                    message: '请输入密码'
                }
            ],
            roleId: [
                {
                    required: true,
                    message: '请选择用户角色',
                    type: 'array'
                }
            ],
            customerId: [
                {
                    required: true,
                    message: '请选择所属客户',
                    type: 'number'
                }
            ]
        })

        const checkboxOptions = [
            {
                label: '普通用户',
                value: 1
            },
            {
                label: '后台管理员',
                value: 2
            },
            {
                label: '新闻中心管理员',
                value: 3
            }
        ]

        const selectOptions = [
            {
                label: '华南地区',
                value: 1
            },
            {
                label: '华东地区',
                value: 2
            },
            {
                label: '华北地区',
                value: 3
            }
        ]

        const findTaget = idList => {
            const list = []
            for (let id of idList) {
                const target = checkboxOptions.filter(item => item.value === id)
                if (target && target.length) list.push(target[0].label)
            }

            return list
        }

        const modalFormRef1 = ref(null)

        onMounted(() => {})

        onUnmounted(() => {})

        return {
            columns,
            jsonFields,
            demoApi,
            formRules,
            modalFormRef,
            checkboxOptions,
            selectOptions,
            modalFormRef1
        }
    }
})
</script>

<style lang="less" scoped></style>
