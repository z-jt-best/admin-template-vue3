import { ref, computed, unref, isRef, toRaw } from 'vue'

export const LoginStatusEnum = {
    LOGIN: '登录',
    REGISTER: '注册',
    RESET_PASSWORD: '重置密码',
    MOBILE: '手机登录',
    QR_CODE: '二维码登录'
}

const cureentStatus = ref(LoginStatusEnum.LOGIN)

export function useLoginStatus() {
    const getLoginStatus = computed(() => cureentStatus.value)

    const setLoginStatus = status => {
        cureentStatus.value = status
    }

    return {
        getLoginStatus,
        setLoginStatus
    }
}

export function useFormValid(formRef) {
    async function validForm() {
        const form = unref(formRef)
        if (!form) return
        const data = await form.validate()
        return data
    }

    return { validForm }
}

export function useFormRules() {
    const getAccountFormRule = computed(() => createRule('请输入账号'))
    const getPasswordFormRule = computed(() => createRule('请输入密码'))

    const getFormRules = computed(() => {
        switch (unref(cureentStatus)) {
            case LoginStatusEnum.LOGIN:
                return {
                    username: unref(getAccountFormRule),
                    password: unref(getPasswordFormRule)
                }
            default:
                return {}
        }
    })

    return { getFormRules }
}

function createRule(message) {
    return [
        {
            required: true,
            message,
            trigger: 'change'
        }
    ]
}
