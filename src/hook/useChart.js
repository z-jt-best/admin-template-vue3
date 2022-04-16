/**
 * echarts的按需加载使用
 */
import * as echarts from 'echarts/core'
import 'echarts-liquidfill'
import { BarChart, PieChart, GaugeChart } from 'echarts/charts'
import {
    GraphicComponent,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    TransformComponent,
    LegendComponent,
    DatasetComponent,
    DataZoomComponent
} from 'echarts/components'
import { UniversalTransition, LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { shallowRef } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'

import { useEventListener } from '@/hook/useEventListener'

echarts.use([
    GraphicComponent,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    TransformComponent,
    BarChart,
    UniversalTransition,
    CanvasRenderer,
    LegendComponent,
    PieChart,
    LabelLayout,
    DatasetComponent,
    DataZoomComponent,
    GaugeChart
])

export function useChart() {
    const selfChart = shallowRef(null)
    let removeEventFn

    function initChart(dom, options) {
        selfChart.value = echarts.init(dom)
        selfChart.value.setOption(options)

        const { removeEvent } = useEventListener({
            el: window,
            name: 'resize',
            listener: () => {
                selfChart.value.resize()
            }
        })

        removeEventFn = removeEvent
    }

    tryOnUnmounted(() => {
        if (!selfChart.value) return
        removeEventFn()
        selfChart.value.dispose()
        selfChart.value = null
    })

    return { selfChart, initChart }
}
