import { PAGE_NOT_FOUND_NAME, LAYOUT, EXCEPTION_COMPONENT, REDIRECT_NAME, REDIRECT_COMPONENT } from './constant'

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE = {
    path: '/:path(.*)*',
    name: PAGE_NOT_FOUND_NAME,
    component: LAYOUT,
    meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true
    },
    children: [
        {
            path: '/:path(.*)*',
            name: PAGE_NOT_FOUND_NAME,
            component: EXCEPTION_COMPONENT,
            meta: {
                title: 'ErrorPage',
                hideBreadcrumb: true,
                hideMenu: true
            }
        }
    ]
}

export const REDIRECT_ROUTE = {
    path: '/redirect',
    component: LAYOUT,
    name: 'RedirectTo',
    meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
        hideMenu: true
    },
    children: [
        {
            path: '/redirect/:path(.*)',
            name: REDIRECT_NAME,
            component: REDIRECT_COMPONENT,
            meta: {
                title: REDIRECT_NAME,
                hideBreadcrumb: true
            }
        }
    ]
}
