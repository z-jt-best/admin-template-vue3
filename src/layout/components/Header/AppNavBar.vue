<!--
    * Time    : 2021-12-03 14:23:41
    * Author  : zhangTj
    * Desc    : 应用程序导航部分
-->
<template>
    <div class="header-container">
        <div class="flex items-center">
            <AppSidebarIcon />
            <AppBreadcrumb />
        </div>
        <AppUserInfo />
    </div>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted, onUnmounted } from 'vue'

import AppSidebarIcon from './components/AppSidebarIcon.vue'
import AppBreadcrumb from './components/AppBreadcrumb.vue'
import AppUserInfo from './components/AppUserInfo.vue'

export default defineComponent({
    name: 'AppHeader',
    components: { AppSidebarIcon, AppBreadcrumb, AppUserInfo },
    setup(props, context) {
        onMounted(() => {})

        onUnmounted(() => {})

        return {}
    }
})
</script>

<style lang="less" scoped>
.header-container {
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #eee;
    @apply bg-white flex items-center justify-between;
}
</style>
