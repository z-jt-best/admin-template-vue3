import { createApp } from 'vue'

import './styles/index.less'
import App from './App.vue'
import { router, setupRouter } from './routers'
import { setupRouterGuard } from './routers/guard'
import { setupStore } from './store'
import { registerGlobComp } from './components/registerGlobComp'
import { setupGlobDiretives } from './directives'

const bootstrap = () => {
    const app = createApp(App)

    registerGlobComp(app)

    setupStore(app)

    setupRouter(app)

    setupRouterGuard(router)

    setupGlobDiretives(app)

    app.mount('#app')
}

bootstrap()
