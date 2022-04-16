import { cloneDeep, omit } from 'lodash-es'
import { createRouter, createWebHashHistory } from 'vue-router'

import { LAYOUT, EXCEPTION_COMPONENT, getParentLayout } from '../constant'
import selfLog from '@/utils/log'

function toStandardRoute(route) {
    route.meta = {
        title: route.menuName,
        icon: route.menuIcon,
        hideChildrenInMenu: Boolean(route.hideSubMenu),
        hideMenu: Boolean(route.hideMenu),
        frameSrc: route.externalLink
    }
    route.name = route.routerName
    route.path = route.routerUrl
    route.component = route.component
    route.redirect = route.redirect
}

export function transformObjToRoute(routeList) {
    routeList.forEach(route => {
        // toStandardRoute(route)

        const component = route.component

        if (component) {
            if (component.toUpperCase() === 'LAYOUT') {
                route.component = LAYOUT
            } else {
                selfLog.warning('一级路由不是LAUOUT组件')
            }
        } else {
            selfLog.warning(`${route?.name}缺少component属性, 路由不存在`)
        }

        route.children && asyncImportRoute(route.children, [route.path])
    })

    return routeList
}

let dynamicViewsModules = null

function asyncImportRoute(routes, parentPath = []) {
    dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}')

    if (!routes) return

    routes.forEach(item => {
        // toStandardRoute(item)

        if (!item.component && item.meta?.frameSrc) {
            item.component = 'IFRAME'
        }

        if (parentPath) {
            item.meta = { ...item.meta, parentPath }
        }

        const { component, name, children } = item

        if (component !== 'levelMenu') {
            item.component = dynamicImport(dynamicViewsModules, component)
        } else if (component === 'levelMenu') {
            item.component = getParentLayout()
        }

        children && asyncImportRoute(children, [...parentPath, item.path])
    })
}

function dynamicImport(dynamicViewsModules, component) {
    const keys = Object.keys(dynamicViewsModules)

    const matchKeys = keys.filter(key => {
        const k = key.replace('../../views', '')
        const startFlag = component.startsWith('/')
        const endFlag = component.endsWith('.vue') || component.endsWith('.jsx')
        const startIndex = startFlag ? 0 : 1
        const lastIndex = endFlag ? k.length : k.lastIndexOf('.')
        return k.substring(startIndex, lastIndex) === component
    })

    if (matchKeys?.length === 1) {
        const matchKey = matchKeys[0]
        return dynamicViewsModules[matchKey]
    }
    // 不能在同级目录下存在同名的.vue/tsx文件
    else if (matchKeys?.length > 1) {
        selfLog.warning('同级目录下同时存在.vue和.jsx文件')
        return
    } else {
        selfLog.warning(`在src/views/下找不到${component}.vue或${component}.jsx文件, 请自行创建`)
        return EXCEPTION_COMPONENT
    }
}

export function flatMultiLevelRoutes(routeList) {
    const cloneRouteList = cloneDeep(routeList)

    for (let index = 0; index < cloneRouteList.length; index++) {
        const routeModule = cloneRouteList[index]

        if (!isMultipleRoute(routeModule)) {
            continue
        }

        promoteRouteLevel(routeModule)
    }

    return cloneRouteList
}

function isMultipleRoute(routeModule) {
    if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
        return false
    }

    const children = routeModule.children

    let flag = false
    for (let index = 0; index < children.length; index++) {
        const child = children[index]
        if (child.children?.length) {
            flag = true
            break
        }
    }
    return flag
}

function promoteRouteLevel(routeModule) {
    let router = createRouter({
        routes: [routeModule],
        history: createWebHashHistory()
    })
    const routes = router.getRoutes()
    addToChildren(routes, routeModule.children || [], routeModule)

    router = null
    routeModule.children = routeModule.children?.map(item => omit(item, 'children'))
}

function addToChildren(routes, children, routeModule) {
    for (let index = 0; index < children.length; index++) {
        const child = children[index]
        const route = routes.find(item => item.name === child.name)
        if (!route) {
            continue
        }

        routeModule.children = routeModule.children || []

        if (!routeModule.children.find(item => item.name === route.name)) {
            routeModule.children?.push(route)
        }

        if (child.children?.length) {
            addToChildren(routes, child.children, routeModule)
        }
    }
}
