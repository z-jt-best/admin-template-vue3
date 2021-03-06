import { message as Message } from 'ant-design-vue'

/**
 * 获取请求头中的文件名
 * @param {string} name
 * @returns {Boolean}
 */
export function getFileName(name) {
    if (name && /filename=.*/gi.test(name)) {
        const fileNameReg = new RegExp(/filename=\"(.*)\"/gi)
        return decodeURI(fileNameReg.exec(name)[1])
    }
    return 'file'
}

//单例模式抽象，分离创建对象的函数和判断对象是否已经创建(第二版单例)
const createSingle = function (fn) {
    let result
    return function () {
        return result || (result = new fn(...arguments))
    }
}

// 提示框(单例模式)
class MessageModal {
    constructor() {
        this.show = false
    }

    showMessage(msg) {
        if (this.show) {
            return
        }
        this.show = true
        Message.error({
            content: msg || 'Error',
            duration: 3,
            onClose: () => {
                this.show = false
            }
        })
    }
}
const selfMessage = createSingle(MessageModal)
export const singleMessage = selfMessage()

export function openWindow(url, opt) {
    const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
    const feature = []

    noopener && feature.push('noopener=yes')
    noreferrer && feature.push('noreferrer=yes')

    window.open(url, target, feature.join(','))
}

export function getRawRoute(route) {
    if (!route) return route
    const { matched, ...opt } = route
    return {
        ...opt,
        matched: matched
            ? matched.map(item => ({
                  meta: item.meta,
                  name: item.name,
                  path: item.path
              }))
            : undefined
    }
}

// 转换成xx-xx命名
export function camelCase(str) {
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

// 转换成小驼峰命名
export function kebabCase(key) {
    const result = key.replace(/([A-Z])/g, ' $1').trim()
    return result.split(' ').join('-').toLowerCase()
}

// 首字母大写
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

// 转换成驼峰命名
export function pascalCase(str) {
    return capitalize(camelCase(str))
}
