import { getThemeVariables } from 'ant-design-vue/dist/theme'

import { generateAntColors } from './utils/color'

/**
 * less 全局配置
 */
export function generateModifyVars(dark = false) {
    const palettes = generateAntColors(baseConfig.primaryColor)
    const primary = palettes[5]

    const primaryColorObj = {}

    for (let index = 0; index < 10; index++) {
        primaryColorObj[`primary-${index + 1}`] = palettes[index]
    }

    const modifyVars = getThemeVariables({ dark })
    return {
        ...modifyVars,
        'primary-color': primary,
        ...primaryColorObj,
        'info-color': primary,
        'processing-color': primary,
        'success-color': '#55D187', //  Success color
        'error-color': '#ED6F6F', //  False color
        'warning-color': '#EFBD47', //   Warning color
        //'border-color-base': '#EEEEEE',
        'font-size-base': '14px', //  Main font size
        'border-radius-base': '2px', //  Component/float fillet
        'link-color': primary, //   Link color
        'app-content-background': '#fafafa' //   Link color
    }
}

// 全局配置
const baseConfig = {
    title: 'Vue3后台管理系统模版',

    // 是否显示LOGO
    showSidebarLogo: true,

    // 侧边栏的宽度
    sidebarWidth: 200,

    // 是否展示sidebar
    showSidebar: true,

    // 是否固定头部
    fixedHeader: true,

    // 是否显示tagsView组件
    tagsView: true,

    // 所有表格页面的分页列表
    pageSizesList: ['50', '100', '200', '500'],

    // 主题色
    primaryColor: '#0960bd'
}

export default baseConfig
