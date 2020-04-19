import Vue from 'vue';
import App from './DashBoard.vue';
import SuiVue from 'semantic-ui-vue';

//fix marker icon leaflet
import { Icon } from 'leaflet';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.config.productionTip = false

import 'leaflet/dist/leaflet.css';
import 'semantic-ui-css/semantic.min.css';

Vue.use(SuiVue);

new Vue({
  render: h => h(App),
}).$mount('#app')
