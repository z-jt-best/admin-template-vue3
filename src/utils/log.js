function styleInit(bg, to) {
    return ['color: #fff', 'padding: 2px', `background: ${bg}`, `border-raduis: ${to === 'left' ? '2px 0 0 2px' : '0 2px 2px 0'}`].join(';')
}

const typeColor = {
    success: '#67C23A',
    primary: '#409EFF',
    warning: '#E6A23C',
    error: '#F56C6C'
}

const selfLog = {
    success: message => log('成功', message, 'success'),
    primary: message => log('信息', message, 'primary'),
    warning: message => log('警告', message, 'warning'),
    error: message => log('错误', message, 'error')
}

function log(title, message, type) {
    console.log(`%c${title}%c${message}`, styleInit('#909399', 'left'), styleInit(typeColor[type], 'right'))
}

export default selfLog
