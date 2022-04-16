import { Modal, notification } from 'ant-design-vue'
import nProgress from 'nprogress'

import { setRouteChange, removeTabChangeListener } from './routeChange'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useUserStoreWithOut } from '@/store/modules/user'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { useuseTagViewStoreWithOut } from '@/store/modules/tagView'
import { pageEnum } from '@/enums/pageEnum'
import { isEmpty } from '@/utils/types'
import selfLog from '@/utils/log'

/**
 * 这里注册router的导航守卫
 * @param {*} router router实例
 */
export function setupRouterGuard(router) {
    createPageGuard(router)
    createPageLoadingGuard(router)
    createMessageGuard(router)
    createProgressGuard(router)
    createPermissionGuard(router)
    createStateGuard(router)
}

function createPageGuard(router) {
    const loadedPageMap = new Map()

    router.beforeEach(to => {
        to.meta.loaded = !!loadedPageMap.get(to.path)

        setRouteChange(to)

        return true
    })

    router.afterEach(to => {
        loadedPageMap.set(to.path, true)
    })
}

function createPageLoadingGuard(router) {
    const userStore = useUserStoreWithOut()
    const appStore = useAppStoreWithOut()

    router.beforeEach(async to => {
        if (!userStore.getToken) {
            return true
        }
        if (to.meta.loaded) {
            return true
        }

        appStore.setPageLoading(true)
        return true
    })
    router.afterEach(() => {
        setTimeout(() => {
            appStore.setPageLoading(false)
        }, 220)
    })
}

/**
 * 关闭所有提示框实例
 * @param router
 */
function createMessageGuard(router) {
    router.beforeEach(async () => {
        try {
            Modal.destroyAll()
            // notification.destroy()
        } catch (error) {
            warn('message guard error:' + error)
        }
        return true
    })
}

function createProgressGuard(router) {
    router.beforeEach(async to => {
        if (to.meta.loaded) {
            return true
        }
        nProgress.start()
        return true
    })

    router.afterEach(async () => {
        nProgress.done()
        return true
    })
}

const WHITE_LIST = [pageEnum.BASE_LOGIN]

function createPermissionGuard(router) {
    const userStore = useUserStoreWithOut()
    const permissionStore = usePermissionStoreWithOut()

    router.beforeEach(async (to, from, next) => {
        const token = userStore.getToken

        if (WHITE_LIST.includes(to.path)) {
            if (token && to.path === pageEnum.BASE_LOGIN) next({ path: pageEnum.BASE_HOME })
            else next()
        } else {
            if (token) {
                if (!userStore.token) userStore.setToken(token)

                if (isEmpty(userStore.getUserInfo)) {
                    try {
                        await userStore.getUserInfoAction()
                    } catch (e) {
                        selfLog.error('get userInfo error')
                        console.log(e)
                    }
                }
                if (!permissionStore.isDynamicAddedRoute) {
                    let routes = []
                    try {
                        routes = await permissionStore.processRoutes()
                    } catch (e) {
                        selfLog.error('get dynamic route error')
                        console.log(e)
                    }

                    routes.forEach(route => {
                        router.addRoute(route)
                    })
                    permissionStore.setDynamicAddedRoute(true)

                    next({ path: to.fullPath, replace: true, query: to.query })
                } else {
                    next()
                }
            } else {
                next({
                    path: pageEnum.BASE_LOGIN
                })
            }
        }
    })
}

function createStateGuard(router) {
    router.afterEach(to => {
        if (to.path === pageEnum.BASE_LOGIN) {
            const permissionStore = usePermissionStoreWithOut()
            const tagViewStore = useuseTagViewStoreWithOut()

            permissionStore.resetState()
            tagViewStore.resetState()
            removeTabChangeListener()
        }
    })
}
