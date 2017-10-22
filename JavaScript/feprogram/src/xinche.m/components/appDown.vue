<style>
  .slider-top {
    animation: sliderUp .3s 1 forwards;
  }
  @keyframes sliderUp{
    from {padding-top: px2rem(108);}
    to {padding-top: 0;}
  }
</style>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  /*app下载浮层*/
.uf { display: -webkit-box; display: -webkit-flex; display: flex; position:relative;}
.uf_ac{ -webkit-align-items: center; align-items: center; -webkit-box-align: center; }
.uf_f1{ position:relative; -webkit-box-flex: 1; box-flex: 1; -webkit-flex: 1; flex: 1; }
#appDown { position: relative; }
.appdown_area { position: fixed; top: 0; left: 0; z-index: 9994; width: 100%; max-width:10rem; height: 1.44rem; left: 50%; -webkit-transform: translate3d(-50%, 0, 0); transform: translate3d(-50%, 0, 0); background: rgba(0, 0, 0, .8); }
.appdown_close { display: block; width: 1.2rem; height: 100%; /*background: transparent url(../images/appdown-close.png) 0.4rem center no-repeat;*/background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlDRDkwMURFODE1QjExRTZCNTE5RDFBREFBNEZBMjBCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlDRDkwMURGODE1QjExRTZCNTE5RDFBREFBNEZBMjBCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUNEOTAxREM4MTVCMTFFNkI1MTlEMUFEQUE0RkEyMEIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUNEOTAxREQ4MTVCMTFFNkI1MTlEMUFEQUE0RkEyMEIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6x1rmxAAADUElEQVR42syY3UsUURjGp3G7KAmkws/AO9foLiqWKMu66MMLa+syDQyTEqGuTLpv+wuKEipybyIyQ1aWyHIrUim6dfOqcNUskq7ywph6XniOTMPszDm7U3Tg5+zMnPd9H8/He86Z2FxhwTIsMdAEDoB9YDeo47tF8Ba8BjkwC36aOF9nIKgRDIBuYGvaOGAQpMAnHQMdx5tBBnwEPeAruAx2gE2gQv4xUsFn8u4S6/bQNkNfZbXQGTDE39IFF0Ae/NLtAXbvLXaxlA6QNm0heX6PYr6DBDgIZgzEWKz7gbYJ+hqib1tXkM3mPctWqQfTVvllmr5y9J3xi+8nSAbhUTACDoEVK7qyQp8jjDEYJqgTdIFxcIqzJOri0Pc4Y3UWG9QyA76xn+sjbhm/sgFI8CqwBSyrJKfKfV6PecVsa6iLREFhftHbfRJrkgO9zd1ljXzwAkwF+KzmVLYMpn11wPspxjxODWuCrvB6MUTMEhjWTKhS5zFtagLq9fI6oIyk287TMB9gKFn3CTgBHoWIsim8nTZfAurOMLYsSevFME4HKY0kl9QQ5RWT1EimKdo1yZ8WPnyqOWXdorzd5ydGJ3Wo2C22a42ZM8gjSlS7S1SpYtyx98v42cmbH4bJLekSMMznpYhxx94Tc22unBIyrluUVaIYd+wa2/rPis1tp+5mLWg2eceUqS8pS/LjPW82liEmWWSg6xYV+50YvVJLVhlinIDZp1NU7JwYTPDmSBliwlJCWFGxX9o8qoijfo2FUifP+IkKW5D7aTcrglbBbU7/5pDFVTfPeEUFrfhxxpbd46pqzuu83ggwlAWwFpzUzDMO69bStli56VrP1vpXDnFjoJWngyBRpqeOIDEJxhxTB0m/LewyR/2/2MIWGHcrY/8xA0TIOVYYLSG5mSbCUcbqUmL8svMdchg8/EuixOcDxpBYd8POZbJzy3KWPGfTRtlNz8BpxujWOSg63PCnuVdaCBnouiVBX6303eY3W+2AKdtBqnhUmWDOMC1xtvQkfSm/TimfY9KcAVm2lhwCPoM+sB1U+mxhK/muj3XzbJUsfaWj/GB1lTPRZLBLBr7Gb0SRfkFzf9Jr5ieWvWAXaOC7edlCgDfs4rzpJ73fAgwANLH2bePw7RUAAAAASUVORK5CYII=); background-position: 0.4rem center; background-repeat: no-repeat; -webkit-background-size: 0.48rem 0.48rem; background-size: 0.48rem 0.48rem; }
.appdown_logo { display: block; width: 1.066667rem; height: 1.066667rem; /*background: transparent url(../images/appdown-logo.png) 0 0 no-repeat;*/ background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRDMjNGMTA1ODE1RTExRTY4RERCRjk5QjVDOUQ1MDZEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRDMjNGMTA2ODE1RTExRTY4RERCRjk5QjVDOUQ1MDZEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEMyM0YxMDM4MTVFMTFFNjhEREJGOTlCNUM5RDUwNkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEMyM0YxMDQ4MTVFMTFFNjhEREJGOTlCNUM5RDUwNkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6B0FXeAAALeklEQVR42uxd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); background-repeat: no-repeat; -webkit-background-size: 100% 100%; background-size: 100% 100%; }
.appdown_txt { padding-left: 0.186667rem; line-height: 1.5; }
.appdown_btn { display: block; width: 3.333333rem; height: 100%; line-height: 1.44rem; text-align: center; background-color: #e9474d; }
.appdown_area a:link,
.appdown_area a:visited,
.appdown_area a:hover { color: #fff!important; }
.font-color-ffffff { color: #fff; }
.font-color-999999 { color: #999; }
</style>
<template>
  <section id="appDown" class="hide">
    <a href="yxcarloan://www.daikuan.com" id="loadAppButton" class="hide"></a>

    <div class="appdown_area uf uf_ac">
      <a href="" id="" class="appdown_close" v-on:click="closeDown"><span class="hide">x</span></a>
      <span src="" alt="" class="appdown_logo"></span>
      <div class="appdown_txt uf_f1">
          <p class="font-size-26 font-color-ffffff">APP审批贷款速度更快</p>
          <p class="font-size-24 font-color-999999">登录即可领取3万额度</p>
      </div>
      <a href="/app/down" class="appdown_btn font-size-32 font-color-ffffff">下载领取</a>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      /*APP判断*/
      isApp: tools.getCookie("YiXinAppInfo")
    }
  },
  ready: function(){
    // app下载
    if( tools.getCookie('hideAppDown') == '1' || this.isApp){
      $('#appDown').addClass('hide');
    } else {
      $('#appDown').removeClass('hide');
      $('body').css({'padding-top': '1.44rem'});

      var ua = navigator.userAgent;
      var platform = /MicroMessenger/i.test(ua) ? "weixin" : /Android/i.test(ua) ? "android" : /iPhone|iPad|iPod/i.test(ua) ? "ios" : "pc";
      if (platform != "pc" && platform != "android" &&  tools.getCookie('hasOpen') != '1' ) {
        // 记录第一次打开
        var cookieHasOpen = 'hasOpen=1;path=/;domain=' + tools.wildcardUrl();
        document.cookie = cookieHasOpen;

        $('#loadAppButton').trigger('click');
      }
    }
  },
  methods: {
    closeDown: function(e){
      e.preventDefault();
      // 关闭浮层，记录cookie
      $('#appDown').addClass('hide');
      $('body').addClass('slider-top');
      var cookieString = 'hideAppDown=1;path=/;domain=' + tools.wildcardUrl();
      document.cookie = cookieString;
    }
  }
}
</script>
