import { defineStore } from 'pinia'

import { store } from '../index'
import { userApi } from '@/api'
import { useMessage } from '@/hook/useMessage'
import { transformObjToRoute, flatMultiLevelRoutes } from '@/routers/helper/routeHelper'
import { transformRouteToMenu } from '@/routers/helper/menuHelper'
import { PAGE_NOT_FOUND_ROUTE } from '@/routers/basic'
import { pageEnum } from '@/enums/pageEnum'
import { constantRoutes } from '@/routers'

export const usePermissionStore = defineStore({
    id: 'permission',
    state: () => ({
        isDynamicAddedRoute: false,
        permissionRoutes: [],
        menuList: []
    }),
    getters: {
        getMenuList() {
            return this.menuList
        }
    },
    actions: {
        resetState() {
            this.isDynamicAddedRoute = false
            this.permissionRoutes = []
            this.menuList = []
        },
        setDynamicAddedRoute(value) {
            this.isDynamicAddedRoute = value
        },

        setPermissionRoutes(routeList) {
            this.permissionRoutes = routeList
        },

        setMenuList(menuList) {
            this.menuList = menuList
        },

        async processRoutes() {
            const { createMessage } = useMessage()
            createMessage.loading({
                content: '菜单加载中...',
                duration: 1.5
            })

            const patchHomeAffix = routes => {
                if (!routes || routes.length === 0) return

                let homePath = pageEnum.BASE_HOME

                function patcher(routes, parentPath = '') {
                    if (parentPath) parentPath = parentPath + '/'

                    routes.forEach(route => {
                        const { path, children, redirect } = route
                        const currentPath = path.startsWith('/') ? path : parentPath + path
                        if (currentPath === homePath) {
                            if (redirect) {
                                homePath = route.redirect
                            } else {
                                route.meta = Object.assign({}, route.meta, { affix: true })
                                throw new Error('end')
                            }
                        }
                        children && children.length > 0 && patcher(children, currentPath)
                    })
                }

                try {
                    patcher(routes)
                } catch (e) {
                    // 已处理完毕跳出循环
                }
                return
            }

            let routeList = []
            try {
                const result = await userApi.menuList()
                routeList = result.data
            } catch (e) {
                console.log(e)
            }

            routeList = transformObjToRoute(routeList)

            const { VITE_USE_ROUTE } = import.meta.env

            // TODO => 本地路由不支持多级路由解析
            if (VITE_USE_ROUTE) {
                const addParentPath = (routes, parentPath = []) => {
                    routes.forEach(item => {
                        if (parentPath) {
                            item.meta = { ...item.meta, parentPath }
                        }
                    })
                }

                constantRoutes.forEach(item => {
                    item.children && addParentPath(item.children, [item.path])
                })

                routeList = [...routeList, ...constantRoutes]
            }

            const backMenuList = transformRouteToMenu(routeList)
            this.setMenuList(backMenuList)

            routeList = flatMultiLevelRoutes(routeList)

            routeList.unshift(PAGE_NOT_FOUND_ROUTE)
            patchHomeAffix(routeList)
            this.setPermissionRoutes(routeList)

            return routeList
        }
    }
})

export function usePermissionStoreWithOut() {
    return usePermissionStore(store)
}
