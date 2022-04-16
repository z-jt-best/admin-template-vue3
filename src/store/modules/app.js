import { defineStore } from 'pinia'

import { store } from '../index'
import settings from '@/settings'

export const useAppStore = defineStore({
    id: 'app',
    state: () => ({
        ...settings,
        closeSidebar: false, // 是否关闭sidebar
        drawerMenuVisiable: true, // 是否显示抽屉菜单
        pageLoading: false // main区域的loading
    }),
    getters: {
        getPageLoading() {
            return this.pageLoading
        }
    },
    actions: {
        // 展开/收起菜单
        toggleSidebar() {
            if (this.showSidebar) {
                this.closeSidebar = !this.closeSidebar
                this.sidebarWidth = this.closeSidebar ? 48 : 200
            } else {
                this.drawerMenuVisiable = !this.drawerMenuVisiable
            }
        },

        // 控制限制sidebar还是抽屉菜单
        configSidebar(value) {
            this.showSidebar = value
            this.drawerMenuVisiable = !value
        },

        // 设置全局loading
        setPageLoading(loading) {
            this.pageLoading = loading
        }
    }
})

export function useAppStoreWithOut() {
    return useAppStore(store)
}
