<!--
    * Time    : 2021-12-09 11:23:43
    * Author  : zhangTj
    * Desc    : 登录表单
-->
<template>
    <FormTitle />
    <Form ref="formRef" :model="formData" :rules="getFormRules" @keypress.enter="handleLogin" class="p-4 enter-x">
        <FormItem name="username" class="enter-x">
            <Input size="large" v-model:value="formData.username" placeholder="请输入账号" />
        </FormItem>
        <FormItem name="password" class="enter-x">
            <InputPassword size="large" visibilityToggle v-model:value="formData.password" placeholder="请输入密码" />
        </FormItem>
        <FormItem class="enter-x">
            <Button type="primary" size="large" block @click="handleLogin" :loading="loading">登录</Button>
        </FormItem>
    </Form>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { Checkbox, Form, Input, Row, Col, Button, Divider } from 'ant-design-vue'

import FormTitle from './FormTitle.vue'
import { useFormValid, useFormRules } from './useLogin'

import { useMessage } from '@/hook/useMessage'
import { useUserStore } from '@/store/modules/user'

export default defineComponent({
    name: 'LoginForm',
    components: { FormTitle, Checkbox, Form, FormItem: Form.Item, Input, InputPassword: Input.Password, Row, Col, Button, Divider },
    setup(props, context) {
        const formRef = ref()
        const formData = reactive({
            username: 'zhangJt',
            password: '123456'
        })
        const loading = ref(false)
        const userStore = useUserStore()

        const { validForm } = useFormValid(formRef)
        const { getFormRules } = useFormRules()
        const { notification, createErrorModal } = useMessage()

        async function handleLogin() {
            const data = await validForm()
            try {
                loading.value = true
                const userInfo = await userStore.login(data)

                if (userInfo) {
                    notification.success({
                        message: '登录成功',
                        description: `欢迎回来: ${userInfo.username}`,
                        duration: 3
                    })
                }
            } catch (e) {
                let content = ''
                if (e.response && e.response.data && e.response.data.message) {
                    content = e.response.data.message
                } else {
                    content = '网络异常，请检查您的网络连接是否正常!'
                }
                createErrorModal({
                    title: '错误提示',
                    content,
                    getContainer: () => document.body.querySelector(`.login-page`) || document.body
                })
            } finally {
                loading.value = false
            }
        }

        return {
            formRef,
            formData,
            loading,
            getFormRules,
            handleLogin
        }
    }
})
</script>

<style lang="less" scoped>
input:not([type='checkbox']) {
    min-width: 360px;

    @media (max-width: @screen-xl) {
        min-width: 320px;
    }

    @media (max-width: @screen-lg) {
        min-width: 260px;
    }

    @media (max-width: @screen-md) {
        min-width: 240px;
    }

    @media (max-width: @screen-sm) {
        min-width: 160px;
    }
}
</style>
