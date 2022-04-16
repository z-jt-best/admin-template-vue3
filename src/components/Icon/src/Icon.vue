<!--
    * Time    : 2021-12-07 17:39:01
    * Author  : zhangTj
    * Desc    : 使用图标集 @iconify/iconify 
    * Doc     : https://icones.netlify.app/collection/ant-design?s=
-->
<template>
    <span ref="elRef" :class="[$attrs.class, 'app-iconify anticon', spin && 'app-iconify-spin']" :style="getWrapStyle"></span>
</template>

<script>
import { defineComponent, ref, unref, computed, watch, onMounted, nextTick } from 'vue'
import { string, oneOfType, number, bool } from 'vue-types'
import Iconify from '@purge-icons/generated'

import { isString } from '@/utils/types'

export default defineComponent({
    name: 'Icon',
    props: {
        icon: string().isRequired,
        color: string(),
        size: oneOfType([string(), number()]).def(16),
        spin: bool().def(false),
        prefix: string().def('')
    },
    setup(props, context) {
        const elRef = ref(null)

        const getIconRef = computed(() => `${props.prefix ? props.prefix + ':' : ''}${props.icon}`)

        const update = async () => {
            const el = unref(elRef)
            if (!el) return

            await nextTick()
            const icon = unref(getIconRef)
            if (!icon) return

            const svg = Iconify.renderSVG(icon, {})
            if (svg) {
                el.textContent = ''
                el.appendChild(svg)
            } else {
                const span = document.createElement('span')
                span.className = 'iconify'
                span.dataset.icon = icon
                el.textContent = ''
                el.appendChild(span)
            }
        }

        const getWrapStyle = computed(() => {
            const { size, color } = props
            let fs = size
            if (isString(size)) {
                fs = parseInt(size, 10)
            }

            return {
                fontSize: `${fs}px`,
                color: color,
                display: 'inline-flex'
            }
        })

        watch(() => props.icon, update, { flush: 'post' })

        onMounted(update)

        return { elRef, getWrapStyle }
    }
})
</script>

<style lang="less">
@iconify-bg-color: #5551;

.app-iconify {
    display: inline-block;
    // vertical-align: middle;

    &-spin {
        svg {
            animation: loadingCircle 1s infinite linear;
        }
    }
}

span.iconify {
    display: block;
    min-width: 1em;
    min-height: 1em;
    background-color: @iconify-bg-color;
    border-radius: 100%;
}
</style>
