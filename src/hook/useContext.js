import { provide, inject, reactive, readonly as defineReadonly } from 'vue'

// 通用的Context，提供相关的key和provide的context值，后续可以通过通用的useContext获取
export function createContext(context, key = Symbol(), options = {}) {
    const { readonly = true, createProvider = false, native = false } = options

    const state = reactive(context)
    const provideData = readonly ? defineReadonly(state) : state
    !createProvider && provide(key, native ? context : provideData)

    return {
        state
    }
}

// 通用的inject，获取执行key的provide值
export function useContext(key = Symbol(), defaultValue) {
    return inject(key, defaultValue || {})
}
