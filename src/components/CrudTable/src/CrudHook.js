/**
 * crud table逻辑
 */

import { reactive, toRef } from 'vue'

/**
 *  table多选部分
 */

// 多选配置
export const selectOptions = options => {
    const defaultOptions = {
        fixed: true,
        selectedRowKeys: toRef(selectData, 'selectedRowKeys'),
        onChange: selectRow,
        preserveSelectedRowKeys: true
    }
    return options ? options : defaultOptions
}

// 选中的数据
export const selectData = reactive({
    selectedRowKeys: [],
    selectedRows: []
})

// 重置数据
export const resetSelectedData = () => {
    selectData.selectedRowKeys = []
    selectData.selectedRows = []
}

// 选中数据的回调
export const selectRow = (selectedRowKeys, selectedRows) => {
    selectData.selectedRowKeys = selectedRowKeys
    selectData.selectedRows = selectedRows
}
