import { resultSuccess, resultError, getRequestToken, resultFailToken } from './_result'

export const userList = [
    {
        userId: 1,
        username: 'zhangJt',
        realName: 'zhangJt user',
        avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
        desc: 'manager',
        token: 'zhangJt',
        password: '123456'
    },
    {
        userId: 2,
        username: 'test',
        realName: 'test user',
        avatar: 'https://q1.qlogo.cn/g?b=qq&nk=339449197&s=640',
        desc: 'tester',
        token: 'fakeToken2',
        password: '111111'
    }
]

export const getTargetUser = token => userList.find(item => token === item.token)

export default [
    {
        url: '/dev/login',
        method: 'post',
        response: ({ body }) => {
            const { username, password } = body

            const user = userList.find(item => password === item.password && username === item.username)
            if (!user) return resultError('账号或密码错误!')

            return resultSuccess({
                token: user.token
            })
        }
    },
    {
        url: '/dev/userInfo',
        method: 'get',
        response: request => {
            const token = getRequestToken(request)
            if (!token) return resultFailToken()

            const user = getTargetUser(token)
            if (!user) return resultError('当前用户不存在')

            return resultSuccess(user)
        }
    },
    {
        url: '/dev/logout',
        method: 'post',
        response: request => {
            const token = getRequestToken(request)
            if (!token) return resultFailToken()

            const user = getTargetUser(token)
            if (!user) return resultError('当前用户不存在')

            return resultSuccess('退出登录成功!')
        }
    }
]
