// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRx from 'vue-rx'
import VueI18n from 'vue-i18n'
import Vuex from 'vuex'
import VueYouTubeEmbed from 'vue-youtube-embed'
import VueScrollTo from 'vue-scrollto'
import { Observable } from 'rxjs'

import messages from './i18n/messages'
import App from './App'

Vue.use(VueRx, {
  Observable
})
Vue.config.productionTip = false
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'de',
  messages
})

Vue.use(Vuex)
Vue.use(VueYouTubeEmbed)
Vue.use(VueScrollTo)

/* eslint-disable no-new */
new Vue({
  i18n,
  el: '#app',
  components: { App },
  template: '<App/>'
})
