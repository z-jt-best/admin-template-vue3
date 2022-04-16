import { useRouter } from 'vue-router'

import { isString } from '@/utils/types'

const BASE_HOME = '/dashboard'

function handleError(e) {
    console.error(e)
}
;``

// page switch
export function useGo(_router) {
    let router
    if (!_router) {
        router = useRouter()
    }

    const { push, replace } = _router || router
    function go(opt = BASE_HOME, isReplace = false) {
        if (!opt) {
            return
        }
        if (isString(opt)) {
            isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError)
        } else {
            const o = opt
            isReplace ? replace(o).catch(handleError) : push(o).catch(handleError)
        }
    }
    return go
}
