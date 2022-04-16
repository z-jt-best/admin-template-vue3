<template>
    <section
        class="full-loading"
        :class="{ absolute, [theme]: !!theme }"
        :style="[background ? `background-color: ${background}` : '']"
        v-show="loading"
    >
        <Spin v-bind="$attrs" :tip="tip" :size="size" :spinning="loading" />
    </section>
</template>

<script>
import { defineComponent } from 'vue'
import { Spin } from 'ant-design-vue'
import { SizeEnum } from '@/enums/sizeEnum'

import { string, bool, oneOf } from 'vue-types'

export default defineComponent({
    name: 'Loading',
    components: { Spin },
    props: {
        tip: string().def(''),
        size: oneOf([SizeEnum.DEFAULT, SizeEnum.SMALL, SizeEnum.LARGE]).def(SizeEnum.LARGE),
        absolute: bool().def(false),
        loading: bool().def(false),
        background: string(),
        theme: oneOf(['dark', 'light']).def('light')
    }
})
</script>
<style lang="less" scoped>
.full-loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgb(240 242 245 / 40%);

    &.absolute {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 30;
    }
}

html[data-theme='dark'] {
    .full-loading:not(.light) {
        background-color: @modal-mask-bg;
    }
}

.full-loading.dark {
    background-color: @modal-mask-bg;
}
</style>
