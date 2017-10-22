<template>
    <section class="form-box">
        <ul>
            <li class="form-item">
                <label>姓名</label>
                <input type="text" placeholder="请输入您的真实姓名" v-model="params.realName">
                <p class="error" v-if="msg.realName">{{msg.realName}}</p>
            </li>
            <li class="form-item">
                <label>身份证</label>
                <input type="text" placeholder="请输入您的身份证号" v-model="params.IdNo" maxlength="18">
                <p class="error" v-if="msg.IdNo">{{msg.IdNo}}</p>
            </li>
            <li id="imgCodeBox" class="form-item" v-if="isShowImgCodeBox">
                <label>图片校验码</label>
                <input type="text" placeholder="请输入图片校验码" v-model="params.imageCode" maxlength="4">
                <div id="changeImgCode" class="img-code" @click="changeImgCode"><img src="data:image/gif;base64,R0lGODlhgAKCAIAAAP///wAAACH5BAEHAAEALAAAAACAAoIAAAL/jI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yu9wsOi8fksvmMTqvX7Lb7DY/L5/S6/Y7P6/f8vv8PGCg4SFhoeIiYqLjI2Oj4CBkpOUlZaXmJmam5ydnp+QkaKjpKWmp6ipqqusra6voKGys7S1tre4ubq7vL2+v7CxwsPExcbHyMnKy8zNzs/AwdLT1NXW19jZ2tvc3d7f0NHi4+Tl5ufo6err7O3u7+Dh8vP09fb3+Pn6+/z9/v/w8woMCBBAsaPIgwocKFDBs6fAgxosSJFCtavIgxo8aNkxw7evwIMqTIkSRLmjyJMqXKlSxbunwJM6bMmTRr2ryJM6fOnTx7+vwJNKjQoUSLGj2KNKnSpUybOn0KNarUqVSrWr2KNavWrVy7ev0KNqzYsWTLmj2LNq3atWzbun0LN67cuXTr2r2LN6/evXz7+v0LOLDgwYQLGz6MOLHixYwbO34MObLkyZQrW76MObPmzbAKAAA7"></div>
                <p class="error" v-if="msg.imageCode">{{msg.imageCode}}</p>
            </li>
        </ul>

        <button @click="submit" :class="{'disabled' : submiting}">实名认证</button>
        <p class="skip-wrapper" v-if="isSkip">
            <a href="javascript:void(0)" class="skip" @click="skip">跳过此步&gt;&gt;</a>
        </p>
    </section>
    <apply-entrance :apply-link="applyLink" @close="applyEntranceClose" v-if="showApply" transition="fade"></apply-entrance>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import './form';
  .form-item input{
    width: px2rem(500);
  }
  .skip-wrapper{
    text-align: center;
    margin-top: px2rem(40);
  }

  .skip{
    @include fsize(30);
    color:#999;
    text-decoration: underline;
  }

    /* always present */
    .fade-transition {
        transition: all .3s ease;
    }
    /* .expand-enter defines the starting state for entering */
    /* .expand-leave defines the ending state for leaving */
    .fade-enter, .fade-leave {
        opacity: 0;
    }
</style>

<script>
import Modal from '../modal.vue'
import check from 'libs/check/m'
import validate from './validate'
import applyEntrance from '../applyEntrance/applyEntrance.vue'
import aes from "libs/aes" 	// 加密

/*APP判断*/
var isApp = tools.getCookie("YiXinAppInfo");

export default {
  data () {
    return {
      isSkip:window.canSkip,
      isRequiringSnap: false,
      submiting: false,
      orderId:'',
      params: {
          IdNo: '',
          realName: '',
          imageCode: '',
      },
      msg: {
        realName:'',
        IdNo:'',
        imageCode: '',
      },
      showApply: false,
      isfirstClickSubmit: true,
      isShowImgCodeBox: false,
      // 上传资料首页链接
//      applyLink: snap_index_url
    }
  },

  methods: {

    submit(){
      if(this.submiting){
        return fasle
      }

      this.resetMsg()
      const validateDispatcher = validate(['realName', 'IdNo', 'imageCode'], this.params, this.msg, this.isShowImgCodeBox)

      validateDispatcher(() => {
        this.submiting = true
        
          var _data={};
          for (var _item in this.params){
                if(_item == 'IdNo'){
                    _data['idNumber'] = aes.encrypt(this.params[_item])
                }else if(_item =='realName'){
                    _data['name'] = this.params[_item]
                }else if(_item ==='imageCode'){
                    _data['imageCode'] = this.params[_item]
                }else{
                    _data[_item] = this.params[_item]
                }
          }

        this.$http.post(id_checking_url, _data).then((response) => {
          response.json().then((res) => {
            if(res.Result){
                this.submiting = false;
                window.location.href=res.Data.RedirectUrl;
            }else{
                this.submiting = false
                if(res.Data === 0){
                    //验证码错误
                    if(!this.isfirstClickSubmit){
                      // this.msg['imageCode'] = '请输入正确的图片校验码';
                      tools.showAlert("请输入正确的图片校验码");
                    }else{
                        setTimeout(function(){
                          $('#changeImgCode img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                        }, 50);
                        tools.showAlert("请输入图片校验码");
                    }
                    this.isShowImgCodeBox = true;
                    
                }else if(res.Data === -1){
                    //需要验证码
                    this.isShowImgCodeBox = true;
                    setTimeout(function(){
                      $('#changeImgCode img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                    },50);
                    tools.showAlert("请输入图片校验码");
                }else {
                    tools.showAlert('身份证与姓名不匹配')
                  if(this.isShowImgCodeBox){
                    $('#changeImgCode img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                  }
                }

                // tools.showAlert('身份证与姓名不匹配')
                // this.submiting = false
            }
            this.isfirstClickSubmit = false;
          })
        })
      }, () => {
        this.submiting = false;
      })
    },

    skip(){
      if(dev){
        console.log(`跳转:${this.orderId}`)
      }else{
          window.location.href = skip_to_url;
//        window.location.href = `${apply_success_url}?orderId=${this.orderId}`
      }
    },

    skipToQulification(){
      window.location.href = `${qualification_url}?orderId=${this.orderId}`
    },

    authSuccess(){
      this.$http.post(order_updating_url, {orderId: this.orderId}, {emulateJSON:true})
    },

    resetMsg(){
      this.msg = {}
    },

    applyEntranceShow: function() {
        this.showApply = true;
    },
    applyEntranceClose: function() {
        if(isApp){
          tools.jsNativeBridge("payResultAction","goOrder");
        }else{
          location.href = user_center_url;
        }  
    },

    changeImgCode () {
      $('#changeImgCode img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
    }
  },

  compiled(){
//    this.params.phone = window.mobile || ''
    this.params.orderId = window.orderId || ''
      this.params.type = window.type || ''
      this.params.returnUrl = window.return_url || ''
      this.params.childOrderId = window.childOrderId || ''
    // this.isRequiringSnap = this.$route.query.isRequiringSnap;
    /* if (this.orderId) {
        this.applyLink = snap_index_url + '?orderId=' + this.orderId;
    } */
  },

  components: {
    'apply-entrance': applyEntrance
  }
}
</script>