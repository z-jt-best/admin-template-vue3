import { resultSuccess, resultError, getRequestToken, resultFailToken } from './_result'
import { getTargetUser } from './user'

/**
 * 当一个模块下只有一个页面时, 那么父route就可以使用 hideChildrenInMenu: true, 那么只会显示父route
 * 但是需要指定父route的 redirect 字段, 不然无法显示正确内容
 * meta: {
 *  hideChildrenInMenu: 隐藏所有子菜单项
 *  hideMenu: 该路由不显示在菜单中
 *  hideBreadcrumb: 该路由不在面包屑中显示
 *  currentActiveMenu: path 当显示该路由时, 菜单高亮指定path的菜单项, 这个一般用在不显示路由时高亮同级的其他路由或父路由
 *  ignoreKeepAlive: true/false 默认情况下是全部路由都走keep-alive, false则不缓存, 目前这个功能先不做 TODO
 *  frameSrc: 外链链接, 需要一个完整的路径
 *  affix: 固定在tagview组件中
 *  hideTab: 不显示在tagView组件中
 * }
 *
 * 多级路由注意事项:
 * 除了一级和最后一级需要指定component字段, 中间的过渡路由并不需要指定从component字段, 因为这些中间字段会被废弃掉(全部做成二级路由)
 */
const permissionRouteList = [
    {
        name: 'dashboard',
        path: '/dashboard',
        component: 'LAYOUT',
        redirect: '/dashboard/analysis',
        meta: {
            title: '首页',
            icon: 'ant-design:home-outlined',
            hideChildrenInMenu: true
        },
        children: [
            {
                name: 'analysis',
                path: 'analysis',
                component: '/moduleBasic/analysis',
                meta: {
                    title: '分析页',
                    hideMenu: true,
                    currentActiveMenu: '/dashboard'
                }
            }
        ]
    },
    {
        name: 'table',
        path: '/table',
        component: 'LAYOUT',
        redirect: '/table/tableList',
        meta: {
            title: 'demo页面',
            icon: 'ant-design:home-outlined'
        },
        children: [
            {
                name: 'tableList',
                path: 'tableList',
                component: '/demo/table/tableList',
                meta: {
                    title: 'crud列表页',
                    hideBreadcrumb: true
                }
            },
            {
                name: 'tableForm',
                path: 'tableForm',
                component: '/demo/table/tableForm',
                meta: {
                    title: 'crud表单页'
                }
            }
        ]
    },
    {
        path: '/level',
        name: 'Level',
        component: 'LAYOUT',
        redirect: '/level/menu1/menu1-1/menu1-1-1',
        meta: {
            icon: 'ant-design:appstore-outlined',
            title: '嵌套菜单'
        },

        children: [
            {
                path: 'menu1',
                name: 'Menu1Demo',
                meta: {
                    title: 'Menu1'
                },
                children: [
                    {
                        path: 'menu1-1',
                        name: 'Menu11Demo',
                        meta: {
                            title: 'Menu1-1'
                        },
                        children: [
                            {
                                path: 'menu1-1-1',
                                name: 'Menu111Demo',
                                component: '/demo/level/menu111',
                                meta: {
                                    title: 'Menu111'
                                }
                            },
                            {
                                path: 'menu1-1-2',
                                name: 'Menu112Demo',
                                component: '/demo/level/menu112',
                                meta: {
                                    title: 'Menu112'
                                }
                            }
                        ],
                        component: 'levelMenu'
                    },
                    {
                        path: 'menu1-2',
                        name: 'Menu12Demo',
                        component: '/demo/level/menu12',
                        meta: {
                            title: 'Menu1-2'
                        }
                    }
                ],
                component: 'levelMenu'
            },
            {
                path: 'menu2',
                name: 'Menu2Demo',
                component: '/demo/level/menu2',
                meta: {
                    title: 'Menu2',
                    frameSrc: ''
                }
            }
        ]
    }
]

export default [
    {
        url: '/dev/menuList',
        method: 'get',
        response: request => {
            const token = getRequestToken(request)
            if (!token) return resultFailToken()

            const user = getTargetUser(token)
            if (!user) return resultError('当前用户不存在')

            return resultSuccess(permissionRouteList)
        }
    }
]
