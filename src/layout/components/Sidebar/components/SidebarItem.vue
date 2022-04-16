<!--
    * Time    : 2021-12-16 10:27:25
    * Author  : zhangTj
    * Desc    : 菜单项
-->
<script lang="jsx">
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { Menu } from 'ant-design-vue'
import { bool, object, array } from 'vue-types'

import Icon from '@/components/Icon'

const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu

export default defineComponent({
    name: 'SidebarItem',
    props: {
        item: object().isRequired,
        parentPath: array().def([])
    },
    setup(props) {
        function menuHasChildren(routeList) {
            return !!routeList.children && routeList.children.length > 0 && !routeList.meta?.hideChildrenInMenu && Reflect.has(routeList, 'children')
        }

        return () => {
            if (props.item.hideMenu) return null

            return (
                <>
                    {!menuHasChildren(props.item) && (
                        <MenuItem
                            key={props.item.path}
                            frameSrc={props.item.frameSrc}
                            parentPath={props.parentPath}
                            currentActiveMenu={props.item.meta?.currentActiveMenu}
                        >
                            {{
                                default: () => props.item.name,
                                icon: () => (props.item.meta?.icon ? <Icon icon={props.item.meta?.icon} /> : null)
                            }}
                        </MenuItem>
                    )}
                    {menuHasChildren(props.item) && (
                        <SubMenu key={props.item.path}>
                            {{
                                icon: () => (props.item.meta?.icon ? <Icon icon={props.item.meta?.icon} /> : null),
                                title: () => props.item.meta?.title,
                                default: () =>
                                    props.item.children.map(child => <SidebarItem item={child} parentPath={[...props.parentPath, props.item.path]} />)
                            }}
                        </SubMenu>
                    )}
                </>
            )
        }
    }
})
</script>

<style lang="less" scoped></style>
