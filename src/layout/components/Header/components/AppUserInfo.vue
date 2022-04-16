<!--
    * Time    : 2021-12-06 10:25:22
    * Author  : zhangTj
    * Desc    : 用户头像
-->
<template>
    <div class="flex items-center px-2 hover:bg-gray-100 transition-all">
        <Dropdown>
            <div>
                <Avatar shape="square" src="https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640" />
                <span class="px-2">{{ userStore?.userInfo?.username ?? '-' }}</span>
            </div>
            <template #overlay>
                <Menu @click="handleMenuItem">
                    <MenuItem key="index">
                        <a href="javascript:;">返回首页</a>
                    </MenuItem>
                    <MenuItem key="logout">
                        <span>退出登录</span>
                    </MenuItem>
                </Menu>
            </template>
        </Dropdown>
    </div>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { Dropdown, Avatar, Menu } from 'ant-design-vue'

import { useGo } from '@/hook/usePage'
import { useUserStore } from '@/store/modules/user'

export default defineComponent({
    name: 'AppUserInfo',
    components: { Dropdown, Avatar, Menu, MenuItem: Menu.Item },
    setup(props, context) {
        const go = useGo()
        const userStore = useUserStore()

        const handleMenuItem = function ({ key }) {
            if (key === 'index') {
                go('/')
            }
            if (key === 'logout') {
                userStore.comfirmLogout()
            }
        }

        return {
            handleMenuItem,
            userStore
        }
    }
})
</script>

<style lang="less" scoped></style>
