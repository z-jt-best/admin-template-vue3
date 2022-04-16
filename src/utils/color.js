import { generate } from '@ant-design/colors'

export function generateAntColors(color, theme = 'default') {
    return generate(color, {
        theme
    })
}

/**
 * 判断是否 十六进制颜色值.
 * 输入形式可为 #fff000 #f00
 *
 * @param   String  color   十六进制颜色值
 * @return  Boolean
 */
export function isHexColor(color) {
    const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/
    return reg.test(color)
}

/**
 * RGB 颜色值转换为 十六进制颜色值.
 * r, g, 和 b 需要在 [0, 255] 范围内
 *
 * @return  String          类似#ff00ff
 * @param r
 * @param g
 * @param b
 */
export function rgbToHex(r, g, b) {
    // tslint:disable-next-line:no-bitwise
    const hex = ((r << 16) | (g << 8) | b).toString(16)
    return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex
}

/**
 * 将十六进制的颜色转换成RGB颜色
 * @param {string} hex The color to transform
 * @returns The RGB representation of the passed color
 */
export function hexToRGB(hex) {
    let sHex = hex.toLowerCase()
    if (isHexColor(hex)) {
        if (sHex.length === 4) {
            let sColorNew = '#'
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1))
            }
            sHex = sColorNew
        }
        const sColorChange = []
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt('0x' + sHex.slice(i, i + 2)))
        }
        return 'RGB(' + sColorChange.join(',') + ')'
    }
    return sHex
}
