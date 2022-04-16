<!--
    * Time    : 2021-12-06 16:46:24
    * Author  : zhangTj
    * Desc    : 应用程序的Provider, 向下provide相关值
-->
<script lang="jsx">
import { defineComponent, ref, unref } from 'vue'

import { useAppStore } from '@/store/modules/app'
import { createBreakpointListen } from '@/hook/useBreakpoint'
import { createAppProviderContext } from './useAppContext'

export default defineComponent({
    name: 'AppProvider',
    inheritAttrs: false,
    setup(props, { slots }) {
        const isMobile = ref(false)
        const isSetState = ref(false)

        const appStore = useAppStore()

        // 监控屏幕断点信息变化
        createBreakpointListen(({ screenMap, sizeEnum, width }) => {
            const lgWidth = screenMap.get(sizeEnum.LG)
            if (lgWidth) {
                isMobile.value = width.value - 1 < lgWidth
            }

            // 初始化时必须调用一次, 保证store的值和界面的变化保持一致
            handleRestoreState()
        })

        // provide值
        createAppProviderContext({ isMobile })

        // 重置store值
        function handleRestoreState() {
            if (unref(isMobile)) {
                if (!unref(isSetState)) {
                    isSetState.value = true
                    appStore.configSidebar(false)
                }
            } else {
                if (unref(isSetState)) {
                    isSetState.value = false
                    appStore.configSidebar(true)
                }
            }
        }

        return () => slots.default?.()
    }
})
</script>

<style lang="less" scoped></style>
