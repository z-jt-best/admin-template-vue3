/* istanbul ignore next */
export function on(element, event, handler) {
    if (element && event && handler) {
        element.addEventListener(event, handler, false)
    }
}

/* istanbul ignore next */
export function off(element, event, handler) {
    if (element && event && handler) {
        element.removeEventListener(event, handler, false)
    }
}
