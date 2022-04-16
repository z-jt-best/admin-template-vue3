<!--
    * Time    : 2021-12-03 10:13:55
    * Author  : zhangTj
    * Desc    : 侧边栏
-->
<template>
    <ScrollBar class="scroll-container">
        <Menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" @select="handleMenuSelect" mode="inline" theme="dark">
            <template v-for="item in permissionStore.getMenuList" :key="item.path">
                <SidebarItem :item="item"></SidebarItem>
            </template>
        </Menu>
    </ScrollBar>
</template>

<script>
import { defineComponent, ref, toRefs, reactive } from 'vue'
import { Menu } from 'ant-design-vue'
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue'

import Icon from '@/components/Icon'
import ScrollBar from '@/components/ScrollBar/src/ScrollBar.vue'
import { useGo } from '@/hook/usePage'
import SidebarItem from './components/SidebarItem.vue'
import { usePermissionStore } from '@/store/modules/permission'
import { isUrl } from '@/utils/types'
import { openWindow } from '@/utils'
import { useRoute } from 'vue-router'
import { pageEnum } from '@/enums/pageEnum'
import { listenerRouteChange } from '@/routers/routeChange'
import { REDIRECT_NAME } from '@/routers/constant'

export default defineComponent({
    name: 'index',
    components: {
        Menu,
        SubMenu: Menu.SubMenu,
        MenuItem: Menu.Item,
        ScrollBar,
        Icon,
        SidebarItem,
        MailOutlined,
        AppstoreOutlined,
        SettingOutlined
    },

    setup(props, context) {
        const state = reactive({
            selectedKeys: [pageEnum.BASE_LOGIN],
            openKeys: []
        })

        const permissionStore = usePermissionStore()
        const go = useGo()
        const route = useRoute()

        const handleMenuSelect = ({ item, key }) => {
            if (isUrl(item.frameSrc)) {
                openWindow(item.frameSrc)
            } else {
                if (item.currentActiveMenu) state.selectedKeys = [item.currentActiveMenu]
                go(key)
            }
        }

        function getParentPathList(parentPath) {
            if (!parentPath) return []

            return parentPath.reduce((arr, item, index) => {
                if (item.startsWith('/')) arr.push(item)
                else arr.push([arr[index - 1], item].join('/'))

                return arr
            }, [])
        }

        const handleMenuChange = route => {
            if (route.name === REDIRECT_NAME || route.path === pageEnum.BASE_LOGIN) return

            state.selectedKeys = [route.meta?.currentActiveMenu ? route.meta.currentActiveMenu : route.path]
            state.openKeys = getParentPathList(route.meta.parentPath)
        }

        listenerRouteChange(route => {
            handleMenuChange(route)
        })

        return {
            ...toRefs(state),
            handleMenuSelect,
            permissionStore
        }
    }
})
</script>

<style lang="less" scoped>
.scroll-container {
    width: 100%;
    height: calc(100% - 48px);

    .scrollbar__wrap {
        margin-bottom: 18px !important;
        overflow-x: hidden;
    }

    .scrollbar__view {
        box-sizing: border-box;
    }
}
:deep(.ant-menu.ant-menu-inline-collapsed .ant-menu-item-icon, .ant-menu.ant-menu-inline-collapsed .anticon) {
    line-height: 16px;
}
</style>
