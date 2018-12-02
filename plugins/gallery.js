import Vue from 'vue'
import vGallery from 'vue-gallery'

const VueGallery = {
  install(Vue, options) {
    Vue.component('gallery', vGallery)
  }
}
Vue.use(VueGallery)
