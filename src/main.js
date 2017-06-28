// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.filter('capitalize', function (value) {
  return value && value.split([' ']).map(component => {
    return component[0].toUpperCase() + component.slice(1)
  }).join(' ')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
