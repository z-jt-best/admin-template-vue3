<!--
    * Time    : 2021-12-03 09:48:53
    * Author  : zhangTj
    * Desc    : 页面主体部分
-->
<template>
    <Layout style="transition: all 0.2s" :style="{ marginLeft: containerStyle }">
        <AppHeader></AppHeader>
        <div
            class="overflow-y-auto relative flex-1 overflow-x-hidden"
            v-loading="appStore.getPageLoading"
            :style="{ marginTop: appStore.fixedHeader ? (appStore.tagsView ? '85px' : '47px') : '0' }"
        >
            <router-view v-slot="{ Component, route }">
                <transition name="fade-slide" mode="out-in">
                    <component :is="Component" :key="route.query ? route.fullPath : route.path" class="h-full overflow-y-auto" />
                </transition>
            </router-view>
        </div>
    </Layout>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { Layout } from 'ant-design-vue'

import AppHeader from './Header/index.vue'
import { useAppStore } from '@/store/modules/app'
import { useAppInject } from '@/hook/useAppInject'

export default defineComponent({
    name: 'AppMain',
    components: { Layout, AppHeader },
    setup(props, context) {
        const appStore = useAppStore()

        const { getIsMobile } = useAppInject()

        const containerStyle = computed(() => {
            if (getIsMobile.value) return '0'
            if (!appStore.closeSidebar) return '200px'
            return '48px'
        })

        return {
            appStore,
            containerStyle
        }
    }
})
</script>

<style lang="less" scoped></style>
