/**
 * 监听当前路由变化, 改变Page的title显示
 */
import { unref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'

// TODO => 未完成
export function usePageTitle() {
    const { currentRoute } = useRouter()
    const pageTitle = useTitle()

    watch(
        () => currentRoute.value.path,
        () => {
            const route = unref(currentRoute)

            if (route.name === 'redict') {
                return
            }
            const newTitle = route?.meta?.title ?? 'no title'
            pageTitle.value = newTitle ? `testiingTitle - ${newTitle}` : `testingTitle`
        }
    )
}
