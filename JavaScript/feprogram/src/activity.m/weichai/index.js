import './index.scss'
import Vue from 'vue'
import VueResource from 'vue-resource'
import FormComponent from './components/form'

Vue.use(VueResource)

new Vue({
  el: '#app',
  props: {
    api: {
      type: String,
      default: window.SaveUrl || ''
    },
    source: {
      type: Array,
      default: window.DealerInfo || {}
    }
  },
  template:`
    <div class="main">
      <form-component :api="api" :source="source"></form-component>
    </div>
    <div class="bg-1"></div>
    <div class="bg-2"></div>
    <div class="bg-3"></div>
    <div class="bg-4"></div>
  `,
  components: {
    FormComponent
  }
})