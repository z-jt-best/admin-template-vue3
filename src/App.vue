<template>
    <ConfigProvider :locale="zhCN">
        <AppProvider>
            <router-view></router-view>
        </AppProvider>
    </ConfigProvider>
</template>

<script>
import { defineComponent } from 'vue'
import { ConfigProvider } from 'ant-design-vue'
// 配置中文
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

import AppProvider from '@/components/AppProvider/index.vue'

export default defineComponent({
    name: 'App',
    components: {
        ConfigProvider,
        AppProvider
    },
    setup() {
        return {
            zhCN
        }
    }
})
</script>
