<!--
    * Time    : 2021-12-23 17:05:07
    * Author  : zhangTj
    * Desc    : 404/500/403等相关错误页面
-->
<script lang="jsx">
import { defineComponent, ref, unref, computed } from 'vue'
import { number, string } from 'vue-types'
import { Result, Button } from 'ant-design-vue'
import { useRoute } from 'vue-router'

import { exceptionEnum } from '@/enums/exceptionEnum'
import { useGo } from '@/hook/usePage'
import { pageEnum } from '@/enums/pageEnum'

export default defineComponent({
    name: 'exception',
    components: { Result },
    props: {
        status: number().def(404),
        title: string().def(''),
        subTitle: string().def('')
    },
    setup(props) {
        const { query } = useRoute()
        const go = useGo()
        const statusMapRef = ref(new Map())

        const getStatus = computed(() => {
            const { status: routeStatus } = query
            const { status } = props
            return Number(routeStatus) || status
        })

        const getMapValue = computed(() => {
            return unref(statusMapRef).get(unref(getStatus))
        })

        unref(statusMapRef).set(exceptionEnum.PAGE_NOT_ACCESS, {
            title: '403',
            status: `${exceptionEnum.PAGE_NOT_ACCESS}`,
            subTitle: '抱歉，您无权访问此页面。',
            btnText: '返回首页',
            handler: () => {
                go(pageEnum.BASE_HOME)
            }
        })

        unref(statusMapRef).set(exceptionEnum.PAGE_NOT_FOUND, {
            title: '404',
            status: `${exceptionEnum.PAGE_NOT_FOUND}`,
            subTitle: '抱歉，您访问的页面不存在。',
            btnText: '返回首页',
            handler: () => {
                go(pageEnum.BASE_HOME)
            }
        })

        unref(statusMapRef).set(exceptionEnum.ERROR, {
            title: '500',
            status: `${exceptionEnum.ERROR}`,
            subTitle: '抱歉，服务器报告错误。',
            btnText: '返回首页',
            handler: () => {}
        })

        return () => {
            const { title, subTitle, btnText, icon, handler, status } = unref(getMapValue) || {}

            return (
                <Result class="exception-page" status={status} title={props.title || title} sub-title={props.subTitle || subTitle}>
                    {{
                        extra: () =>
                            btnText && (
                                <Button type="primary" onClick={handler}>
                                    {() => btnText}
                                </Button>
                            ),
                        icon: () => (icon ? <img src={icon} /> : null)
                    }}
                </Result>
            )
        }
    }
})
</script>

<style lang="less" scoped>
.exception-page {
    .ant-result-icon {
        img {
            max-width: 400px;
            max-height: 300px;
        }
    }
}
</style>
