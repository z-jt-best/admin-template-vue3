<!--
    * Time    : 2021-12-06 10:41:08
    * Author  : zhangTj
    * Desc    : 浏览过的页面标签栏
-->
<template>
    <div style="background-color: #fff; padding: 4px; border-bottom: 1px solid #e5e7eb">
        <Tabs
            :activeKey="activeKeyRef"
            @change="changeTab"
            @edit="editTab"
            type="editable-card"
            size="small"
            :tabBarGutter="3"
            :hideAdd="true"
            :animated="false"
        >
            <TabsPane v-for="tag of getTabsState" :key="tag.query ? tag.fullPath : tag.path">
                <template #tab>
                    {{ tag.meta.title }}
                </template>
            </TabsPane>
        </Tabs>
    </div>
</template>

<script>
import { defineComponent, ref, toRaw, unref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Tabs } from 'ant-design-vue'
import { useRouter } from 'vue-router'

import { useTagViewStore } from '@/store/modules/tagView'
import { listenerRouteChange } from '@/routers/routeChange'
import { REDIRECT_NAME } from '@/routers/constant'
import { useUserStore } from '@/store/modules/user'
import { useGo } from '@/hook/usePage'

export default defineComponent({
    name: 'AppTagView',
    components: { Tabs, TabsPane: Tabs.TabPane },
    setup(props, context) {
        const tagViewStore = useTagViewStore()
        const userStore = useUserStore()
        const go = useGo()
        const router = useRouter()

        const activeKeyRef = ref('')

        const getTabsState = computed(() => {
            return tagViewStore.getTabList.filter(item => !item.meta?.hideTab)
        })
        const unClose = computed(() => unref(getTabsState).length === 1)

        const changeTab = activeKey => {
            activeKeyRef.value = activeKey
            go(activeKey)
        }

        const editTab = (targetKey, action) => {
            if (unref(unClose)) {
                return
            }
            tagViewStore.closeTabByKey(targetKey, router)
        }

        const initTagView = () => {
            const affixList = ref([])

            const filterAffixTabs = routes => {
                const tabs = []
                routes &&
                    routes.forEach(route => {
                        if (route.meta && route.meta.affix) {
                            tabs.push(toRaw(route))
                        }
                    })

                return tabs
            }

            const addAffixTabs = () => {
                const affixTabs = filterAffixTabs(router.getRoutes())
                affixList.value = affixTabs
                for (let tab of affixTabs) {
                    tagViewStore.addTab({
                        name: tab.name,
                        path: tab.path,
                        meta: tab.meta
                    })
                }
            }

            let isAddAffix = false

            if (!isAddAffix) {
                addAffixTabs()
                isAddAffix = true
            }
        }

        initTagView()

        listenerRouteChange(route => {
            const { name } = route
            if (name === REDIRECT_NAME || !route || !userStore.getToken) return

            const { path, fullPath, meta = {} } = route
            const { currentActiveMenu, hideTab } = meta
            const isHide = !hideTab ? null : currentActiveMenu
            const p = isHide || fullPath || path

            if (activeKeyRef.value !== p) {
                activeKeyRef.value = p
            }

            if (isHide) {
                const findParentRoute = router.getRoutes().find(item => item.path === currentActiveMenu)

                findParentRoute && tagViewStore.addTab(findParentRoute)
            } else {
                tagViewStore.addTab(unref(route))
            }
        })

        return {
            changeTab,
            editTab,
            activeKeyRef,
            getTabsState
        }
    }
})
</script>

<script></script>

<style lang="less" scoped>
:deep(.ant-tabs-nav) {
    margin-bottom: 0;

    .ant-tabs-tab {
        display: flex;
        align-items: center;
        height: 28px;
        margin-left: 0;
        padding: 8px 12px !important;
        font-size: 12px;
        background-color: white;
        border-radius: 2px !important;
        transition: none;

        &:hover {
            .ant-tabs-tab-remove {
                opacity: 1;
            }
        }

        .ant-tabs-tab-remove {
            margin-right: -4px;
            margin-left: 4px;
            color: inherit;
            font-size: 12px;
            opacity: 0;
            transition: none;
        }

        svg {
            width: 0.7em;
        }
    }
    .ant-tabs-tab-active {
        position: relative;
        padding-left: 18px;
        background: @primary-color;
        border: 0;
        transition: none;

        .ant-tabs-tab-btn {
            color: white;
        }

        .ant-tabs-tab-remove {
            opacity: 1;
        }

        svg {
            width: 0.7em;
            fill: white;
        }
    }

    .ant-tabs-nav-more {
        height: 28px;
    }
}

:deep(.ant-tabs-top > .ant-tabs-nav::before, .ant-tabs-bottom > .ant-tabs-nav::before, .ant-tabs-top > div > .ant-tabs-nav::before, .ant-tabs-bottom
        > div
        > .ant-tabs-nav::before) {
    border: none !important;
}
</style>
