<template>
  <div class="component-form">
    <div class="form-wrapper">
      <div class="form-item">
        <label>姓名</label>
        <input type="text" v-model="params.UserName">
      </div>
      <div class="form-item form-selector" rel="Sex" data-aslider-in="sex|fade|bottom">
        <label>性别</label>
        <span>{{params.Sex}}</span>
        <em></em>
        
      </div>
    </div>
    <div class="form-wrapper">
      <div class="form-item">
        <label>手机</label>
        <input type="tel" v-model="params.Telephone" maxlength="11">
      </div>
      <div class="form-item form-selector" rel="CarSerial" data-aslider-in="car|fade|bottom">
        <label>车型</label>
        <span>{{params.CarSerial}}</span>
        <em></em>
      </div>
    </div>
    <div class="form-wrapper">
      <div class="form-item form-selector" rel="Province" data-aslider-in="province|fade|bottom">
        <label>省份</label>
        <span>{{params.Province}}</span>
        <em></em>
      </div>
      <div class="form-item form-selector" rel="City" data-aslider-in="city|fade|bottom">
        <label>城市</label>
        <span>{{params.City}}</span>
        <em></em>
      </div>
    </div>
    <div class="form-wrapper">
      <div class="form-item form-selector" rel="County" data-aslider-in="county|fade|bottom">
        <label>区/县</label>
        <span>{{params.County}}</span>
        <em></em>
      </div>
      <div class="form-item form-selector" rel="Dealer" data-aslider-in="dealer|fade|bottom">
        <label>经销商</label>
        <span>{{params.Dealer}}</span>
        <em></em>
      </div>
    </div>
    <div class="form-wrapper">
      <div class="form-item form-item-large">
        <label>预约时间</label>
        <div id="datepicker">
          <span>{{date.year}}</span>
          <em></em>
          <span>{{date.month < 10 ? '0' + date.month : date.month}}</span>
          <em></em>
          <span>{{date.date < 10 ? '0' + date.date : date.date}}</span>
          <em></em>
        </div>
      </div>
    </div>
    <div class="button-wrapper">
      <a href="javascript:void(0)" @click="submit">立即预约试驾</a>
    </div>
  </div>

  <!-- 性别选择弹层 -->
  <aside class="sel-control-box" data-aslider="sex">
    <div class="asilder_wrapper">
        <div class="sel-ctrl-fun-btn">
            <div class="sel-ctrl-close font-nav">取消</div>
            <div class="sel-ctrl-title font-nav">性别</div>
            <div class="sel-ctrl-complete font-nav">确定</div>
        </div>
        <div class="scroll-wrapper">
            <div class="scroll">
                <ul class="slider">
                    <li data-id="{{one}}" v-for="one in sexList">{{one}}</li>
                </ul>
            </div>
        </div>
    </div>
  </aside>

  <!-- 车型选择弹层 -->
  <aside class="sel-control-box" data-aslider="car">
    <div class="asilder_wrapper">
        <div class="sel-ctrl-fun-btn">
            <div class="sel-ctrl-close font-nav">取消</div>
            <div class="sel-ctrl-title font-nav">车型</div>
            <div class="sel-ctrl-complete font-nav">确定</div>
        </div>
        <div class="scroll-wrapper">
            <div class="scroll">
                <ul class="slider">
                    <li data-id="{{one}}" v-for="one in carSerial">{{one}}</li>
                </ul>
            </div>
        </div>
    </div>
  </aside>

  <!-- 省份选择弹层 -->
  <aside class="sel-control-box" data-aslider="province">
    <div class="asilder_wrapper">
        <div class="sel-ctrl-fun-btn">
            <div class="sel-ctrl-close font-nav">取消</div>
            <div class="sel-ctrl-title font-nav">省份</div>
            <div class="sel-ctrl-complete font-nav">确定</div>
        </div>
        <div class="scroll-wrapper">
            <div class="scroll">
                <ul class="slider">
                    <li data-id="{{one}}" v-for="one in provinceList">{{one}}</li>
                </ul>
            </div>
        </div>
    </div>
  </aside>

  <!-- 城市选择弹层 -->
  <aside class="sel-control-box" data-aslider="city">
    <div class="asilder_wrapper">
        <div class="sel-ctrl-fun-btn">
            <div class="sel-ctrl-close font-nav">取消</div>
            <div class="sel-ctrl-title font-nav">城市</div>
            <div class="sel-ctrl-complete font-nav">确定</div>
        </div>
        <div class="scroll-wrapper">
            <div class="scroll">
                <ul class="slider">
                    <li data-id="{{one}}" v-for="one in cityList">{{one}}</li>
                </ul>
            </div>
        </div>
    </div>
  </aside>

  <!-- 区县选择弹层 -->
  <aside class="sel-control-box" data-aslider="county">
    <div class="asilder_wrapper">
        <div class="sel-ctrl-fun-btn">
            <div class="sel-ctrl-close font-nav">取消</div>
            <div class="sel-ctrl-title font-nav">区县</div>
            <div class="sel-ctrl-complete font-nav">确定</div>
        </div>
        <div class="scroll-wrapper">
            <div class="scroll">
                <ul class="slider">
                    <li data-id="{{one}}" v-for="one in countyList">{{one}}</li>
                </ul>
            </div>
        </div>
    </div>
  </aside>

  <!-- 经销商选择弹层 -->
  <aside class="sel-control-box" data-aslider="dealer">
    <div class="asilder_wrapper">
        <div class="sel-ctrl-fun-btn">
            <div class="sel-ctrl-close font-nav">取消</div>
            <div class="sel-ctrl-title font-nav">经销商</div>
            <div class="sel-ctrl-complete font-nav">确定</div>
        </div>
        <div class="scroll-wrapper">
            <div class="scroll">
                <ul class="slider">
                    <li data-id="{{one}}" v-for="one in dealerList">{{one}}</li>
                </ul>
            </div>
        </div>
    </div>
  </aside>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  $element-height:88;

  .component-form{
    padding: px2rem(754) px2rem(32) 0;

    .button-wrapper{
      margin-top: px2rem(40);

      a{
        font-size:px2rem(32);
        background: #1e79c6;
        color:#fff;
        padding:px2rem(30) 0;
        border-radius:px2rem(10);
        width: 100%;
        text-align: center;
        display: block;
      }
    }

    .form-wrapper{
      display: flex;
      margin-bottom: px2rem(30);

      .form-item{
        @include border(#9e9e9e);
        display: flex;
        width: px2rem(330);
        border-radius:px2rem(10);
        margin-right: px2rem(30);
        height:px2rem($element-height);
        box-sizing:border-box;
        align-items: center;

        &-large{
          width: 100%;

          > div{
            flex:1;
            text-align: right;

            span{
              width: px2rem(50);
              text-align: right;
              text-overflow: initial;
              overflow: visible;
            }

            span,em{
              display: inline-block;
              vertical-align: middle;
            }
          }
        }

        em{
          background: url(../images/arc.png) no-repeat center center;
          height:px2rem($element-height);
          background-size: contain;
          display: block;
          width: px2rem(18);
          margin:0 px2rem(20);
        }

        span{
          display: block;
          flex:1;
          line-height: px2rem($element-height);
          color: $dark-color;
          font-size:px2rem(26);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          &.center{
            text-align: center;
          }
        }

        label{
          font-size:px2rem(26);
          color:$normal-color;
          line-height: px2rem($element-height);
          margin:0 0 0 px2rem(30);
          display: block;
          min-width: px2rem(95);
          white-space: nowrap;
        }

        input{
          font-size:px2rem(26);
          color:$dark-color;
          display: block;
          background: none;
          flex:1;
          border:0;
          padding:0;
          width:0;
        }

        &:last-child{
          margin-right: 0;
        }
      }
    }
  }
</style>

<script>
import moment from 'moment'
import DatePicker from 'libs/datePicker'
import check from 'libs/check/m'
import selectControl from 'libs/selectControl'
import R from 'ramda'

export default {
  props: {
    api: {
      type: String,
      required: true
    },

    source: {
      type: Array,
      required: true
    }
  },
  data() {
    const limitDate = moment().add(3, 'days')
    const sexList = ['男', '女']
    const carSerial = ['英致727', '英致737', '英致G3', '英致G5']
    const provinceList = R.map(item => item.name)(this.source)

    return {
      carSerial,
      sexList,
      provinceList,
      cityList: [],
      countyList: [],
      dealerList: [],

      date: {
        year: limitDate.year(),
        month: limitDate.month()+1,
        date: limitDate.date()
      },

      params: {
        UserName: '',
        Sex: sexList[0],
        Telephone: '',
        CarSerial: carSerial[0],
        Province: '',
        City: '',
        County: '',
        Dealer: ''
      }
    }
  },

  watch:{
    'params.Province' : function(){
      this.cityList = this.getCitys(this.params.Province, true)
      this.params.City = this.cityList[0]
    },
    'params.City' : function(){
      this.countyList = this.getCountys(this.params.City, true)
      this.params.County = this.countyList[0]
    },
    'params.County' : function(){
      this.dealerList = this.getDealers(this.params.County, true)
      this.params.Dealer = this.dealerList[0]
    },
    'params.Telephone': function(value){
      if(/[^\d]/.test(value)){
        this.$nextTick(() => this.params.Telephone = this.params.Telephone.replace(/[^\d]/g,''))
      }
    },
    'params.UserName': function(value){
      if(value.length > 10){
        this.$nextTick(() => this.params.UserName = this.params.UserName.slice(0,10))
      }
    }
  },

  computed:{
    BookDate(){
      if(this.date.year && this.date.month && this.date.date){
        return `${this.date.year}-${this.date.month < 10 ? '0' + this.date.month : this.date.month}-${this.date.date < 10 ? '0' + this.date.date : this.date.date}`
      }
      return ''
    }
  },

  methods: {
    submit(){
      if(!dev){
        if(!/^[\u4e00-\u9fa5]{2,10}$/.test(this.params.UserName)){
          tools.showAlert('请填写正确的姓名')
          return false
        }
        if(!check.isPhoneNumber(this.params.Telephone)){
          tools.showAlert('请填写正确的手机号')
          return false
        }
      }
      this.$http.post(this.api, Object.assign({}, this.params, {BookDate: this.BookDate})).then(response => response.json().then(res => {
        if(res.Result){
          tools.showAlert('预约试驾成功!')
        }else{
          tools.showAlert(res.Message)
        }
      }))
    },

    getCitys(province, flat=false){
      const citys = R.pipe(R.find(R.propEq('name', province)), R.prop('citys'), R.map(item => flat? item.name : item))
      return citys(this.source)
    },

    getCountys(city, flat=false){
      const citys = this.getCitys(this.params.Province)
      const countys = R.pipe(R.find(R.propEq('name', city)), R.prop('district'), R.map(item => flat? item.name : item))
      return countys(citys)
    },

    getDealers(county, flat=false){
      const countys = this.getCountys(this.params.City)
      const dealers = R.pipe(R.find(R.propEq('name', county)), R.prop('sellers'), R.map(item => flat? item.name : item))
      return dealers(countys)
    }
  },

  ready(){
    new DatePicker({
      'trigger': '#datepicker',
      'type': 'date', 
      'minDate': this.BookDate,
      CallBacks: obj => {
        this.date.year = obj.year
        this.date.month = +obj.month
        this.date.date = +obj.day
      }
    })

    $('.form-selector').selectControl({CallBacks: obj => {
      const rel = $(obj.item).attr('rel')
      this.params[rel] = obj.id
    }})

    this.params.Province = this.provinceList[0]
    
  }
}
</script>