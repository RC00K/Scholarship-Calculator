import { createApp } from 'vue'

import App from './App.vue'
import './styles.css'
import AwardResult from './components/AwardResult.vue'

const app = createApp(App);

app.component('award-result', AwardResult);

createApp(App).mount('#app')
