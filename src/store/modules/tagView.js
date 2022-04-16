import { defineStore } from 'pinia'
import { toRaw, unref } from 'vue'

import { store } from '../index'
import { getRawRoute } from '@/utils'
import { pageEnum } from '@/enums/pageEnum'
import { REDIRECT_ROUTE, PAGE_NOT_FOUND_ROUTE } from '@/routers/basic'

const getToTarget = tabItem => {
    const { params, path, query } = tabItem
    return {
        params: params || {},
        path,
        query: query || {}
    }
}

export const useTagViewStore = defineStore({
    id: 'tagView',
    state: () => ({
        tabList: [],
        cachesTabList: new Set()
    }),
    getters: {
        getTabList() {
            return this.tabList
        },

        getCacheTabList() {
            return Array.from(this.cachesTabList)
        }
    },
    actions: {
        resetState() {
            this.tabList = []
            this.cachesTabList = new Set()
        },

        addTab(route) {
            const { path, name, fullPath, params, query, meta } = getRawRoute(route)
            if (!name || [REDIRECT_ROUTE.name, PAGE_NOT_FOUND_ROUTE.name, pageEnum.ERROR_PAGE, pageEnum.BASE_LOGIN].includes(name)) return

            let updateIndex = -1
            const tabHasExits = this.tabList.some((tab, index) => {
                updateIndex = index
                return (tab.fullPath || tab.path) === (fullPath || path)
            })

            if (tabHasExits) {
                const curTab = toRaw(this.tabList)[updateIndex]
                if (!curTab) return

                curTab.params = params || curTab.params
                curTab.query = query || curTab.query
                curTab.fullPath = fullPath || curTab.fullPath
                this.tabList.splice(updateIndex, 1, curTab)
            } else {
                this.tabList.push(route)
            }

            this.updateCacheTab()
        },

        async closeTabByKey(key, router) {
            const index = this.tabList.findIndex(item => (item.fullPath || item.path) === key)
            if (index !== -1) {
                await this.closeTab(this.tabList[index], router)

                const { currentRoute, replace } = router
                // 检查当前路由是否存在于tabList中
                const isActivated = this.tabList.findIndex(item => {
                    return item.fullPath === currentRoute.value.fullPath
                })
                // 如果当前路由不存在于TabList中，尝试切换到其它路由
                if (isActivated === -1) {
                    let pageIndex
                    if (index > 0) {
                        pageIndex = index - 1
                    } else if (index < this.tabList.length - 1) {
                        pageIndex = index + 1
                    } else {
                        pageIndex = -1
                    }
                    if (pageIndex >= 0) {
                        const page = this.tabList[index - 1]
                        const toTarget = getToTarget(page)
                        await replace(toTarget)
                    }
                }
            }
        },

        async closeTab(tab, router) {
            const close = route => {
                const { fullPath, meta: { affix } = {} } = route
                if (affix) {
                    return
                }
                const index = this.tabList.findIndex(item => item.fullPath === fullPath)
                index !== -1 && this.tabList.splice(index, 1)
            }

            const { currentRoute, replace } = router

            const { path } = unref(currentRoute)
            if (path !== tab.path) {
                close(tab)
                return
            }

            let toTarget = {}

            const index = this.tabList.findIndex(item => item.path === path)

            // If the current is the leftmost tab
            if (index === 0) {
                // There is only one tab, then jump to the homepage, otherwise jump to the right tab
                if (this.tabList.length === 1) {
                    toTarget = pageEnum.BASE_HOME
                } else {
                    //  Jump to the right tab
                    const page = this.tabList[index + 1]
                    toTarget = getToTarget(page)
                }
            } else {
                // Close the current tab
                const page = this.tabList[index - 1]
                toTarget = getToTarget(page)
            }

            close(currentRoute.value)
            await replace(toTarget)
        },

        updateCacheTab() {
            const cacheMap = new Set()

            for (let tab of this.tabList) {
                const item = getRawRoute(tab)

                const needCache = !item.meta?.ignoreKeepAlive
                if (!needCache) continue

                const name = item.name
                cacheMap.add(name)
            }

            this.cachesTabList = cacheMap
        }
    }
})

export function useuseTagViewStoreWithOut() {
    return useTagViewStore(store)
}
