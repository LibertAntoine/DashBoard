import Vue from 'vue';
import App from './DashBoard.vue';
import SuiVue from 'semantic-ui-vue';

Vue.config.productionTip = false

import 'leaflet/dist/leaflet.css';
import 'semantic-ui-css/semantic.min.css';

Vue.use(SuiVue);

new Vue({
  render: h => h(App),
}).$mount('#app')
