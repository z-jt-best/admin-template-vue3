<!--
    * Time    : 2021-12-09 09:34:44
    * Author  : zhangTj
    * Desc    : 登录页
-->
<template>
    <div class="login-page min-h-full overflow-hidden relative w-full h-full px-4">
        <div class="container relative h-full py-2 mx-auto sm:px-10" style="margin-top: 48px">
            <div class="flex h-full">
                <div class="hidden min-h-full pl-4 mr-4 xl:flex xl:flex-col xl:w-6/12">
                    <AppLogo class="-enter-x absolute" style="top: 12px; width: 60%" />
                    <div class="my-auto">
                        <img src="@/assets/svg/login-box-bg.svg" class="w-1/2 -mt-16 -enter-x" alt="管理后台" />
                        <div class="mt-10 font-medium text-white -enter-x">
                            <span class="inline-block mt-4 text-3xl">看天下中后台管理系统</span>
                        </div>
                        <div class="mt-5 font-normal text-white text-md dark:text-gray-500 -enter-x">输入您的个人详细信息开始使用！</div>
                    </div>
                </div>
                <div class="flex w-full h-full py-5 xl:h-auto xl:py-0 xl:my-0 xl:w-6/12">
                    <div
                        class="login-form relative w-full px-5 py-8 mx-auto my-auto rounded-md shadow-md xl:ml-16 xl:bg-transparent sm:px-8 xl:p-4 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto enter-x"
                    >
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted, onUnmounted } from 'vue'

import AppLogo from '@/layout/components/Sidebar/AppLogo.vue'
import LoginForm from './LoginForm.vue'

export default defineComponent({
    name: 'login',
    components: { AppLogo, LoginForm },
    setup(props, context) {
        return {}
    }
})
</script>

<style lang="less" scoped>
.login-page {
    @media (max-width: @screen-xl) {
        background-color: #293146;

        .login-form {
            background-color: #fff;
        }
    }

    &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin-left: -48%;
        background-image: url('@/assets/svg/login-bg.svg');
        background-repeat: no-repeat;
        background-position: 100%;
        background-size: auto 100%;
        content: '';
        @media (max-width: @screen-xl) {
            display: none;
        }
    }
}

:deep(.logo-wrapper) {
    height: 80px;
    .logo {
        width: 48px !important;
        height: 48px !important;
    }
    > div {
        font-weight: normal;
        font-size: 24px;
    }
}
</style>
