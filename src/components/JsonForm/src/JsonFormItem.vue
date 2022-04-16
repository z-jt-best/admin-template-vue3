<!--
    * Time    : 2021-12-28 10:43:59
    * Author  : zhangTj
    * Desc    : file description
-->
<script lang="jsx">
import { defineComponent } from 'vue'
import { Input, Select, Form, RangePicker, DatePicker } from 'ant-design-vue'
import { object, any, oneOfType, array, string } from 'vue-types'

export default defineComponent({
    name: 'JsonFormItem',
    components: { Input, Select, SelectOption: Select.Option, FormItem: Form.Item, RangePicker, DatePicker },
    props: {
        type: string().isRequired,
        label: string().def(''),
        name: string().isRequired,
        rules: oneOfType([object(), array()]).def({}),
        extraItemOps: object().def({}),
        options: array().def([]),
        modelValue: any(),
        extraTypeOps: object().def({})
    },
    setup(props, context) {
        const getTagetItem = ({ type, modelValue, options, ops }) => {
            const typeDict = {
                input: (
                    <Input
                        value={modelValue}
                        onInput={e => {
                            context.emit('update:modelValue', e.target.value)
                        }}
                        allowClear
                        {...ops}
                    />
                ),
                select: (
                    <Select
                        value={modelValue}
                        onChange={targetVal => {
                            context.emit('update:modelValue', targetVal)
                        }}
                        allowClear
                        {...ops}
                    >
                        {options.map(item => (
                            <SelectOption value={item.value} key={item.value}>
                                {item.label}
                            </SelectOption>
                        ))}
                    </Select>
                ),
                date: (
                    <RangePicker
                        value={modelValue}
                        onChange={(dates, dateStrings) => {
                            context.emit('update:modelValue', dates)
                        }}
                        allowClear
                        {...ops}
                    />
                )
            }

            return typeDict[type]
        }

        return () => {
            return (
                <FormItem label={props.label} name={props.name} rules={props.rules} {...props.extraItemOps}>
                    {getTagetItem({ type: props.type, modelValue: props.modelValue, options: props.options, ops: props.extraTypeOps })}
                </FormItem>
            )
        }
    }
})
</script>

<style lang="less" scoped></style>
