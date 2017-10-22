<template>
  <section class="escdk13 no-after" v-if="!hide">
    <div class="escdk131 font-ctn">腾讯、京东、百度、易车旗下的中国领先互联网汽车金融平台</div>
        <div class="escdk132">
            <div><span>触屏版</span></div>
            <div><a href="http://www.daikuan.com/?from=newmweb">电脑版</a></div>
            <div><a href='{{xincheUrl}}/home/about#!/'>关于我们</a></div>
            <div>
                <a href='{{xincheUrl}}/Feedback/'>意见反馈</a>
            </div>
        </div>
    <div class="escdk133">服务电话：4000-169-169 (9:00-21:00)</div>
  </section>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
</style>

<script>
  import hideType from 'libs/hideType'

  export default {
    data () {
      return {
        hide:hideType.footer,
        xincheUrl: window.xincheUrl || `${window.location.protocol}//xinche.m.daikuan.com`
      }
    }
  }
</script>