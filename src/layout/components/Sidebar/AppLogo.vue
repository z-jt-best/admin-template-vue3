<!--
    * Time    : 2021-12-03 09:41:03
    * Author  : zhangTj
    * Desc    : LOGO部分
-->

<template>
    <div class="logo-wrapper">
        <img src="@/assets/images/logo.png" class="logo" alt="首页" />
        <div v-show="!appStore.closeSidebar" class="text-white ml-2 font-bold" style="transition: all 0.1s">{{ appStore.title }}</div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

import { useAppStore } from '@/store/modules/app'

export default defineComponent({
    name: 'AppLogo',
    setup() {
        const appStore = useAppStore()

        return {
            appStore
        }
    }
})
</script>

<style lang="less" scoped>
.logo-wrapper {
    height: 48px;
    padding: 10px 4px 10px 7px;
    @apply cursor-pointer flex items-center;

    .logo {
        width: 32px;
        height: 32px;
    }
}
</style>
