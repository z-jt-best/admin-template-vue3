import axios from 'axios'
import { message as Message } from 'ant-design-vue'
import qs from 'qs'

import { router } from '@/routers'
import { singleMessage, getFileName } from './index'
import { useAppStore } from '@/store/modules/app'
import { getToken } from './auth'
import { pageEnum } from '@/enums/pageEnum'
import { useUserStoreWithOut } from '@/store/modules/user'

const service = axios.create({
    baseURL: '',
    timeout: 30000
})

const userStore = useUserStoreWithOut()

// request拦截器
service.interceptors.request.use(
    config => {
        if (getToken()) {
            config.headers['token'] = getToken()
        }

        return config
    },
    error => {
        console.log('请求错误：', error) // for debug
        return Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        if (response.status !== 200) {
            singleMessage.showMessage(response.message)
            return Promise.reject(new Error(response.message || 'Error'))
        }
        // 如果是文件流，则返回response
        else if (response.request.responseType === 'blob') {
            return response
        } else {
            return response.data
        }
    },
    error => {
        console.log('response错误了：' + error) // for debug

        // 401相关操作
        if (error.response && error.response.status === 401) {
            singleMessage.showMessage(error.response.data.message || '网络请求异常, 请检查您的网络设置后刷新重试!')
            userStore.resetState()
            router.replace({
                path: pageEnum.BASE_LOGIN,
                query: {
                    redirect: location.pathname + location.search
                }
            })
            return Promise.reject(error)
        }
        if (error.response && error.response.data) {
            singleMessage.showMessage(error.response.data.message || '网络请求异常, 请检查您的网络设置后刷新重试!')
            return Promise.reject(error)
        }
        singleMessage.showMessage('网络请求异常, 请检查您的网络设置后刷新重试!')
        return Promise.reject(error)
    }
)

export default service

class BaseRequest {
    constructor(baseURL = '', config = {}) {
        this.baseAxios = service
        this.baseURL = baseURL
        this.config = config
        this.optionsObj = {
            globalLoading: false, // 全局loading
            showToast: true // 提示信息(业务状态码不正确时弹出)
        }
    }

    // 基类方法
    sendRequest(config, options) {
        const url = this.baseURL + config.url
        const baseconfig = Object.assign({}, this.config, config, { url })
        const finalOpt = { ...this.optionsObj, ...options }

        const appStore = useAppStore()

        // 是否显示全局loading
        if (finalOpt.globalLoading) {
            appStore.setPageLoading(true)
        }

        return new Promise((resolve, reject) => {
            this.baseAxios
                .request(baseconfig)
                .then(res => {
                    // 成功的请求，但是业务状态码不对
                    if (res.code !== 200 && finalOpt.showToast) {
                        singleMessage.showMessage(res.message)

                        if (res.code === -10000) {
                            reject(res)
                        }

                        // 业务状态码403
                        if (res.code === 403) {
                            router.replace(pageEnum.BASE_LOGIN)
                            reject(res)
                        }
                    } else {
                        resolve(res)
                    }
                })
                .catch(err => {
                    reject(err)
                })
                .finally(_ => {
                    appStore.setPageLoading(false)
                })
        })
    }

    get(url, params, options, config = {}) {
        return this.sendRequest(
            {
                method: 'GET',
                url,
                params,
                ...config
            },
            options
        )
    }

    post(url, data, options, config = {}) {
        return this.sendRequest(
            {
                method: 'POST',
                url,
                data,
                ...config
            },
            options
        )
    }

    // 表单提交
    postForm(url, data, options, config = {}) {
        return this.sendRequest(
            {
                method: 'POST',
                url,
                data: qs.stringify(data),
                ...config
            },
            options
        )
    }

    put(url, data, options, config = {}) {
        return this.sendRequest(
            {
                method: 'PUT',
                url,
                data,
                ...config
            },
            options
        )
    }

    delete(url, data, options, config = {}) {
        return this.sendRequest(
            {
                method: 'DELETE',
                url,
                data,
                ...config
            },
            options
        )
    }

    // 下载文件
    getFile(url, data) {
        const requestParmams = {
            url: url,
            method: 'get',
            params: data,
            data: { getFile: true },
            headers: { 'content-type': 'application/json' },
            responseType: 'blob'
        }
        return new Promise((resolve, reject) => {
            this.sendRequest(requestParmams, { showToast: false })
                .then(res => {
                    // 如果是二进制的，则进行下载
                    const fileContent = new Blob([res.data])
                    const link = document.createElement('a') // a标签下载
                    link.href = window.URL.createObjectURL(fileContent)
                    const fileName = getFileName(res.headers['content-disposition'])
                    link.download = fileName
                    link.click()
                    window.URL.revokeObjectURL(link.href)
                    Message.success({
                        content: '导出成功',
                        duration: 3
                    })
                    resolve()
                })
                .catch(err => {
                    console.log('下载文件失败：', err)
                    Message.error({
                        content: '导出失败',
                        duration: 3
                    })
                    reject()
                })
        })
    }
}

export { BaseRequest }
