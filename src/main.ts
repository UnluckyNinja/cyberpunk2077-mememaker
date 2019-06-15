import Vue from 'vue';
import App from './App.vue';
import store from './store';
// import './registerServiceWorker';
import './plugins/element.js';
import VueKonva from 'vue-konva';

Vue.use(VueKonva);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
