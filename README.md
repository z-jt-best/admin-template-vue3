# 项目注意事项

该项目是基于(vue-vben-admin)[https://github.com/vbenjs/vue-vben-admin]项目手撸的 vue3 项目。

## VScode 需要的插件

1. Auto Close Tag
2. Git History Diff
3. Prettier - Code formatter
4. Stylelint
5. Tailwind CSS IntelliSense
6. Bracket Pair Colorizer 2
7. Vue Language Features (Volar) - Vue3 开发环境需要
8. Vetur - Vue2 开发环境需要

以上插件是项目开发必备的插件, 其他插件可根据个人需要添加.

## 项目使用到的第三方类库

-   antd-vue: 主要的 UI 库, 请不要引入同类型的 UI 库
-   tailwindcss: 快捷样式库, 请不要引入同类型的快捷样式库
-   less: 主要的 CSS 与处理器, 请不要引入同类型的 CSS 与处理器
-   vite: 主要的打包工具, 修改配置前请先阅读官方文档
-   lodash-es: JS 工具库, 这是 ES 版本, 使用 ES 导入方式, 以便做到按需引入
-   vue-router: router4 是 vue3 的版本
-   qs
-   axios
-   dayjs: 主要的时间格式化类库, 请不要重复引入 moment
-   @vueuse/core: vue3 版本的 hook, 类似 ahook
-   @ant-design/icons-vue: antd-vue 版本的 icon 集合
-   vue-types: 组件的类型判断
-   pinia: 状态管理库
-   @iconify/iconify: 第三方图标集合, 后面可用于做图标选择器
-   echart: 5.2 版本

## Git 提交规范

-   feat 增加新功能
-   fix 修复问题/BUG
-   style 代码风格相关无影响运行结果的
-   perf 优化/性能提升
-   refactor 重构
-   revert 撤销修改
-   test 测试相关
-   docs 文档/注释
-   chore 依赖更新/脚手架配置修改等
-   workflow 工作流改进
-   ci 持续集成
-   mod 不确定分类的修改
-   wip 开发中

eg.

```
git add .
git commit -m 'feat: add home page'
```

## 代码规范化

1. prettier
   配置文件使用`.prettierrrc.js`, 最好不要修改里面的配置文件, 除非整体修改代码格式化风格
   可使用`yarn prettier`命令对`src`文件夹下的`js,jsx,vue`文件进行格式化

2. stylelint
   使用`@umijs/fabric`类库提供的格式化规则, 如果自身对 CSS 规则有要求, 可在`.stylelintrc.js`文件下添加相应的规则

3. ESLint
   默认使用了`prettier`和`vue3`社区提供的`eslint`规范, 如果自身对代码有额外需求, 可在`.eslintrc.js`文件下添加相应的规则

## 项目开发注意事项

1. 命名规则:

    - 页面组件均以小驼峰的形式进行命名
    - 组件均以大驼峰的形式进行命名
    - 非常量变量, 均以小驼峰进行命名, 其中包括后端返回的字段, 如果后端返回的字段不是小驼峰, 则叫后端改.
    - 常量变量均以大写+下划线的形式进行命名

2. 开发注意:
    - 所有通用型的组件均放在从`components`文件夹内, 其他页面组件均放在其页面或相应的模块文件夹内`components`文件夹内(可自行创建)
    - 与页面耦合性较高的组件(如`CrudTable`, `JsonForm`组件), 这些组件在一般`crud`页面中重复使用, 如果需要添加/修改/删除其中功能, 请确保明白组件的逻辑, 不会导致其他使用页面的崩溃, 若不清楚的前提下, 均交给组件开发者进行添加/修改/删除功能.
    - 保证使用按需引入, 以减少打包后产物的体积. 其中包括对第三方库的按需引入(务必阅读第三方库的文档).
