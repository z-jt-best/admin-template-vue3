import { baseRequery } from './init'

const userApi = {
    login: data => baseRequery.post('/dev/login', data),

    userInfo: data => baseRequery.get('/dev/userInfo', data),

    logout: () => baseRequery.post('/dev/logout'),

    menuList: () => baseRequery.get('/dev/menuList')
}

export { userApi }
