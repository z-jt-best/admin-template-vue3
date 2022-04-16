<!--
    * Time    : 2021-12-07 17:38:40
    * Author  : zhangTj
    * Desc    : Icon选择器 => TODO 需要读取本地的icon data
-->
<template>
    <Popover title="请选择图标" overlayClassName="icon-picker-popover" trigger="click" placement="bottomLeft">
        <template #content>
            <div>
                <div class="py-4 px-2">
                    <FormItemRest>
                        <Input v-model="searchValue" @change="debounceHandleSearchChange" allow-clear placeholder="搜索图标" />
                    </FormItemRest>
                </div>
                <ScrollContainer>
                    <ul class="flex flex-wrap px-2">
                        <li
                            v-for="iconItem in getPaginationList"
                            :key="iconItem"
                            @click="selectIcon(iconItem)"
                            class="p-2 w-1/8 cursor-pointer mr-1 mt-1 flex justify-center items-center border border-solid hover:border-primary"
                            :class="modelValue === iconItem ? 'border border-primary' : ''"
                        >
                            <Icon :icon="iconItem" />
                        </li>
                    </ul>
                </ScrollContainer>
                <div class="py-4 pr-4 flex justify-end">
                    <FormItemRest>
                        <Pagination size="small" :pageSize="pageSize" :total="getTotal" @change="handlePageChange" :showSizeChanger="false" />
                    </FormItemRest>
                </div>
            </div>
        </template>
        <Input :value="modelValue" allow-clear :style="{ width: `${width}px` }">
            <template #prefix>
                <Icon v-if="modelValue" :icon="modelValue" />
            </template>
        </Input>
    </Popover>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { Input, Popover, Pagination, FormItemRest } from 'ant-design-vue'
import { number, string } from 'vue-types'
import { useDebounceFn } from '@vueuse/core'

import IconList from '../data/icons.data'
import { usePagination } from '@/hook/usePagination'
import ScrollContainer from '@/components/ScrollContainer'
import Icon from './Icon.vue'

export default defineComponent({
    name: 'IconPicker',
    components: { Input, Popover, ScrollContainer, Icon, Pagination, FormItemRest },
    props: {
        modelValue: string().isRequired,
        pageSize: number().def(150),
        width: number().def(300)
    },
    setup(props, context) {
        const currentList = ref(IconList)
        const searchValue = ref('')

        const { getPaginationList, getTotal, setCurrentPage } = usePagination(currentList, props.pageSize)

        const selectIcon = icon => {
            context.emit('update:modelValue', props.modelValue === icon ? '' : icon)
        }

        function handlePageChange(page) {
            setCurrentPage(page)
        }

        function handleSearchChange(e) {
            const value = e.target.value
            if (!value) {
                setCurrentPage(1)
                currentList.value = IconList
                return
            }
            currentList.value = IconList.filter(item => item.includes(value))
        }

        const debounceHandleSearchChange = useDebounceFn(handleSearchChange, 100)

        return {
            getPaginationList,
            getTotal,
            setCurrentPage,
            selectIcon,
            handlePageChange,
            searchValue,
            debounceHandleSearchChange
        }
    }
})
</script>

<style lang="less">
.icon-picker-popover {
    width: 400px;

    .ant-input-group-addon {
        padding: 0;
    }

    .ant-popover-inner-content {
        padding: 0;
    }

    .scrollbar {
        height: 220px;
    }
}
</style>
