import { defineComponent, createVNode, render, reactive, h } from 'vue'

import Loading from './Loading.vue'

export function createLoading(props, target, wait) {
    let vm = null

    const data = reactive({
        tip: '',
        loading: true,
        ...props
    })

    const LoadingWrap = defineComponent({
        render() {
            return h(Loading, { ...data })
        }
    })

    vm = createVNode(LoadingWrap)

    if (wait) {
        setTimeout(() => {
            render(vm, document.createElement('div'))
        }, 0)
    } else {
        render(vm, document.createElement('div'))
    }

    function close() {
        if (vm?.el && vm.el.parentNode) {
            vm.el.parentNode.removeChild(vm.el)
        }
    }

    function open(target) {
        if (!vm || !vm.el) {
            return
        }
        target.appendChild(vm.el)
    }

    if (target) {
        open(target)
    }

    return {
        vm,
        close,
        open,
        setTip: tip => {
            data.tip = tip
        },
        setLoading: loading => {
            data.loading = loading
        },
        get loading() {
            return data.loading
        },
        get $el() {
            return vm?.el
        }
    }
}
