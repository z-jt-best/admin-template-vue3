import { Modal, message as Message, notification } from 'ant-design-vue'
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue'

import { isString } from '@/utils/types'

function getIcon(iconType) {
    if (iconType === 'warning') {
        return <InfoCircleFilled class="modal-icon-warning" />
    } else if (iconType === 'success') {
        return <CheckCircleFilled class="modal-icon-success" />
    } else if (iconType === 'info') {
        return <InfoCircleFilled class="modal-icon-info" />
    } else {
        return <CloseCircleFilled class="modal-icon-error" />
    }
}

function renderContent({ content }) {
    if (isString(content)) {
        return <div innerHTML={`<div>${content}</div>`}></div>
    } else {
        return content
    }
}

/**
 * @description: Create confirmation box
 */
function createConfirm(options) {
    const iconType = options.iconType || 'warning'
    Reflect.deleteProperty(options, 'iconType')
    const opt = {
        centered: true,
        icon: getIcon(iconType),
        ...options,
        content: renderContent(options)
    }
    return Modal.confirm(opt)
}

const getBaseOptions = () => {
    return {
        okText: '确认',
        centered: true
    }
}

function createModalOptions(options, icon) {
    return {
        ...getBaseOptions(),
        ...options,
        content: renderContent(options),
        icon: getIcon(icon)
    }
}

function createSuccessModal(options) {
    return Modal.success(createModalOptions(options, 'success'))
}

function createErrorModal(options) {
    return Modal.error(createModalOptions(options, 'close'))
}

function createInfoModal(options) {
    return Modal.info(createModalOptions(options, 'info'))
}

function createWarningModal(options) {
    return Modal.warning(createModalOptions(options, 'warning'))
}

notification.config({
    placement: 'topRight',
    duration: 3
})

/**
 * @description: message
 */
export function useMessage() {
    return {
        createMessage: Message,
        notification: notification,
        createConfirm: createConfirm,
        createSuccessModal,
        createErrorModal,
        createInfoModal,
        createWarningModal
    }
}
