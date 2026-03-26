import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './app/router'
import i18n from './shared/i18n'
import { setupRouteGuards } from './app/guards'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Guards зависят от Pinia-стора, подключаем после app.use(pinia)
setupRouteGuards(router)

app.mount('#app')