import './css/topic.scss'
import Vue from 'vue'

// vm
var vm = new Vue({
  el: '#app',

  data: {
    liked: false,
    count:0
  },

  methods: {
    like: function(id){
      var that = this
      if(!this.liked){
        tools.$ajax({
            url: '/Topic/ClickPraise',
            data: {id:id},
            success: function (res) {
              if(res.ret){
                that.liked = true
                that.count++
                tools.showAlert('已点赞')
              }
            }
        })
      }
    }
  },

  created: function(){
    if($('[data-liked]').data('liked') === 'True'){
      this.liked = true
    }
    this.count = $('[data-count]').data('count') || 0
  }

})