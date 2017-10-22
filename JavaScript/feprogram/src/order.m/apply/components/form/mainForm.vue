<template>
    <section class="form-box">
        <ul>
            <!--<li class="form-item">
                   <label>姓名</label>
                   <input type="text" placeholder="请输入姓名" :disabled="isAuthenticated" v-model="params.Name" @input="checkInput('Name', {length:8})" @change="validate('name')">
                   <p class="error" v-if="msg.name">{{msg.name}}</p>
                   <div class="authed" v-if="isAuthenticated">已实名认证</div>
                 </li> -->
            <li class="form-item">
                <label>手机号</label>
                <input type="number" placeholder="请输入手机号" v-model="params.Telephone" :disabled="isLoggedIn" id="mobile"
                       @input="checkInput('Telephone', {length:11})" @change="validate('telephone')">

                <p class="error" v-if="msg.telephone">{{msg.telephone}}</p>
            </li>
            <li class="form-item" v-if="!isLoggedIn">
                <label>验证码</label>
                <input type="number" placeholder="请输入验证码" v-model="params.code" @input="checkInput('code', {length:4})"
                       id="validcode" v-el:code-input>
                <a href="javascript:void(0)" class="form-btn" @click="getCode" v-if="!isLoggedIn" id="GetValidateCode">获取验证码</a>
                <p class="error" v-if="msg.code">{{msg.code}}</p>
            </li>

            <!-- 赠险 -->
            <!-- <li class="sec_insurance" @click="insurance()">
                <i :class="{'cur' : params.IsSelectedInsurance}"></i><span>勾选可免费领取</span><b class="authorization03" @click="insuranceModal($event)">100万意外险</b>，出行更多保障
            </li>   -->
        </ul>
        <div class="bg_fff"><button @click="submit" :class="{'disabled' : submiting}">提交</button></div>
        <div class="InfoUsing" @click="InfoUsing">提交即表示您已同意<span>《信息使用授权书》</span></div>
    </section>

    <Modal v-if="modalShow" :close="closeModal" :confirm="_submit"></Modal>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import './form';
  /*赠险*/
  .sec_insurance { @include fsize(24); display: flex; position:relative; align-items: center;
    margin-bottom: 0.26667rem; padding: 0 0 0 0.32rem; background-color: #fff; }
  .sec_insurance b { color: #5fc3e8; font-weight: normal; }
  .sec_insurance i { display: inline-block; width: 0.613333rem; height: 0.613333rem; background: url(images/icon.png) -0.546667rem -4.973333rem no-repeat; -webkit-background-size: 6.8rem 8.613333rem; background-size: 6.8rem 8.613333rem; vertical-align: middle; }
  .sec_insurance i.cur { background-position: -0.546667rem -4.28rem; }
</style>

<script>
import Modal from '../modal.vue'
import check from 'libs/check/m'
import validate from './validate'
import showCGBAlter from '../../libs/showCGBAlter'


const initParams = {}
$('input[type="hidden"]').each((index,elem) => {
  initParams[elem.name] = elem.value
})




export default {
  props:['isAuthenticated', 'isLoggedIn'],
  data () {
    return {
      modalShow:false,
      submiting: false,
      params: Object.assign({}, initParams, {
        Telephone: window.mobile || '',
        code: '',
        isFromShopCGBBank:window.isFromShopCGBBank,
        isFromCITICBank:window.isFromCITICBank
      }),
      msg: {
        name:'',
        telephone:'',
        code:''
      }
    }
  },

  methods: {
    checkInput(name, opt){
      opt = opt || {}
      if(opt.length){
        this.params[name] = this.params[name].slice(0,opt.length)
      }
      return false
    },

    validate(name){
      validate([name], this.params, this.msg)()
    },

    insurance(){
      this.params.IsSelectedInsurance = !this.params.IsSelectedInsurance
    },

    submit(){

      if(this.submiting){
        return false
      }


      this.submiting = true

      this.resetMsg()

      if(this.isAuthenticated){
        // 逻辑更改，不会执行
        // 已实名认证后端调走，不进入该页面
        this.dispatch('authenticated')
      }else if(this.isLoggedIn){
        // 逻辑更改，不会执行
        // 已登录未实名顶层直接跳到实名认证页面
        this.dispatch('logined')
      }else{
        this.dispatch()
      }
    },

    InfoUsing(e){
        tools.serviceProvision({
            'url':'/home/InfoUsingAuthorization',
            'title':'信息使用授权书',
          })
          e.preventDefault();
          e.stopPropagation()
    },

    dispatch(type='default'){
      type = type.charAt(0).toUpperCase() + type.slice(1)
      this[`submit${type}`]()
    },

    submitAuthenticated(){
     // this.modalShow = true
     this._submit()
    },

    submitLogined(){
      const validateDispatcher = validate(['name'], this.params, this.msg)
      validateDispatcher(()=>{
        // this.modalShow = true
       this._submit()
      }, () => {
        this.submiting = false
      })
    },

    submitDefault(){
      const validateDispatcher = validate([/*'name'*/, 'code', 'telephone'], this.params, this.msg)
      validateDispatcher(()=>{
        // this.modalShow = true
       this._submit()
      }, () => {
        this.submiting = false
      })
    },

    _submit(){
       this.$http.post(order_creating_url, this.params, {emulateJSON:true}).then((response) => {
        response.json().then((res) => {
          this.closeModal()

          if(res.Result) {
              window.location.href = res.Data.RedirectUrl
//              if (res.Data.IsRequiringSnap) {
//                  location.href = `${snap_index_url}?orderId=${res.Data.OrderId}&childOrderId=${res.Data.ChildOrderId}`;
//              } else {
//                    if(res.Data.IsAuthenticated && !dev){
//                        // 跳转下一步
//                        if(window.isFromShopCGBBank){
//                            window.location.href = `${qualification_url}?orderId=${res.Data.OrderId}&isFromShopCGBBank=true`;
//                        }else{
//                            window.location.href = `${qualification_url}?orderId=${res.Data.OrderId}`
//                        }
//                    } else {
//                        // 实名认证页
//                        this.$router.go({path:'auth', query: {userId:res.Data.UserId, phone: this.params.Telephone, orderId: res.Data.OrderId}});
//                        document.title="实名认证";
//                        showCGBAlter(res.Data.OrderId);
//                    }
//              }
          } else {
            tools.showAlert(res.Message)
            this.submiting = false
          }
        })
       })
    },

    getCode(){
      const validateDispatcher = validate(['telephone'], this.params, this.msg)
      validateDispatcher(() => {
        check.getCode({__RequestVerificationToken:$('input[name="__RequestVerificationToken"]').val(), length: 4},this.$els.codeInput.focus())
      })
    },

    resetMsg(){
      for(let i in this.msg){
        this.msg[i] = ''
      }
    },

    closeModal(){
      this.modalShow = false
      this.submiting = false
    },

    insuranceModal(e){
      tools.serviceProvision({
        'url':'/home/AccidentInsurance', 
        'title':'100万出行意外险说明',
        'params': {InsComp: this.params.InsuranceCompanyName === 'syzx' ? '2' : '1'}
      })
      e.preventDefault()
      e.stopPropagation()
    }
  },

  compiled(){
    if(dev){
      // this.params.Name = "王之彦"
      //this.params.Telephone = "132690317"
      // this.params.code = "312312"
    }
  },

  components: {
    Modal
  }
}

</script>