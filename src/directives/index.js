/**
 * 注册全局指令
 */

import { setupLoadingDirective } from './loading'

export function setupGlobDiretives(app) {
    setupLoadingDirective(app)
}
