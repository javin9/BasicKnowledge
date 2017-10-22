<template>
  <div class="component-account-form">
    <ul>
      <li>
        <label>手机号</label>
        <input type="text" placeholder="请输入手机号" v-model="mobile" @focus="clearMobileErr" @blur="mobileBlurHandler"/>
        <em v-if="showMobileClear" @click="clearMobile"></em>
        <i v-if="showMobileErr"></i>
      </li>
      <li>
        <label>密&emsp;码</label>
        <input :type="passwordType" placeholder="请输入登录密码" v-model="password" @focus="clearPasswordErr"/>
        <em v-if="showPasswordToggle" @click="togglePassword" class="component-account-form-toggle-password" :class="{'password-visible' : passwordVisible}"></em>
        <i v-if="showPasswordErr"></i>
      </li>
    </ul>
    <div class="component-account-form-button">
      <a href="javascript:void(0)" :class="{'disabled': disabledButton}" @click="submit">{{buttonText}}</a>
    </div>
  </div>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-account-form{
    width: 100%;
    background: #fff;

    &-toggle-password{
      width: px2rem(36) !important;
      height: px2rem(36) !important;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAIAAABKoV4MAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM0QkI4MjE2ODVFMjExRTZCNkIyRTNFNkYzNzc4NTE3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM0QkI4MjE3ODVFMjExRTZCNkIyRTNFNkYzNzc4NTE3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzRCQjgyMTQ4NUUyMTFFNkI2QjJFM0U2RjM3Nzg1MTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzRCQjgyMTU4NUUyMTFFNkI2QjJFM0U2RjM3Nzg1MTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6QC/yTAAAD50lEQVR42uyYWU9iQRCFvVfcd8QtRo3G//+L3GDUaNxwX5H55GBZdDdwTSbxYawH0jbVfWo5VdWYNZvNgZ+TfOBH5Rf+F/4nhKIrJXf5zLIs3n94eLi/v+fz5eXl9fVV+2iWSqWRkZGxsbGJiYnx8fH4bFJQy3zds7aTfv309HRxcXF9fd1oNILzZuv7+7v0MWV6enp+fn50dLS/Bcm2Y9gAn5yc3N7eCsnbZBYAnOd5fM/k5OTq6urw8PC34REuPT09vby8ZCGDDMOv41BZSNDhbKVSWVpaYl0IXheR2lqt9vj4GHgpDFsPDg5aOrxCYBNZWFtbs1x02Bp7D7MODg64Nw6sPJuZmZmbm4NiwLMJBzH06urq5uamWx4hxMbGBtwMcxfAQ2ywLeDmrtTwYH19HZIHt+sTI46OjnzMOko8zzc3NwMLOuAh2v7+/tvbWxwlZGpqCuxkFk0Tu6vV6t3dXcADCdHa2tryFfF1F6jkm0h6Etm38tuzL+C/uUiQDSBggyDMvQ7vDw8PyV/SamR7e5u4ma/k6OzsjDizBowqn52d9Rnc29tL9hkMgjcwUQFrew9rDLv5KXaMNmLYCMDkiAg3WoIRf1piCvQ+MhV7Ish6vQ6copJrlxI3SGXXB02e6VtakJS9QyzqLbEjVIfviYEptDLBfSDRTSHdRyhawLrOw1Njdvj8/Ny+zT5FbtGj/BFfFEGZPD8/A9oOPv08HjZ+PTQ0ZObTFTzhzVYWVnLsU5w+5jFPcaPtfZLMRt34K/9nHOG4AyYH4Bf1aMtq47G2Nn2pxPPU/lSOrMa8D4FxfC4sLLSpB00oHqOeD5pOEnD7Clu9js8rN9o+tWf7mj3eb8Yg1dSG54qVlRWfdaOMFlDadqgoTTBvK/vLy8vUm1kDszxeMCEZxIpryRoq1UXpG6RM1nXcBa2s9BcXF1nDHdGQmBMSK3QNLerTh8dGF1IulzE07Hpo7OzsUBJWykHTpV1rxPUWzu7u7lLJyReU7mEAhj0f6+jqAMj1gF9cR1fm6t4/ylCgq+NDTEy9w4AQdjtrAS2JGw1Vwz42X4MH4gTGSUcmqvrjxxkLBi5h94WaeG5AWo2+bq8rWEKxcJFyQY1hNPzwTTcQNJmEwu46702IHhYof/H08/kKhlNS4Ckjzj9Sij416cfdFOJXb9z1EGYxldKNs1lv23lzHh8fU0W+DRSxQMVMh1C5dtNMwJuqcYQsMM1IrSiZfPDbQRyFHBQ30fYTL3kkK/7fDc00XhlYAzlgnNnX90dWIe8DS3vH9t//wvXT0ywo+Fu1705/6n3L3b7KRW7Lfv+z9d/C/xVgAJmWqg0+d7yDAAAAAElFTkSuQmCC) !important;

      &.password-visible{
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAIAAABKoV4MAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3RjQ0QTNFRjg1RjcxMUU2OTgyOTk4MTc0MjA3NUFGQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3RjQ0QTNGMDg1RjcxMUU2OTgyOTk4MTc0MjA3NUFGQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdGNDRBM0VEODVGNzExRTY5ODI5OTgxNzQyMDc1QUZDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdGNDRBM0VFODVGNzExRTY5ODI5OTgxNzQyMDc1QUZDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+yc323wAAAxlJREFUeNrsl0lTIkEQhe2mZRMREEJwOQh68f//E26gsoqAIa4sosB8kEZNUdBIDIQchjq01W3me/kys7IbazQa7Wxu2TsbXVv6Lf2WfhP0xtiR27XMIjcQ/bltWZZ+z626rsitI+sbHdyaG6NhtHocbpjWL8x8oZjl5rmjdvl8/uPjI5VKHR4erlG6Tvz4+Fir1Xw+3+XlpTVZtir50dER1s1ms9/vr5FYZR5t9XqdfTKZVAHZyjQcDkcika+vr3K5PBwOV6TX8zeaLIE9ODjY39+fOnhi+vT09Pz8vLu72+v1isWi+Kyr/ACiHnC42EwdPP4g+v7+XkqAUafTub29HQwGK55yHoJcKBTa7bbjOPF4HIWVSkUZf9e+Wq3yiMzEYrHz83NMu93u9fU1bkYOZ0eTW2OzSOTNzc37+zuSgIWevgOZHvxLT0Rvb2+2bR8fH3OLRTqd9vv9n5+fJO3u7g4FikAVS66Ucy4xLjQ53DRyMBjMZDLASt9BRA8K5vjgQQME3IgW58Fk0SOE1Wq1Xl5eotEoiRGIqaFtm28NSouL6JPg8EK9/JcGF1gMKPT32CEWj8ejdORyOVCIlHIgAmv+BVZwsvb29kAkVlxUrOSZrGLJBkzCwiyRSJRKJRxRHwgEBB+19BliQqGQpSqquBuNBqcfgouLCzm4IBIsOVjQjBIfV2IiaCmzoD08PCg0w8sxiopouNmcnZ2poUEfnJyceL1eagY0NFSUhEk0nsnCBmPU46hONphkmN5CwOvrK75z6PVBgUQ2ZIZcGRVFBxtGMlmVh9lsluvV1ZWaqbiT2HFWtfY8PT3Fd7ZvpuhlQYwOfTDJov+RwliE2+19iC9Nh1CyTdWVDS4cpZ+/dsavIMeB2xiZgMrc4HS4cctz3ljsKZ/qksWj0zbax/hMkIcIkhzqp2Pua420kyGZJTqma8MuM9ix4bTQeoZ0pgpXDpUxGekyglDIC17fU/Q6+pIfPIbZ4tufkz93PzfbKufGrRvgUur1Dljly27Zz4LZ2q/xO/Nffmb8Gvf2R9aWfkv/X9L/EWAAdK9TqVwqQ+8AAAAASUVORK5CYII=) !important;
      }
    }

    &-button{
      padding:px2rem(40) px2rem(30) px2rem(20);
      position: relative;

      a{
        &.disabled{
          background: $disabled-color;
        }

        @include fsize(32);
        display: block;
        text-decoration: none;
        text-align: center;
        line-height: px2rem(100);
        border-radius:px2rem(5);
        color:#fff;
        background: $main-color;
      }
    }

    li{
      @include borderBottom();
      background: #fff;
      margin:0 px2rem(30);
      display: flex;
      align-items: center;
      height: px2rem(100);

      b{
        @include size(px2rem(36));
        display: block;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
        margin-right: px2rem(16);
      }

      label{
        @include fsize(32);
        color:$dark-color;
        display: block;
        width: px2rem(130);
        box-sizing:border-box;
      }

      input, p{
        @include fsize(32);
        display: block;
        flex:1;
        border:0;
        padding:0;
        width:0;
      }

      em{
        display: block;
        width: px2rem(34);
        height: px2rem(30);
        background: url(./del.png) no-repeat center center;
        background-size: contain;
      }

      i{
        display: block;
        width: px2rem(30);
        height: px2rem(30);
        background: url(./err.png) no-repeat center center;
        background-size: contain;
      }

      a,span{
        @include fsize(26);
        @include border($main-color);
        border-radius:px2rem(3);
        color:$main-color;
        border-radius:px2rem(3);
        line-height:px2rem(48);
        width:px2rem(168);
        text-align:center;
        position: relative;
        margin-left: px2rem(40);

        &:before{
          content: ' ';
          @include borderLeft();
          height: px2rem(48);
          width: 0;
          position: absolute;
          left:px2rem(-30);
        }
      }

      span{
         @include border($disabled-color);
        color:#b2b2b2;
      }
    }
  }
</style>

<script>
  import check from 'libs/check/m'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import aes from "libs/aes" 	// 加密

  Vue.use(VueResource)

  export default {
    props: {
      buttonText: {
        type: String,
        default: '提交'
      },
      mobile: {
        type: String,
        default: ''
      },
      password: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      encryption:{  // 是否加密
        type: Boolean,
        default: false
      }
    },
    
    data () {
      return {
        passwordVisible: false,

        // 是否显示密码错误icon
        showPasswordErr: false,

        // 是否显示手机号错误icon
        showMobileErr: false,
      }
    },

    computed:{
      passwordValid(){
        return this.password !== ''
      },
      mobileValid(){
        return check.isPhoneNumber(this.mobile)
      },
      showPasswordToggle(){
        return !this.showPasswordErr
      },
      showMobileClear(){
        return this.mobile !== '' && !this.showMobileErr
      },
      disabledButton(){
        return this.disabled || !this.mobileValid || !this.passwordValid
      },
      passwordType(){
        return this.passwordVisible ? 'text' : 'password'
      }
    },

    methods:{

      clearMobile(){
        this.mobile = ''
      },

      togglePassword(){
        this.passwordVisible = !this.passwordVisible
      },

      clearPasswordErr(){
        this.showPasswordErr = false
      },

      clearMobileErr(){
        this.showMobileErr = false
      },

      mobileBlurHandler(){
        if(!this.mobileValid){
          this.showMobileErr = true
        }
      },

      submit(){
        if(this.disabledButton){
          return false
        }

        const params = {
          mobile: this.encryption ? aes.encrypt(this.mobile) : this.mobile,
          password: this.encryption ? aes.encrypt(this.password) : this.password
        }

        this.$emit('submit', params)
      }
    },

    components: {
    }
  }
</script>