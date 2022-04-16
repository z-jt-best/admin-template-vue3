import { ref, reactive, onMounted, h, isRef, isReactive, toRef, toRefs, toRaw } from 'vue'

import { isEmpty, isFunction } from '@/utils/types'
import { useAppStore } from '@/store/modules/app'
import { useMessage } from '@/hook/useMessage'
import selfLog from '@/utils/log'
import { cloneDeep } from 'lodash-es'

function useGet({ request, pageSize, immediate = true }) {
    const appStore = useAppStore()

    const tableData = ref([])
    const total = ref(0)
    const loading = ref(false)
    const pagination = reactive({
        pageNo: 1,
        pageSize: pageSize ? pageSize : Number(appStore.pageSizesList[0])
    })

    // 保留前一次请求的参数
    let prevParams = reactive({})

    const getData = (params = {}) => {
        loading.value = true
        const data = { ...prevParams, ...pagination, ...params }
        return request(data)
            .then(res => {
                prevParams = data

                if (!isEmpty(res.data)) {
                    total.value = res.data.total
                    tableData.value = res.data.tableList
                }

                return Promise.resolve({
                    data: res.data,
                    message: 'success',
                    code: 200
                })
            })
            .catch(err => {
                console.log(err)
                return Promise.reject({
                    data: err,
                    message: 'error',
                    code: 400
                })
            })
            .finally(() => {
                loading.value = false

                // setTimeout(() => {
                //     loading.value = false
                // }, 800)
            })
    }

    onMounted(() => {
        immediate && getData()
    })

    return {
        tableData,
        total,
        loading,
        pagination,
        getData
    }
}

function useDelete({ request }) {
    const loading = ref(false)
    const { createConfirm, createMessage } = useMessage()

    const delData = data => {
        return new Promise((resolve, reject) => {
            createConfirm({
                iconType: 'warning',
                title: () => h('span', '温馨提示'),
                content: () => h('span', '数据删除后不可恢复，确定要删除吗？'),
                onOk: () => {
                    loading.value = true
                    request(data)
                        .then(res => {
                            createMessage.success({
                                content: '删除成功',
                                duration: 1.5
                            })
                            resolve()
                        })
                        .catch(err => {
                            selfLog.warning(`删除失败 - ${data}`)
                            console.log(err)
                            reject()
                        })
                        .finally(() => {
                            loading.value = false
                        })
                }
            })
        })
    }

    return {
        loading,
        delData
    }
}

// 新增和编辑
function useOperation(request) {
    const modalForm = reactive({
        formData: {},
        modalLoading: false,
        visible: false,
        modalTitle: '新增',
        isEdit: false
    })

    const showModal = (type, data) => {
        modalForm.modalTitle = type === 'create' ? '新增' : '编辑'
        modalForm.isEdit = type === 'create' ? false : true
        modalForm.formData = type === 'create' ? {} : cloneDeep(toRaw(data))
        toggleModal(true)
    }

    const toggleModal = value => {
        modalForm.visible = value
    }

    const setLoading = value => {
        modalForm.modalLoading = value
    }

    const { createMessage } = useMessage()

    const createData = data => {
        setLoading(true)

        return new Promise((resolve, reject) => {
            request
                .create(data)
                .then(res => {
                    createMessage.success('新增成功')
                    toggleModal(false)
                    resolve()
                })
                .catch(err => {
                    selfLog.warning('useCreate err')
                    console.log(err)
                    reject(err)
                })
                .finally(() => {
                    setLoading(false)
                })
        })
    }

    const updateData = () => {
        setLoading(true)

        return new Promise((resolve, reject) => {
            request
                .update(modalForm.formData.id, modalForm.formData)
                .then(res => {
                    createMessage.success('编辑成功')
                    toggleModal(false)
                    resolve()
                })
                .catch(err => {
                    selfLog.warning('useUpdate err')
                    console.log(err)
                    reject(err)
                })
                .finally(() => {
                    setLoading(false)
                })
        })
    }

    return {
        modalForm,
        showModal,
        toggleModal,
        setLoading,
        createData,
        updateData
    }
}

function useCrud(
    crudApi,
    config = {
        pageSize,
        getImmediate: true,
        beforeSubmit: () => {}
    }
) {
    const { getImmediate, beforeSubmit, pageSize } = config
    const { loading: getLoading, tableData, total, pagination, getData } = useGet({ request: crudApi.get, immediate: getImmediate, pageSize })
    const { loading: delLoading, delData } = useDelete({ request: crudApi.delete })
    const { createData, updateData, modalForm, toggleModal, showModal } = useOperation(crudApi)

    const confirmModal = data => {
        if (beforeSubmit && isFunction(beforeSubmit)) {
            beforeSubmit(data, modalForm.formData, modalForm.isEdit)
        }

        return new Promise(async (resolve, reject) => {
            try {
                if (modalForm.isEdit) await updateData()
                else await createData(data)
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    }

    return {
        getLoading: getLoading,
        tableData,
        total,
        pagination,
        getData,
        delLoading,
        delData,
        ...toRefs(modalForm),
        showModal,
        createData,
        updateData,
        confirmModal,
        toggleModal
    }
}

export { useGet, useDelete, useOperation, useCrud }
