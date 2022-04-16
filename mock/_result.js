export function resultSuccess(data, message = 'ok') {
    return {
        code: 200,
        data,
        message
    }
}

export function resultError(message = '请求错误, 请检查参数', data = null) {
    return {
        code: -10000,
        data,
        message
    }
}

export function resultFailToken() {
    return {
        code: 403,
        data: null,
        message: '无效token'
    }
}

export function getRequestToken({ headers }) {
    return headers?.token
}
