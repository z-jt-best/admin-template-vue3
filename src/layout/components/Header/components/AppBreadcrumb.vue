<!--
    * Time    : 2021-12-06 09:38:05
    * Author  : zhangTj
    * Desc    : 面包屑
-->
<template>
    <div class="px-2">
        <Breadcrumb :routes="routes">
            <template #itemRender="{ route }">
                <span v-if="routes.indexOf(route) === routes.length - 1">
                    {{ route.name || route.meta.title }}
                </span>
                <router-link v-else to="" @click="handleClick(route, $event)">
                    {{ route.name || route.meta.title }}
                </router-link>
            </template>
        </Breadcrumb>
    </div>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, computed, watch, watchEffect, onMounted, onUnmounted } from 'vue'
import { Breadcrumb } from 'ant-design-vue'
import { usePermissionStore } from '@/store/modules/permission'
import { pageEnum } from '@/enums/pageEnum'
import { useRouter } from 'vue-router'
import { filter } from '@/utils/treeHelper'
import { isString } from '@/utils/types'
import { useGo } from '@/hook/usePage'
import { REDIRECT_NAME } from '@/routers/constant'

export default defineComponent({
    name: 'AppBreadcrumb',
    components: { Breadcrumb },
    setup(props, context) {
        const routes = ref([])

        const permissionStore = usePermissionStore()
        const { currentRoute } = useRouter()
        const go = useGo()

        const getMenus = () => {
            return permissionStore.getMenuList.filter(item => !item.meta?.hideMenu && !item.hideMenu)
        }

        function getParentPathList(parentPath) {
            if (!parentPath) return []

            return parentPath.reduce((arr, item, index) => {
                if (item.startsWith('/')) {
                    arr.push(item)
                } else {
                    arr.push([arr[index - 1], item].join('/'))
                }
                return arr
            }, [])
        }

        const getMatchedRoutes = (menus, parentPath) => {
            const matched = []
            menus.forEach(item => {
                if (parentPath.includes(item.path)) {
                    matched.push({
                        ...item,
                        name: item.meta?.title || item.name
                    })
                }
                if (item.children?.length) {
                    matched.push(...getMatchedRoutes(item.children, parentPath))
                }
            })
            return matched
        }

        const filterItem = list => {
            return filter(list, item => {
                const { meta, name } = item
                if (!meta) {
                    return !!name
                }
                const { title, hideBreadcrumb } = meta
                if (!title || hideBreadcrumb) {
                    return false
                }
                return true
            }).filter(item => !item.meta?.hideBreadcrumb)
        }

        watchEffect(() => {
            if (currentRoute.value.name === REDIRECT_NAME || currentRoute.value.path === pageEnum.BASE_LOGIN) return

            const menus = getMenus()

            const parenRoute = currentRoute.value.meta.parentPath ? menus.filter(item => item.path === currentRoute.value.meta.parentPath[0]) : []

            const parentPathList = getParentPathList(currentRoute.value.meta?.parentPath)
            if (!currentRoute.value.meta.currentActiveMenu) {
                parentPathList.push(currentRoute.value.path)
            }

            const matchedRoutes = getMatchedRoutes(parenRoute, parentPathList)

            const breadcrumbList = filterItem(matchedRoutes)

            // 如果存在meta.currentActiveMenu字段,则手动添加一个
            if (currentRoute.value.meta?.currentActiveMenu) {
                breadcrumbList.push({
                    ...currentRoute.value,
                    name: currentRoute.value.meta?.title || currentRoute.value.name
                })
            }

            routes.value = breadcrumbList
        })

        const handleClick = (route, event) => {
            event?.preventDefault()

            const { children, redirect } = route
            if (children?.length && !redirect) {
                event?.stopPropagation()
                return
            }

            if (redirect && isString(redirect)) {
                go(redirect)
            } else {
                go(route.path)
            }
        }

        return {
            routes,
            handleClick
        }
    }
})
</script>

<style lang="less" scoped></style>
