<!--
    * Time    : 2021-12-16 15:05:23
    * Author  : zhangTj
    * Desc    : file description
-->
<template>
    <div class="app-container" style="padding-top: 0">
        <div class="md:flex">
            <template v-for="(item, index) in growCardList" :key="item.title">
                <Card size="small" :loading="loading" :title="item.title" class="md:w-1/4 w-full card-item">
                    <template #extra>
                        <Tag :color="item.color">{{ item.action }}</Tag>
                    </template>

                    <div class="py-4 px-4 flex justify-between items-center">
                        <CountTo prefix="$" :startVal="1" :endVal="item.value" class="text-2xl" />
                    </div>

                    <div class="p-2 px-4 flex justify-between">
                        <span>总{{ item.title }}</span>
                        <CountTo prefix="$" :startVal="1" :endVal="item.total" />
                    </div>
                </Card>
            </template>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { Card, Tag } from 'ant-design-vue'

import CountTo from '@/components/CountTo'

export default defineComponent({
    name: 'analysis',
    components: { Card, CountTo, Tag },
    setup(props, context) {
        const growCardList = [
            {
                title: '访问数',
                value: 2000,
                total: 120000,
                color: 'green',
                action: '月'
            },
            {
                title: '成交额',
                value: 20000,
                total: 500000,
                color: 'blue',
                action: '月'
            },
            {
                title: '下载数',
                value: 8000,
                total: 120000,
                color: 'orange',
                action: '周'
            },
            {
                title: '成交数',
                value: 5000,
                total: 50000,
                color: 'purple',
                action: '年'
            }
        ]

        const loading = ref(true)

        onMounted(() => {
            setTimeout(() => {
                loading.value = false
            }, 1500)
        })

        onUnmounted(() => {})

        return {
            growCardList,
            loading
        }
    }
})
</script>

<style lang="less" scoped>
.card-item {
    @apply lg:mr-4 sm:mt-4;
}
</style>
