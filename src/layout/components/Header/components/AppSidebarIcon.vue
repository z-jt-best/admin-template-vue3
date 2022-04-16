<!--
    * Time    : 2021-12-06 09:41:21
    * Author  : zhangTj
    * Desc    : file description
-->
<template>
    <div class="flex items-center">
        <div @click="appStore.toggleSidebar">
            <div class="px-4 hover:bg-gray-100">
                <MenuUnfoldOutlined v-if="appStore.closeSidebar" class="side-icon" />
                <MenuFoldOutlined v-else class="side-icon" />
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'

import { useAppStore } from '@/store/modules/app'

export default defineComponent({
    name: 'AppSidebarIcon',
    components: { MenuFoldOutlined, MenuUnfoldOutlined },
    setup(props, context) {
        const appStore = useAppStore()

        onMounted(() => {})

        onUnmounted(() => {})

        return {
            appStore
        }
    }
})
</script>

<style lang="less" scoped>
.side-icon {
    font-size: 16px;
    vertical-align: -0.25rem;
}
</style>
