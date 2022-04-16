import { ref, watch, unref } from 'vue'
import { useThrottleFn, useDebounceFn } from '@vueuse/core'

// 监听指定元素指定事件的listener(默认监听window)
export function useEventListener({ el = window, name, listener, options, autoRemove = true, isDebounce = true, wait = 80 }) {
    /* eslint-disable-next-line */
    let remove = () => {}
    const isAddRef = ref(false)

    if (el) {
        // 这里初始化相关配置, 添加元素响应式, 为linstener添加防抖, 创建remove和add的linstener
        const element = ref(el)

        const handler = isDebounce ? useDebounceFn(listener, wait) : useThrottleFn(listener, wait)
        const realHandler = wait ? handler : listener
        const removeEventListener = e => {
            isAddRef.value = true
            e.removeEventListener(name, realHandler, options)
        }
        const addEventListener = e => e.addEventListener(name, realHandler, options)

        /**
         * 马上为element添加相关的listener
         * 如果监听的element更换了, 马上清除相关的listener
         */
        const removeWatch = watch(
            element,
            (v, _ov, cleanUp) => {
                if (v) {
                    !unref(isAddRef) && addEventListener(v)

                    // 手动停止时会触发清除副作用
                    cleanUp(() => {
                        autoRemove && removeEventListener(v)
                    })
                }
            },
            { immediate: true }
        )

        // 清除相关listner
        remove = () => {
            removeEventListener(element.value)
            removeWatch()
        }
    }
    return { removeEvent: remove }
}
