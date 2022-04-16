<!--
    * Time    : 2022-01-18 17:19:11
    * Author  : zhangTj
    * Desc    : 底部操作栏
-->
<template>
    <div style="height: 50px">
        <div class="fixedBar" :style="{ width: currentWidth }">
            <div>
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/store/modules/app'

export default defineComponent({
    name: 'Sticky',
    components: {},
    setup(props, context) {
        const appStore = useAppStore()

        const currentWidth = computed(() => {
            if (appStore.closeSidebar) return 'calc(100% - 48px)'
            return 'calc(100% - 200px)'
        })

        return {
            currentWidth
        }
    }
})
</script>

<style lang="less" scoped>
.fixedBar {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: #fff;
    border-top: 1px solid #dadce0;
    opacity: 1;
    transition: all 0.2s;
}
</style>
