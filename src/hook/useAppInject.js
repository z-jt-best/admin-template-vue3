/**
 * 获取AppProvide的provide值
 */

import { useAppProviderContext } from '@/components/AppProvider/useAppContext'
import { computed, unref } from 'vue'

export function useAppInject() {
    const values = useAppProviderContext()

    return {
        getIsMobile: computed(() => unref(values.isMobile))
    }
}
