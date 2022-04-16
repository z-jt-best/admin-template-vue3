<!--
    * Time    : 2021-12-07 11:02:05
    * Author  : zhangTj
    * Desc    : 抽屉形式的菜单 - 用于在手机端时显示
-->
<template>
    <Drawer
        v-model:visible="appStore.drawerMenuVisiable"
        :body-style="{ padding: 0, backgroundColor: '#010c17' }"
        :closable="false"
        placement="left"
        :width="200"
    >
        <AppLogo v-if="appStore.showSidebarLogo" />
        <AppSide />
    </Drawer>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { Drawer } from 'ant-design-vue'

import AppLogo from './AppLogo.vue'
import AppSide from './index.vue'

import { useAppStore } from '@/store/modules/app'

export default defineComponent({
    name: 'DrawerMenu',
    components: { Drawer, AppLogo, AppSide },
    setup(props, context) {
        const appStore = useAppStore()

        return {
            appStore
        }
    }
})
</script>

<style lang="less" scoped>
:deep(.ant-drawer-content) {
    background-color: red !important;
}
</style>
