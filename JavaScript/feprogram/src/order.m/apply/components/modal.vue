<template>
  <div class="modal-container">
    <div class="modal" :class="{loading: loading}">
      <div class="content">
        <h6>你是否阅读并同意:</h6>
        <p><a href="javascript:void(0)" @click="dialogInfo">《信息使用授权书》</a></p>
      </div>
      <footer>
        <a href="javascript:void(0)" @click="close()">我再想想</a>
        <a href="javascript:void(0)" @click="confirmHandle">同意并继续</a>
      </footer>
    </div>
  </div>
</template>

<style>
  #servicePsionBox{ padding: 2.4rem 0.533333rem; z-index: 100;}
  #servicePsionBox .layout-text{ border-radius: 0.213333rem; }
  #servicePsionBox .layout-title{ height: 1.466667rem; line-height:1.466667rem; background-color: #fff; border-radius:0.213333rem 0.213333rem 0 0; }
  #servicePsionBox .layout-con { padding-top: 0; }
  #servicePsionBox .layout-con p { margin-bottom: 0.133333rem; line-height: 200%; text-indent: 0; }
  #servicePsionBox .layout-con .list-p { margin-top:0; counter-reset: step; }
  #servicePsionBox .layout-con .list-p li { position: relative; padding-left: 1em; }
  #servicePsionBox .layout-con .list-p li:before { content: counter(step)'.'; counter-increment: step; position: absolute; left: 0; }
  #servicePsionBox .layout-close{ left: auto; right: 0.4rem; top: -0.333333rem; bottom: auto; width: 0.693333rem; height: 0.693333rem; background-position: -0.653333rem -5.853333rem; }

  [data-dpr="1"] #servicePsionBox .font-title { font-size: 16px; }
  [data-dpr="2"] #servicePsionBox .font-title { font-size: 32px; }
  [data-dpr="3"] #servicePsionBox .font-title { font-size: 48px; }
  [data-dpr="1"] #servicePsionBox .layout-con p { font-size: 13px; }
  [data-dpr="2"] #servicePsionBox .layout-con p { font-size: 26px; }
  [data-dpr="3"] #servicePsionBox .layout-con p { font-size: 39px; }

  .c_red { color: #e9474d; }
</style>
<style scoped>
  @import 'sassHelper/mixin';

  $border: #dbdbdb;
  $link: #5fc3e8;

  .modal-container{

    &:after{
      content: '';
      position: absolute;
      left:0;
      top:0;
      width: 100%;
      height:100%;
      background: rgba(0,0,0,.5);
    }

    .modal{
      width: px2rem(600);
      height:px2rem(290);
      position: absolute;
      left:50%;
      top:50%;
      transform:translateX(-50%) translateY(-50%);
      background: #fff;
      z-index: 9;
      border-radius:px2rem(25);
      overflow: hidden;

      &.loading{
        .content,footer{
          display: none;
        }
        background: #fff url(images/loading.gif) no-repeat center center;
        background-size: px2rem(40);
      }

      .content{
        height:px2rem(200);
        border-bottom:px2rem(2) solid $border;
        box-sizing:border-box;
      }

      h6{
        @include fsize(32);
        font-weight: bold;
        text-align: center;
        color:#000;
        padding:px2rem(40) 0;
      }

      p{
        @include fsize(26);
        text-align: center;
        color:#000;
        a{
          color:$link;
        }
      }

      footer{
        a{
          @include fsize(32);
          height:px2rem(90);
          line-height: px2rem(90);
          width: 50%;
          border-right:px2rem(2) solid $border;
          box-sizing:border-box;
          display: block;
          float: left;
          text-align: center;
          color:#999;


          &:last-child{
            border:0;
            color:$link;
          }
        }
      }
    }
  }

  
</style>
<script>
export default {
  props: ['close', 'confirm'],
  data () {
    return {
      loading: false
    }
  },

  methods: {
    dialogInfo(){
      tools.serviceProvision({
        url:'/home/InfoUsingAuthorization', 
        title:'信息使用授权书'
      })
    },

    confirmHandle(){
      this.loading = true
      this.confirm()
    }

    // dialogCredit(){
    //   tools.serviceProvision({
    //     url:'/home/PersonalCreditAuthorization', 
    //     title:'人行征信授权书'
    //   })
    // }
  }
}
</script>