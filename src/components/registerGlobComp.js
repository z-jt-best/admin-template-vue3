/**
 * 全局注册组件
 * 注意: ant-design-vue的组件全部是以'a-xxx'/'AXXXX'的形式使用的
 */
import { Button, Input } from 'ant-design-vue'

export function registerGlobComp(app) {
    app.use(Button).use(Input)
}
