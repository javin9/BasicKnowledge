<template>
  <aside class="component-navbar" v-el:navbar v-if="!isApp">
    <ul>
      <li v-for="one in list" :class="{'current' : one.current}">
        <a :href="one.link">
            <span :class="one.className"><img :src="one.img" v-if="one.main" /></span>
            <em>{{one.text}}</em>
        </a>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
@import 'sassHelper/mixin';
@import 'sassHelper/vars';

  .component-navbar{
    @include  borderTop;
    position: fixed;
    bottom:0;
    left:0;
    width: 100%;
    background: #fff;
    z-index: 100;
    left: 50%;
    transform: translate(-50%, 0);
    max-width: px2rem(750);

    ul{
      display: flex;
      padding:px2rem(12) px2rem(8);
      box-shadow:0 px2rem(1) px2rem(1) #E5E5E5 inset;

      li{
        flex:1;
        width: 0;
        text-align: center;

        a{
          text-decoration: none;
        }

        em{
          font-size:px2rem(20);
          color:#4A4B5B;
          position: relative;
        }

        &.current{
          em{
            color:$main-color;
          }
           span.icon-ershouche{
            background-image: url(./ershouche2.png);
          }
           span.icon-xinche{
            background-image: url(./xinche2.png);
          }
           span.icon-kaizouba{
            background-image: url(./kaizouba2.png);
          }
           span.icon-my{
            background-image: url(./my2.png);
          }
        }

        span{
          width: 100%;
          height:px2rem(42);
          display: block;
          background-position: center center;
          background-repeat: no-repeat;
          background-size: contain;
          margin-bottom: px2rem(8);

          &.icon-ershouche{
            background-image: url(./ershouche.png);
          }
          &.icon-xinche{
            background-image: url(./xinche.png);
          }
          &.icon-kaizouba{
            background-image: url(./kaizouba.png);
          }
          &.icon-my{
            background-image: url(./my.png);
          }

          &.icon-main{
            position: relative;

            &:before{
              @include size(px2rem(108));
              content:' ';
              position: absolute;
              background:url(./shadow.png) no-repeat center center;
              background-size: contain;
              left:50%;
              transform:translateX(-50%);
              top:px2rem(-50);
              border-radius:100%;
            }

            img{
              @include size(px2rem(88));
              position: absolute;
              background-size: contain;
              left:50%;
              transform:translateX(-50%);
              top:px2rem(-40);
            }
          }
        }
      }
    }
  }
</style>

<script>
export default {
  props: {
    img: {
      type: String,
      default: require('./bangnidaikuan.png')
    },
    link: {
      type: String,
      default: 'javascript:void(0)'
    },
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    const sourceParams = tools.getUrlParam('source') ? `?source=${tools.getUrlParam('source')}` : ''
    // 灰度环境后缀, 灰度环境测试保证无问题
    const envPostfix = /huidu/.test(document.location.hostname) ? '.huidu' : ''
    const envMyCenter = envPostfix ? 'hdi.' : 'i.'
    let list = [
        {
          text: '新车贷款',
          className: 'icon-xinche',
          link: `//m${envPostfix}.daikuan.com`,
          current: document.location.hostname.indexOf(`m.`) === 0 && !/Lease/i.test(document.location.pathname)
        },{
          text: '二手车贷款',
          className: 'icon-ershouche',
          link: `//ershouche${envPostfix}.m.daikuan.com${sourceParams}`,
          current: document.location.hostname.indexOf(`ershouche.`) === 0
        },{
          text: '开走吧',
          className: 'icon-kaizouba',
          link: `//m${envPostfix}.daikuan.com/Lease/${sourceParams}`,
          current: /Lease/i.test(document.location.pathname)
        },{
          text: '我的',
          className: 'icon-my',
          link: `https://${envMyCenter}m.daikuan.com/`,
          current: document.location.hostname.indexOf(envMyCenter) === 0
        }
      ]

    if(this.text){
      list.splice(2,0, {
        text: this.text,
        link: this.link,
        main:true,
        img: this.img,
        className:'icon-main',
        current: document.location.href.indexOf(this.link) === 0
      })
    }

    return {
      isApp: tools.isWebView()||tools.getUrlParam("hidetype")=='7'||tools.getUrlParam("Hidetype")=='7',
      list
    }
  },

  created(){
    if(dev){
      this.list[0].current = true
    }
  },

  methods:{
    // 页面body底部需要留出navbar区域
    adjustBodyPadding(){
      const height = $(this.$els.navbar).height()
      if(height){
        const pb = $('body').css('padding-bottom')
        if(+pb.replace('px', '') < height){
          $('body').css('padding-bottom', `${height}px`)
        }
      }else{
        setTimeout(this.adjustBodyPadding.bind(this), 100)
      }
    }
  },

  compiled(){
    this.adjustBodyPadding()
  }
}
</script>