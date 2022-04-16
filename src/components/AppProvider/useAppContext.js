import { createContext, useContext } from '@/hook/useContext'

const key = Symbol()

export function createAppProviderContext(context) {
    return createContext(context, key)
}

export function useAppProviderContext() {
    return useContext(key)
}
