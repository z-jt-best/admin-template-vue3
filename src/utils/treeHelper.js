export function treeMap(treeData, opt) {
    return treeData.map(item => treeMapEach(item, opt))
}

/**
 * @description: Extract tree specified structure
 * 提取树指定结构
 * 也是遍历的形式, 为整个路由树的一些字段继续初始化配置(如果没有配置这个字段值, 则使用默认值)
 */
export function treeMapEach(data, { children = 'children', conversion }) {
    const haveChildren = Array.isArray(data[children]) && data[children].length > 0

    const conversionData = conversion(data) || {}

    if (haveChildren) {
        return {
            ...conversionData,
            [children]: data[children].map(i =>
                treeMapEach(i, {
                    children,
                    conversion
                })
            )
        }
    } else {
        return {
            ...conversionData
        }
    }
}

// 深度遍历(先遍历子路由)tree的一个工具函数, 根据func的返回值来判断来滤掉route
export function filter(tree, func) {
    const children = 'children'

    function listFilter(list) {
        return list
            .map(node => ({ ...node }))
            .filter(node => {
                node[children] = node[children] && listFilter(node[children])
                return func(node) || (node[children] && node[children].length)
            })
    }
    return listFilter(tree)
}
