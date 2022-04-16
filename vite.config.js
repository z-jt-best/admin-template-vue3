import { loadEnv } from 'vite'
import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import html from 'vite-plugin-html'
import styleImport, { AndDesignVueResolve } from 'vite-plugin-style-import'
import PurgeIcons from 'vite-plugin-purge-icons'
import { viteMockServe } from 'vite-plugin-mock'

import config, { generateModifyVars } from './src/settings'

const rootPath = process.cwd()

function pathResolve(dir) {
    return resolve(rootPath, '.', dir)
}

/**
 * 读取所有环境变量, 并转化为Oject形式
 * @param envConf 环境对象
 * @returns Object
 */
function wrapperEnv(envConf) {
    const ret = {}

    for (const envName of Object.keys(envConf)) {
        let realName = envConf[envName].replace(/\\n/g, '\n')
        realName = realName === 'true' ? true : realName === 'false' ? false : realName

        if (envName === 'VITE_PORT') {
            realName = Number(realName)
        }
        if (envName === 'VITE_PROXY' && realName) {
            try {
                realName = JSON.parse(realName.replace(/'/g, '"'))
            } catch (error) {
                realName = ''
            }
        }
        ret[envName] = realName
        if (typeof realName === 'string') {
            process.env[envName] = realName
        } else if (typeof realName === 'object') {
            process.env[envName] = JSON.stringify(realName)
        }
    }
    return ret
}

// 创建本地proxy
function createProxy(list) {
    const httpsRE = /^https:\/\//
    const ret = {}

    for (const [prefix, target] of list) {
        const isHttps = httpsRE.test(target)

        ret[prefix] = {
            target: target,
            changeOrigin: true,
            ws: true,
            ...(isHttps ? { secure: false } : {})
        }
    }

    return ret
}

// https://vitejs.dev/config/
export default ({ command, mode }) => {
    const isBuild = mode === 'production' ? true : false

    const env = loadEnv(mode, rootPath)

    const viteEnv = wrapperEnv(env)
    const { VITE_PORT, VITE_PROXY = [], VITE_USE_MOCK } = viteEnv

    return {
        server: {
            port: VITE_PORT,
            proxy: isBuild ? null : createProxy(VITE_PROXY)
        },
        build: {
            minify: 'terser',
            terserOptions: {
                compress: {
                    //生产环境时移除console
                    drop_console: true,
                    drop_debugger: true
                }
            }
        },

        // 别名
        resolve: {
            alias: [
                {
                    find: /@\//,
                    replacement: pathResolve('src') + '/'
                }
            ]
        },

        // 导入全局样式和修改antd的样式
        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: {
                        hack: `true; @import (reference) "${pathResolve('src/styles/index.less')}"`,
                        ...generateModifyVars()
                    },
                    javascriptEnabled: true
                }
            }
        },

        define: {},

        // 插件
        plugins: [
            vue(),
            vueJsx(),
            html({
                minify: isBuild,
                inject: {
                    data: {
                        title: config.title
                    }
                }
            }),
            styleImport({
                resolves: [AndDesignVueResolve()]
            }),
            PurgeIcons(),
            VITE_USE_MOCK &&
                viteMockServe({
                    ignore: /^\_/,
                    mockPath: 'mock',
                    localEnabled: !isBuild
                })
        ]
    }
}
