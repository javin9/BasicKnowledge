<template>
    <section class="escdk13">
       <div class="escdk131 font-ctn">腾讯、京东、百度、易车旗下的互联网汽车金融平台</div>
        <div class="escdk132">
                    <div><span>触屏版</span></div>
                    <div>
                        <a :href="linkWeb">电脑版</a>
                    </div>
                    
                    <div>
                        <a :href="linkAbout">关于我们</a>
                    </div>
                    <div>
                        <a :href="linkFeedback">意见反馈</a>
                    </div>
                </div>
        <div class="escdk133">服务电话：4000-169-169 (9:00-21:00)</div>
    </section>
</template>

<style scoped>
</style>

<script>
export default {
  props: {
    linkWeb: {
        type: String,
        default: '//www.daikuan.com/?from=newmweb'
    },
    linkAbout: {
        type: String,
        default: '//m.daikuan.com/home/about'
    },
    linkFeedback: {
        type: String,
        default: '//m.daikuan.com/Feedback/'
    }
  },
  data () {
  }
}
</script>