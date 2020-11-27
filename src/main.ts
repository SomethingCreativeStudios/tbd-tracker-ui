import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueCompositionAPI from '@vue/composition-api';
import { bootstrap } from '~/bootstrap/bootstrap';

Vue.config.productionTip = false;

Vue.use(VueCompositionAPI);

//@ts-ignore
window.store = store;

new Vue({
   router,
   store,
   // @ts-ignore
   vuetify,
   render: h => h(App),
}).$mount('#app');

async function main() {
   await bootstrap();
}

main();
