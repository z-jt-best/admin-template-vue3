import { onUnmounted, reactive, watchEffect } from 'vue'

import { useDebounceFn } from '@vueuse/core'

function useAncHeight(full, wrapEle, tableEle, paginationEle) {
    const scrollObj = reactive({})
    let observer

    const obserDom = function () {
        observer = new ResizeObserver(
            useDebounceFn(entries => {
                if (entries.length > 0 && entries[0].contentRect.height > 0) {
                    computeBodyHeight()
                }
            }, 100)
        )

        observer.observe(wrapEle.value)
    }

    const computeBodyHeight = function () {
        if (tableEle.value) {
            const tableDom = tableEle.value.$el
            const paginationDom = paginationEle.value.$el

            const paginationHeight = paginationDom.getBoundingClientRect().height + 12 * 2 + 1

            const headDom = tableDom.querySelector('.ant-table-thead')

            const headHeight = headDom.getBoundingClientRect().height
            const tableWrapHeight = wrapEle.value.getBoundingClientRect().height

            scrollObj.y = tableWrapHeight - headHeight - paginationHeight
        }
    }

    watchEffect(() => {
        full && tableEle.value?.$el && obserDom()
    })

    onUnmounted(() => {
        if (full && tableEle.value?.$el) {
            observer.disconnect()
            observer = null
        }
    })

    return {
        scrollObj
    }
}

export { useAncHeight }
