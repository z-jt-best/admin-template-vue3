import { defineStore } from 'pinia'
import { h } from 'vue'
import MD5 from 'crypto-js/md5'

import { store } from '../index'
import { usePermissionStore } from './permission'
import { userApi } from '@/api'
import { setToken, removeToken, getToken } from '@/utils/auth'
import { useMessage } from '@/hook/useMessage'
import { router } from '@/routers'
import { pageEnum } from '@/enums/pageEnum'

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        userInfo: null,
        token: ''
    }),
    getters: {
        getToken() {
            return this.token || getToken()
        },
        getUserInfo() {
            return this.userInfo
        }
    },
    actions: {
        setToken(token) {
            this.token = token
            setToken(token)
        },

        clearToken() {
            this.token = ''
            removeToken()
        },

        setUserInfo(userInfo) {
            this.userInfo = userInfo
        },

        resetState() {
            this.clearToken()
            this.setUserInfo(null)
        },

        async login(data) {
            try {
                // TODO => MOCK环境不需要加密
                // data.password = MD5(data.password).toString()
                await userApi.login(data)
                this.setToken(data.username)

                return this.permissionAction()
            } catch (e) {
                return Promise.reject(e)
            }
        },

        async permissionAction() {
            if (!this.getToken) return null

            const userInfo = await this.getUserInfoAction()

            const permissionStore = usePermissionStore()
            if (!permissionStore.isDynamicAddedRoute) {
                const routes = await permissionStore.processRoutes()
                routes.forEach(route => {
                    router.addRoute(route)
                })
                permissionStore.setDynamicAddedRoute(true)
            }

            router.replace(pageEnum.BASE_HOME)

            return userInfo
        },

        async getUserInfoAction() {
            if (!this.getToken) return null

            try {
                const result = await userApi.userInfo()

                this.setUserInfo(result.data)
                return result.data
            } catch (e) {
                return Promise.reject(e)
            }
        },

        async logout() {
            try {
                // await userApi.logout()
                this.clearToken()
                this.setUserInfo(null)
                router.replace(pageEnum.BASE_LOGIN)
            } catch (e) {
                console.log(e)
            }
        },

        comfirmLogout() {
            const { createConfirm } = useMessage()
            createConfirm({
                iconType: 'warning',
                title: () => h('span', '温馨提示'),
                content: () => h('span', '是否确认退出系统?'),
                onOk: async () => {
                    await this.logout()
                }
            })
        }
    }
})

export function useUserStoreWithOut() {
    return useUserStore(store)
}
