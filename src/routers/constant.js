export const REDIRECT_NAME = 'Redirect'

export const PAGE_NOT_FOUND_NAME = 'PageNotFound'

export const EXCEPTION_COMPONENT = () => import('@/views/moduleBasic/exception.vue')
export const REDIRECT_COMPONENT = () => import('@/views/moduleBasic/redirect.vue')

export const LAYOUT = () => import('@/layout/index.vue')

export const getParentLayout = _name => {
    return () =>
        new Promise(resolve => {
            resolve({
                name: 'ParentLayout'
            })
        })
}
