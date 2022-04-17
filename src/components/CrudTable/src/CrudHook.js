/**
 * crud table逻辑
 */

import { reactive, toRefs, toRef } from 'vue'
import { assign } from 'lodash-es'
import { Table } from 'ant-design-vue'

/**
 *  table多选Hook
 */

function useSelectHook() {
    const selectData = reactive({
        selectedRowKeys: [],
        selectedRows: []
    })

    // 选中数据的回调
    const handleSelectRow = (selectedRowKeys, selectedRows) => {
        selectData.selectedRowKeys = selectedRowKeys
        selectData.selectedRows = selectedRows
    }

    // 获取select的基本配置
    const getBaseOption = options => {
        const baseOption = {
            fixed: true,
            columnWidth: 50,
            selectedRowKeys: toRef(selectData, 'selectedRowKeys'),
            onChange: handleSelectRow,
            preserveSelectedRowKeys: true,
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE]
        }

        if (options) {
            assign(baseOption, options)
        }
        return baseOption
    }

    // 清空选择的数据
    const resetSelected = () => {
        selectData.selectedRowKeys = []
        selectData.selectedRows = []
    }

    return {
        ...toRefs(selectData),
        getBaseOption,
        resetSelected
    }
}

export { useSelectHook }
