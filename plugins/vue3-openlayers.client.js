// plugins/vue3-openlayers.client.js

import { defineNuxtPlugin } from '#app'
import * as Vue3Openlayers from 'vue3-openlayers'
// import 'vue3-openlayers/dist/vue3-openlayers.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Openlayers)
})
