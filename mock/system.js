import { resultSuccess, resultError, getRequestToken, resultFailToken } from './_result'
import { getTargetUser } from './user'

import Mock from 'mockjs'

export default [
    {
        url: '/dev/demo-table',
        method: 'get',
        response: request => {
            const token = getRequestToken(request)
            if (!token) return resultFailToken()

            const user = getTargetUser(token)
            if (!user) return resultError('当前用户不存在')

            const keyName = `tableList|${request.query.pageSize}`

            const tableData = Mock.mock({
                [keyName]: [
                    {
                        id: '@id',
                        username: '@name',
                        realname: '@cname',
                        password: '@string(6, 16)',
                        roleId: '@range(1, 3)',
                        customerId: '@integer(1, 3)',
                        createTime: '@date()'
                    }
                ],
                total: 120
            })

            return resultSuccess(tableData)
        }
    },
    {
        url: '/dev/demo-table/delete',
        method: 'delete',
        response: request => {
            const token = getRequestToken(request)
            if (!token) return resultFailToken()

            const user = getTargetUser(token)
            if (!user) return resultError('当前用户不存在')

            return resultSuccess(null)
        }
    },
    {
        url: '/dev/demo-table/create',
        method: 'post',
        response: request => {
            const token = getRequestToken(request)
            if (!token) return resultFailToken()

            const user = getTargetUser(token)
            if (!user) return resultError('当前用户不存在')

            return resultSuccess(null)
        }
    },
    {
        url: '/dev/demo-table/update',
        method: 'put',
        response: request => {
            const token = getRequestToken(request)
            if (!token) return resultFailToken()

            const user = getTargetUser(token)
            if (!user) return resultError('当前用户不存在')

            return resultSuccess(null)
        }
    }
]
