import { createApp } from 'vue';
import App from './App.vue';
import JsonViewer from 'vue-json-viewer';
import 'vue-json-viewer/style.css'

const app = createApp(App)
app.use(JsonViewer);
app.mount('#app');
