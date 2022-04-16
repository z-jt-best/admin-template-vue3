import { cloneDeep } from 'lodash-es'

import { treeMap } from '@/utils/treeHelper'
import { isUrl } from '@/utils/types'

export function transformRouteToMenu(routeList) {
    const cloneRouteList = cloneDeep(routeList)

    const list = treeMap(cloneRouteList, {
        conversion: node => {
            const { meta: { title, hideMenu = false } = {} } = node

            return {
                ...(node.meta || {}),
                meta: node.meta,
                name: title, // 这里重写了路由的name值(这个name可能在菜单组件中使用到, 并不影响路由的name值)
                hideMenu,
                path: node.path,
                ...(node.redirect ? { redirect: node.redirect } : {})
            }
        }
    })

    joinParentPath(list)
    return cloneDeep(list)
}

function joinParentPath(menuList, parentPath = '') {
    for (let index = 0; index < menuList.length; index++) {
        const menu = menuList[index]

        if (!menu.path.startsWith('/') || isUrl(menu.path)) {
            menu.path = `${parentPath}/${menu.path}`
        }
        if (menu?.children?.length) {
            joinParentPath(menu.children, menu.path)
        }
    }
}
