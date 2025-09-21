import { createApp } from 'vue'
import App from './App.vue'
import './assets/style.css'   // 全局样式
import router from './router'   // 默认会自动找 ./router/index.ts

createApp(App).use(router).mount('#app')