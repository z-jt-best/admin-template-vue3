import { baseRequery } from './init'

const demoApi = {
    curd: {
        get: data => baseRequery.get('/dev/demo-table', data),
        create: data => baseRequery.post('/dev/demo-table/create', data),
        update: data => baseRequery.put('/dev/demo-table/update', data),
        delete: data => baseRequery.delete('/dev/demo-table/delete', data)
    }
}

export { demoApi }
