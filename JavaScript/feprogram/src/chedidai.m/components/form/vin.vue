<template>
  <div class="component-vin-wrapper" :class="{'disabled':disabled}">
    <div class="component-vin" :class="{border:border, error: showError}">
      <label><span>车架号</span><em @click="disabled?help=false:help=true"></em></label>
      <div>
        <span v-if="disabled" class="disabled-holder">{{value || placeholder}}</span>
        <input type="text" :placeholder="placeholder" v-model="value" @focus="focusHandler" @change="checkVinValid(1)" @blur="blurHandler" :disabled="disabled" v-else>
        <i></i>
        <em @click="disabled?example=false:example=true"></em>
      </div>
    </div>

    <div class="uploading-modal" v-if="showUploading"> <span>图像识别中</span> </div>

    <div class="vin-example-alert" v-show="example">
      <div class="example">
        <file-upload name="vin" :action="api" accept="image/png, image/jpeg, image/tif, image/bmp" ext="imgExtension" json="true" :data="vinFileData"></file-upload>
      </div>
      <a class="close" href="javascript:void(0)" @click="example=false"></a>
    </div>

    <div class="vin-replace-modal" v-if="showReplaceModal">
      <a href="javascript:void(0)" class="close" @click="showReplaceModal=false" v-show="showReplaceConfirm"></a>
      <div class="confirm" v-if="showReplaceConfirm">
        <header>您所选车型与已输入车型不符<br>是否替换？</header>
        <div class="info">
          <dl v-if="car">
            <dt>已输入车型：</dt>
            <dd>{{car}}</dd>
          </dl>
          <dl>
            <dt>VIN选择车型:</dt>
            <dd>{{carNameVinSelected}}</dd>
          </dl>
        </div>
        <footer>
          <a href="javascript:void(0)" @click="showReplaceConfirm=false">重新选择</a>
          <a href="javascript:void(0)" @click="replaceCarWithVin()">确认替换</a>
        </footer>
      </div>
      <div class="list" v-else>
        <h6>请选择车型</h6>
        <div class="code">{{value}}</div>
        <ul>
          <li v-for="one in carReplaceList" @click="selectCarVin(one)">{{one.MakeName}}{{one.ModelName}} {{one.StyleYear}}款 {{one.StyleName}}</li>
        </ul>
      </div>
    </div>

    <div class="vin-help-alert" v-if="help">
      <h2>【 VIN码在哪？】</h2>
      <h6>第一个：行驶本</h6>
      <div class="img-1"></div>
      <h6>第二个：前挡风玻璃</h6>
      <div class="img-2"></div>
      <a href="javascript:void(0)" class="close" @click="help=false"></a>
    </div>

    <mask></mask>
  </div>
</template>

<style>
  .vin-example-alert{
    .example input{
      width: 100%;
      height:100%;
    }  
  }
</style>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  @import './mixin';
  .component-vin-wrapper.disabled .component-vin{
    @include form-element(vin_disabled);
    color:$disabled-color;
    .disabled-holder{
      color:$disabled-color;
      display: inline-block;
      vertical-align: middle;
      margin-right: px2rem(10);
    }
    input[type=text]{
      color:$disabled-color;
      &::placeholder{
        color:$disabled-color !important;
        opacity: 1 !important;
      }
    }
    >label em{
       background-image: url(./icons/tip_disabled.png);
     }
    >div em{
       background-image: url(./icons/camera_disabled.png);
     }
  }
  .component-vin{
    @include form-element(vin);
    &:after{
      display: none; 
    }
    input[type=text]{
        display: inline-block;
        vertical-align: middle;

      }
      >label span{
        display: inline-block;
        vertical-align: middle;
      }
      >label em{
        @include size(px2rem(24));
        content:' ';
        display: inline-block;
        background: url(./icons/tip.png) no-repeat center center;
        background-size: contain;
        margin-left: px2rem(9);
        vertical-align: middle;
      }
      >div em{
        top:50%;
        display: inline-block;
        vertical-align: middle;
        background: url(./icons/camera.png) no-repeat center center;
        background-size: contain;
        width: px2rem(36);
        height:px2rem(28);
      }

      &.error{
        input{
          color: $main-color;
        }

        i{
          @include size(px2rem(30));
          content:' ';
          background: url(./icons/err.png) no-repeat center center;
          background-size: contain;
          display: inline-block;
          vertical-align: middle;
        }
      }
  }

  .vin-replace-modal{
    @include modal;
    padding:px2rem(40) 0 0;
    text-align: left;
    color:$normal-color;

    .list{
      h6{
        @include fsize(30);
        padding:0 px2rem(30);
        color:$dark-color;
      }

      .code{
        @include fsize(30);
        @include border(#C4C4C4);
        border-radius:px2rem($main-border-radius);
        text-align: center;
        padding:px2rem(30) 0;
        margin:px2rem(20) auto;
        width: px2rem(460);
      }

      ul{
        margin:0 px2rem(40);

        li{
          @include fsize(26);
          @include borderBottom;
          padding:px2rem(27) 0;
          color:$dark-color;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;;

          &:last-child{
            border:0;
          }
        }
      }
    }

    .confirm{
      header{
        @include fsize(30);
        @include borderBottom;
        color:$main-color;
        padding:px2rem(0) 0 px2rem(18);
        text-align: center;
      }
      dl{
        @include fsize(26);
        padding:px2rem(27) px2rem(50);
        color:$normal-color;

        dd{
          margin-top: px2rem(10);
          color:$dark-color;
        }
      }
      footer{
        @include borderTop;
        display:flex;

        a{
          @include fsize(32);
          flex:1;
          color:$main-color;
          text-align: center;
          padding:px2rem(26) 0;
          display: block;

          &:first-child{
            @include borderRight;
            color:$light-color;
          }
        }
      }
    }
  }

  .uploading-modal{
    @include modal;
    @include fsize(30);
    width: 100%;
    left:0;
    transform:none;
    top:40%;
    background: none;
    color:#fff;

    span{
      display: inline-block;
      vertical-align: middle;
    }

    &:before{
      content:' ';
      background: url(./icons/loading.gif) no-repeat center center;
      width:px2rem(54);
      height:px2rem(54);
      background-size: contain;
      display: inline-block;
      vertical-align: middle;
      margin-right: px2rem(15);
      transform:rotate;
    }
  }

  .vin-example-alert{
    @include modal;
    width: px2rem(500);
    height:px2rem(340);
    background: none;
    background: url(./vin/example.png) no-repeat center center;
    background-size: contain;
    .example{
      width: 100%;
      height:100%;
      opacity:0;
    }
  }

  .vin-help-alert{
    @include modal;
    padding:px2rem(40) 0 px2rem(50);

    h2{
      @include fsize(30);
      color:$dark-color;
      margin-bottom: px2rem(10);
    }

    h6{
      @include fsize(30);
      color:$normal-color;
      margin:px2rem(9) 0;
    }

    .img-1{
      width: px2rem(460);
      height:px2rem(311);
      background: url(./vin/1.jpg) no-repeat left top;
      background-size: contain;
      margin:0 auto;
      display: block;
    }

    .img-2{
      width: px2rem(460);
      height: px2rem(205);
      background: url(./vin/2.jpg) no-repeat left top;
      background-size: contain;
      margin:0 auto;
      display: block;
    }
  }
</style>

<script>
  import FileUpload from 'libs/vue-components/file-upload'
  import Mask from 'libs/mask'

  export default {
    props: {
      border: {
        type: Boolean,
        default: false
      },
      //组件是否可用
      disabled: {
          type: Boolean,
          default: false
      },
      initialValue: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: 'vin'
      },

      placeholder: {
        type: String,
        default: '请输入VIN码'
      },

      // 父级组件已选择的车型名称
      car: String,
      event: {
        type: String,
        default: 'updateForm'
      },

      // 替换车型调用this.event传的type类型
      replace: {
        type: String,
        default: 'car'
      }
    },
    data () {
      return {
        api: '/MortgageApply/GetCarsInfoByVin',

        value: this.initialValue,
        valid: true,
        showError: false,
        // 文本框聚焦前临时存储前值
        beforeFocusValue: '',

        // 上传示例弹层展示控制
        example: false,
        // 说明提示弹层展示控制
        help:false,
        // 文件上传loading状态弹层展示控制
        showUploading: false,
        // 车型替换弹层展示控制
        showReplaceModal:false,
        // 车型替换确认视图展示控制
        showReplaceConfirm:false,

        // 图片上传附加参数
        // type=1 手动更改， type=2 图片识别
        vinFileData : {
          type: 2
        },

        // 可替换车型相关信息
        carReplaceList:[],
        carNameVinSelected: '',
        carIDVinSelected:'',
        carYearSelected: ''
      }
    },

    watch: {
      value: function(value, oldValue){
        if(value.length > 17){
          this.$nextTick(() => this.value = oldValue)
        }else{
          this.$dispatch(this.event, this.name, value)
        }
      },

      example(value){
        if(!value){
          this.$broadcast('hideMask')
        }else{
          this.$broadcast('showMask')

          // 某些机型上确保示例弹层已经展示后再出现系统文件上传选择框
          setTimeout(()=>this.$broadcast('openFileSelector'),300)
        }
      },

      showReplaceModal(value){
        if(!value){
          this.$broadcast('hideMask')
        }else{
          this.$broadcast('showMask')
        }
        this.showReplaceConfirm = false
      },

      showUploading(value){
        if(!value){
          this.$broadcast('hideMask')
        }else{
          this.$broadcast('showMask')
        }
      },

      help(value){
        if(!value){
          this.$broadcast('hideMask')
        }else{
          this.$broadcast('showMask')
        }
      }
    },

    events:{
      onFileChange(){
        this.example = false
      },

      beforeFileUpload(file){
        this.showMask = true
        this.showUploading = true
      },

      onFileUpload(file, res){
        this.showUploading = false
        this.changeVinHandler(res)
      }
    },

    methods:{
      /**
       * 文本框聚焦事件句柄
       * @description 1. 取消错误提示
       *              2. 临时保存聚焦前的值
       */
      focusHandler(){
        this.beforeFocusValue = this.value
        this.showError = false
      },

      /**
       * 文本框失去焦点事件句柄
       * @description 对比聚焦前保存的值，若是值相同且聚焦前错误，则显示错误提示
       */
      blurHandler(){
        if(this.beforeFocusValue === this.value && !this.valid){
          this.showError = true
        }
      },

      /**
       * 检测vin值是否正确
       * @description 只针对手动输入vin做回调，图片识别走上传组件流程
       * @param  {Number} type 1=手动输入vin, 2=图片识别vin
       */
      checkVinValid(type){
        if(!this.value){
          this.changeVinHandler({
            Result:false
          })
        }else{
          this.$http.post(this.api, {Vin: this.value, type},{emulateJSON:true}).then(response => response.json().then(this.changeVinHandler))
        }
      },

      /**
       * 图片识别或手动输入后统一回调
       * @description 1. 渲染车型替换弹层
       *              2. 将vin是否合法上报父级
       *              3. vin不合法则展示错误信息
       * @param  {Object} res 车型信息
       */
      changeVinHandler(res){
        this.valid = res.Result
        this.showError = this.value && !res.Result

        this.$dispatch('setVinValid', this.valid)

        if(res.Result){
          this.value = res.Data.VehicleLicense.VIN
          this.carReplaceList = res.Data.StyleList
          if(this.carReplaceList.length){
            this.showReplaceModal = true
          }
        }else if(res.Message){
          tools.showAlert(res.Message)
        }
      },

      /**
       * 车型替换列表弹层选择替换车型回调
       * @description 展示确认替换弹层
       * @param  {Object} car 车型信息
       */
      selectCarVin(car){
        this.carIDVinSelected = car.StyleId
        this.carYearSelected = car.StyleYear
        this.carNameVinSelected = `${car.MakeName}${car.ModelName} ${car.StyleYear}款 ${car.StyleName}`
        this.showReplaceConfirm = true
      },

      /**
       * 确认替换车型
       * @description 1. 通知父级车型更换
       *              2. 通知父级更新车辆上市年份，约束首次上牌时间
       */
      replaceCarWithVin(){
        this.$dispatch(this.event, this.replace, {
          id: this.carIDVinSelected,
          name: this.carNameVinSelected
        })
        if(this.carYearSelected){
          this.$dispatch('setDatePicker', this.carYearSelected)
        }
        this.showReplaceModal = false
      }
    },

    ready(){
    },

    components: {
      FileUpload,
      Mask
    }
  }
</script>