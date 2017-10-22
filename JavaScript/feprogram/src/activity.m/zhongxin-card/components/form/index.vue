<template>
		<div class="component-form">
      <section>
        <h1>推荐人信息</h1>
        <component-input 
          v-model="referName" 
          type="name"
          placeholder="请输入推荐人真实姓名"
          :class="{'error': validation.referName.error}"
          @focus="resetError('referName')"
        ></component-input>

        <component-input 
          v-model="referTel" 
          type="mobile"
          placeholder="请输入推荐人手机号"
          :class="{'error': validation.referTel.error}"
          @focus="resetError('referTel')"
        ></component-input>

        <component-input 
          v-model="referNo" 
          type="digits"
          placeholder="请输入推荐人联名卡号"
          maxlength="16"
          :class="{'error': validation.referNo.error}"
          @focus="resetError('referNo')"
        ></component-input>
      </section>  
      <section>
        <h1>被推荐人信息</h1>
        <component-input 
          v-model="recommendName" 
          type="name"
          placeholder="请输入被推荐人真实姓名"
          :class="{'error': validation.recommendName.error}"
          @focus="resetError('recommendName')"
        ></component-input>

        <component-input 
          v-model="recommendTel" 
          type="mobile"
          placeholder="请输入被推荐人手机号"
          :class="{'error': validation.recommendTel.error}"
          @focus="resetError('recommendTel')"
        ></component-input>
      </section>
      <a @click="submit" :class="{'disabled': submitDisabled}" href="javascript:void(0)">提交</a>
    </div>
    <error-modal></error-modal>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-form{
    background: #fff;
    padding-bottom: px2rem(25);

    >section{
      padding:px2rem(113) px2rem(30) 0;
      position: relative;
    }

    section:nth-child(2) h1{
      background-image: url(./title2.png);
      width: px2rem(253);
    }

    h1{
      font-size:px2rem(32);
      background: url(./title.png) no-repeat left top / contain;
      width: px2rem(220);
      height: px2rem(68);
      color:#fff;
      line-height: px2rem(54);
      padding-left: px2rem(28);
      box-sizing:border-box;
      position: absolute;
      left:px2rem(-16);
      top:px2rem(32);
    }

    input{
      @include fsize(30);
      @include border;
      -webkit-appearance: none;
      width: 100%;
      box-sizing:border-box;
      display: block;
      color: $dark-color;
      border-radius:px2rem(5);
      margin-bottom: px2rem(22);
      padding:0 px2rem(30);
      height: px2rem(110);
      border-radius:px2rem(10);

      &.error{
        background: url(./error.png) no-repeat right px2rem(20) center / px2rem(44) px2rem(44);
        color: $main-color;
      }
    }

    a{
      @include fsize(32);
      text-align: center;
      margin:px2rem(30) px2rem(30) 0;
      background: #f5a100;
      display: block;
      border:0;
      height: px2rem(100);
      line-height: px2rem(100);
      color:#fff !important;

      &.disabled{
        opacity:.5;
      }
    }
  }
</style>

<script>
import ErrorModal from '../error-modal'
import check from 'libs/check/m'
import componentInput from 'libs/vue-components/elements/input'

export default {
  props:['interface'],

  data() {
    return {
      // 推荐人相关
      referName: '',
      referTel: '',
      referNo: '',

      // 被推荐人相关
      recommendName: '',
      recommendTel: '',

      submiting: false,

      validation: {
        referName: {
          msg: '请输入真实姓名',
          error: false
        },
        referTel: {
          msg: '请输入正确的手机号',
          error: false
        },
        referNo: {
          msg: '请输入正确的联名卡号',
          error: false
        },
        recommendName: {
          msg: '请输入真实姓名',
          error: false
        },
        recommendTel: {
          msg: '请输入正确的手机号',
          error: false
        }
      }
    }
  },

  computed: {
    submitDisabled(){
      return Object.keys(this.$valid).some(key => this.$valid[key].empty) || this.submiting
    },

    // 验证对象
    $valid(){
      const isEmpty = value => value === ''
      return {
        referName: {
          valid: check.isName(this.referName),
          empty: isEmpty(this.referName)
        },
        referTel: {
          valid: check.isPhoneNumber(this.referTel),
          empty: isEmpty(this.referTel)
        },
        referNo: {
          valid: /^(622918|622919)\d{10}/.test(this.referNo),
          empty: isEmpty(this.referNo)
        },
        recommendName: {
          valid: check.isName(this.recommendName),
          empty:isEmpty(this.recommendName)
        },
        recommendTel: {
          valid: check.isPhoneNumber(this.recommendTel),
          empty: isEmpty(this.recommendTel)
        }
      }
    },

    // 表单不合法
    formInvalid(){
      return Object.keys(this.$valid).some(key => !this.$valid[key].valid)
    }
  },

  methods:{
    resetError(key){
      this.validation[key].error = false
    },
    submit(){
      if(this.submitDisabled){
        return false
      }

      if(this.formInvalid){
        Object.keys(this.$valid).some(key => {
          const valid = this.$valid[key].valid
          if(!valid){
            this.validation[key].error = true
            key === 'referNo' ? this.$broadcast('showModal','您输入的联名卡卡号有误', '联名卡（中信易鑫联名信用卡）卡号是以622918或622919开头，16位纯数字，请确保卡号无误。') :
              tools.showAlert(this.validation[key].msg)
          }
          return !valid
        })

        return false
      }

      this.submiting = true

      const params = {
        ReferName: this.referName,
        ReferTel: this.referTel,
        ReferNo: this.referNo,
        RecommendName: this.recommendName,
        RecommendTel: this.recommendTel
      }

      this.$http.post(this.interface, params).then(response => response.json().then(res => {
        this.submiting = false
        if(res.Result){
          this.$router.go('/success')
        }else{
          tools.showAlert(res.Message)
        }
      }))
    }
  },

  components: {
    ErrorModal,
    componentInput
  }
}
</script>