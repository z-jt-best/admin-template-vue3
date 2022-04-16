<!--
    * Time    : 2021-12-03 14:23:41
    * Author  : zhangTj
    * Desc    : 应用程序头部
-->
<template>
    <div :class="[appStore.fixedHeader ? 'fixed z-50' : '']" :style="{ width: headerWidth }" style="transition: all 0.2s">
        <AppNavBar />
        <AppTagView v-if="appStore.tagsView" />
    </div>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted, onUnmounted } from 'vue'

import AppNavBar from './AppNavBar.vue'
import AppTagView from './AppTagView.vue'

import { useAppStore } from '@/store/modules/app'
import { useAppInject } from '@/hook/useAppInject'

export default defineComponent({
    name: 'AppHeader',
    components: { AppNavBar, AppTagView },
    setup(props, context) {
        const appStore = useAppStore()

        const { getIsMobile } = useAppInject()

        const headerWidth = computed(() => {
            if (getIsMobile.value) return '100%'
            if (appStore.fixedHeader) return `calc(100% - ${appStore.sidebarWidth}px)`
            return 'auto'
        })

        onMounted(() => {})

        onUnmounted(() => {})

        return {
            appStore,
            headerWidth
        }
    }
})
</script>

<style lang="less" scoped></style>
