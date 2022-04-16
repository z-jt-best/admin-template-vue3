<!--
    * Time    : 2021-12-09 11:24:22
    * Author  : zhangTj
    * Desc    : file description
-->
<script lang="jsx">
import { defineComponent } from 'vue'

import { useLoginStatus } from './useLogin'

export default defineComponent({
    name: 'FormTitle',
    setup() {
        const { getLoginStatus } = useLoginStatus()

        return () => {
            return <h2 className="mb-3 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left">{getLoginStatus.value}</h2>
        }
    }
})
</script>

<style lang="less" scoped></style>
