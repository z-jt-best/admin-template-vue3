/**
 * 创建屏幕尺寸断点 listener hook
 */

import { ref, computed, unref } from 'vue'

import { sizeEnum, screenEnum, screenMap } from '@/enums/breakpointEnum'
import { useEventListener } from './useEventListener'

/**
 * 监听屏幕改变的listen函数
 * @param fn 接受一个函数, 该函数将会初始化时调用一次, 在后续的监听listener中也会被调用
 * @returns 屏幕宽度的相关参数
 */
export function createBreakpointListen(fn) {
    const screenRef = ref(sizeEnum.XL)
    const realWidthRef = ref(window.innerWidth)

    // 获取window的宽度
    function getWindowWidth() {
        const width = document.body.clientWidth || window.innerWidth
        const xs = screenMap.get(sizeEnum.XS)
        const sm = screenMap.get(sizeEnum.SM)
        const md = screenMap.get(sizeEnum.MD)
        const lg = screenMap.get(sizeEnum.LG)
        const xl = screenMap.get(sizeEnum.XL)
        if (width < xs) {
            screenRef.value = sizeEnum.XS
        } else if (width < sm) {
            screenRef.value = sizeEnum.SM
        } else if (width < md) {
            screenRef.value = sizeEnum.MD
        } else if (width < lg) {
            screenRef.value = sizeEnum.LG
        } else if (width < xl) {
            screenRef.value = sizeEnum.XL
        } else {
            screenRef.value = sizeEnum.XXL
        }
        realWidthRef.value = width
    }

    // 监听window.resize事件变化的listen函数
    useEventListener({
        el: window,
        name: 'resize',

        // listener要执行的函数
        listener: () => {
            getWindowWidth()
            resizeFn()
        }
        // wait: 100,
    })

    getWindowWidth()
    let globalScreenRef = computed(() => unref(screenRef))
    let globalWidthRef = computed(() => screenMap.get(unref(screenRef)))
    let globalRealWidthRef = computed(() => unref(realWidthRef))

    function resizeFn() {
        fn?.({
            screen: globalScreenRef,
            width: globalWidthRef,
            realWidth: globalRealWidthRef,
            screenEnum,
            screenMap,
            sizeEnum
        })
    }

    resizeFn()
    return {
        screenRef: globalScreenRef,
        screenEnum,
        widthRef: globalWidthRef,
        realWidthRef: globalRealWidthRef
    }
}
