<!--
    * Time    : 2021-12-02 11:05:04
    * Author  : zhangTj
    * Desc    : 默认布局
-->
<template>
    <Layout style="min-height: 100%">
        <Sider
            v-if="appStore.showSidebar"
            v-model:collapsed="appStore.closeSidebar"
            class="left-0 top-0 h-full"
            style="position: fixed"
            :width="appStore.sidebarWidth"
            :collapsedWidth="48"
        >
            <AppLogo v-if="appStore.showSidebarLogo" />
            <AppSide />
        </Sider>
        <AppDrawerMenu v-if="!appStore.showSidebar" />
        <AppMain />
    </Layout>
</template>

<script>
import { defineComponent, ref, toRefs, readonly, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { Layout } from 'ant-design-vue'

import { useAppStore } from '@/store/modules/app'
import AppLogo from './components/Sidebar/AppLogo.vue'
import AppSide from './components/Sidebar/index.vue'
import AppMain from './components/AppMain.vue'
import AppDrawerMenu from './components/Sidebar/DrawerMenu.vue'

export default defineComponent({
    name: 'DefaultLayout',
    components: { Layout, Sider: Layout.Sider, AppLogo, AppMain, AppSide, AppDrawerMenu },
    setup(props, context) {
        const appStore = useAppStore()

        return {
            appStore
        }
    }
})
</script>

<style lang="less" scoped>
:deep(.ant-menu-dark .ant-menu-inline.ant-menu-sub) {
    background-color: #0c2135;
}
</style>
