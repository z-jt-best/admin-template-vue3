<!--
    * Time    : 2022-01-04 14:29:11
    * Author  : zhangTj
    * Desc    : 可滚动容器
-->
<template>
    <ScrollBar ref="scrollbarRef" class="scroll-wrapper" v-bind="$attrs">
        <slot></slot>
    </ScrollBar>
</template>

<script>
import { defineComponent } from 'vue'

import ScrollBar from '@/components/ScrollBar/src/ScrollBar.vue'

export default defineComponent({
    name: 'ScrollContainer',
    components: { ScrollBar }
})
</script>

<style lang="less">
.scroll-wrapper {
    width: 100%;
    height: 100%;

    .scrollbar__wrap {
        margin-bottom: 18px !important;
        overflow-x: hidden;
    }

    .scrollbar__view {
        box-sizing: border-box;
    }
}
</style>
