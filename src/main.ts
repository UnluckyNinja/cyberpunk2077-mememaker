import Vue from 'vue';
import App from './App.vue';
import store from './store';
// import './registerServiceWorker';
import './plugins/element.js';
import VueKonva from 'vue-konva';
import i18n from './i18n';

Vue.use(VueKonva);

Vue.config.productionTip = false;

new Vue({
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
