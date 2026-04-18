import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from '@/App.vue'
import router from '@/app/router'
import i18n from '@/shared/i18n'
import { setupRouteGuards } from '@/app/guards'
import '@/assets/main.css'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)

// Инициализируем guards до запуска первого перехода роутера.
setupRouteGuards(router)

app.use(router)
app.use(i18n)

router.isReady().then(() => {
  app.mount('#app')
})
