import Vue from 'vue'
import App from './DashBoard.vue'

Vue.config.productionTip = false

import 'leaflet/dist/leaflet.css'

new Vue({
  render: h => h(App),
}).$mount('#app')
