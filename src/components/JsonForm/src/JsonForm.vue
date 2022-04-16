<!--
    * Time    : 2021-12-28 10:09:54
    * Author  : zhangTj
    * Desc    : JSON配置型的Form
-->
<template>
    <Form class="jsonForm" ref="form" :model="formData" name="form" @finish="onFinish" :label-col="{ span: 6 }">
        <Row :gutter="[20, 20]">
            <template v-for="item of jsonFields" :key="item.name">
                <Col :xxxl="6" :xxl="6" :xl="12" :lg="12" :md="12" :sm="12" :xs="12">
                    <JsonFormItem
                        :type="item.type"
                        :label="item.label"
                        :name="item.name"
                        :rules="formRules[item.name]"
                        :extraItemOps="item.extraItemOps"
                        :options="item.options"
                        v-model="formData[item.name]"
                        :extraTypeOps="item.extraTypeOps"
                    />
                </Col>
            </template>
            <Col :xxxl="6" :xxl="6" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
                <FormItem :label-col="{ span: 3 }" :wrapper-col="{ offset: 3 }">
                    <a-button type="primary" html-type="submit">
                        <template #icon>
                            <SearchOutlined />
                        </template>
                        搜索
                    </a-button>
                    <a-button @click="resetForm" class="ml-3">
                        <template #icon>
                            <SyncOutlined />
                        </template>
                        重置
                    </a-button>
                </FormItem>
            </Col>
        </Row>
    </Form>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { Form, Row, Col } from 'ant-design-vue'
import { SyncOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { array } from 'vue-types'

import JsonFormItem from './JsonFormItem.vue'

/**
 * jsonFields: {
 *  label: string,
 *  name: string && required,
 *  defaltValue: any,
 *  type: string,
 *  rules: object | array
 *  options: any => 某个formItem需要的选项, 如Select
 *  extraItemOps: object => formItem的多余参数
 *  extraTypeOps: object => type组件的多余参数
 * }
 * enums FormItemType {
 *  input,
 *  select,
 *  date
 * }
 */

export default defineComponent({
    name: 'JsonForm',
    components: { Form, FormItem: Form.Item, Row, Col, SyncOutlined, SearchOutlined, JsonFormItem },
    props: {
        jsonFields: array().def([])
    },
    setup(props, context) {
        const form = ref(null)
        const data = props.jsonFields.reduce((dict, item) => {
            dict[item.name] = item.defaltValue
            return dict
        }, {})
        const formData = reactive(data)

        const formRules = computed(() => {
            return props.jsonFields.reduce((dict, item) => {
                dict[item.name] = item.rules
                return dict
            }, {})
        })

        const onFinish = () => {
            context.emit('search', formData)
        }

        const resetForm = () => {
            form.value.resetFields()
            context.emit('reset', formData)
        }

        return {
            form,
            formData,
            formRules,
            onFinish,
            resetForm
        }
    }
})
</script>

<style lang="less" scoped>
.jsonForm {
    :deep(.ant-form-item) {
        margin: 0;
    }
}
</style>
