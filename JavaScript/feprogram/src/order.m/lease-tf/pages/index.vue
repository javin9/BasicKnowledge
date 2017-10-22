<template>
	<header>
		<h1></h1>
	</header>

	<section class="banner" v-if="banner">
		<img :src="banner" />
	</section>

	<section class="intro">
    <ul>
      <li>首付10%起灵活掌控</li>
      <li>在线审批快速贷</li>
      <li>先开后买可换可退</li>
      <li>提供牌照省心省力</li>
    </ul>
  </section>

  <section class="form">
  	<ul>
      <li class="form-item">
        <b class="icon-car"></b>
        <label>心仪车型</label>
        <p @click="changeCar">
        	<span v-if="carId">{{carName}}</span>
        	<em v-else>请选择车型</em>
        	<i></i>
        </p>
      </li>

      <li class="form-item">
        <b class="icon-city"></b>
        <label>购车城市</label>
        <p @click="changeCity" :class="{'not-support':!supportCity}">
          <span v-if="cityId">{{cityName}}</span>
          <span v-else>请选择城市</span>
          <strong v-if="!supportCity">暂不支持该城市,请切换</strong>
          <i></i>
        </p>
      </li>
  	</ul>

  	<mobile-verify 
  		button-text="立即开走"
  		:show-icons="true" 
  		:authcode-length="4" 
  		:disabled="disabled" 
  		@submit="submit"
  	></mobile-verify>
  </section>

  <car-selector 
    :level="3" 
    :only-on-sale="false" 
    :show-search="false" 
    :show-hot-series="false" 
    :show-recommend-brand="false"
    :interface-brand="interfaceBrand"
    :interface-series="interfaceSeries"
    :interface-car="interfaceCar"
    @callback="selectCarCallback"
  ></car-selector>
</template>

<style>
	@import 'sassHelper/vars';
	@import 'sassHelper/mixin';

	body{
		background: #f8f8f8;
	}

	header{
		background: #fff;
		height: px2rem(88);
		line-height: px2rem(88);
		display:flex;
		align-items: center;

		>a{
			background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAQAAACP8FaaAAABNUlEQVQoz2NgwAH+M3pP9b7jk4hLnsF7hvc/7//eN3FI+/YDJf97//OZgFXapw0s/d9n0X9GbNI1EGnvVaHM2KSLoLo3pbFic1omVHpnLjs2pyWAXf7f50AoJzbdET5/wdLHQ3mw6fb3/g2WPhcggEXaz8PnJ1j6SqAwNpc7+HwDO+5mqAQWaX8rn89g3feCZLDZ7eb9Faz7sa8i9mC9CNb9JlANR7T4nAPrf++tgyve7L2/gJU8x2mGt7H3B4grAhRwKPG3gpjic89HGocSP0fv72AlN/zEcbnFExKW3pewhiXYP4GQ2PA+E8qPy5RISHx6H8Uan2AfJUFShPc+rCkCbFEONEVuD2XDpaQUmuzWN7DgUlIPNWVZAxMuJZ1QU2bhzHo+k8FK7jLgzry+U31u+SYDAPLwqqdTETz1AAAAAElFTkSuQmCC') no-repeat center center;
			background-size:  px2rem(16) px2rem(30);
			width: px2rem(76);
			height: 100%;
		}

		h1{
			flex:1;
			text-align: center;
			background: url(./title.png) no-repeat center center;
			background-size: px2rem(185) px2rem(52);
			display: block;
			height: 100%;
		}
	}

	.banner{
		background: #fff;
		img{
			display: block;
      width: 100%;
		}
	}

	.intro {
    position: relative;
    margin-bottom: px2rem(20);
    padding: px2rem(40) 0;
    overflow: hidden;
    background: #FFFFFF;

    &:after {
        content: '';
        position: absolute;
        left: 50%;
        top: px2rem(45);
        bottom: px2rem(45);
        width: 1px;
        background: #e5e5e5;
        -webkit-transform: translate(-50%, 0);
        transform: translate(-50%, 0);
    }

    ul {
      li {
        box-sizing: border-box;
        position: relative;
        float: left;
        width: 50%;
        padding-left: px2rem(114);
        @include fsize(26);
        line-height: px2rem(46);
        color: #394043;

        &:nth-child(n+3) {
            margin-top: px2rem(37);
        }

        &:before {
          content: '';
          position: absolute;
          left: px2rem(50);
          top: 50%;
          width: px2rem(40);
          height: px2rem(40);
          -webkit-transform: translate(0, -50%);
          transform: translate(0, -50%);
          background-repeat: no-repeat;
          background-position: center center;
          background-size: contain;
        }

        &:nth-child(1):before {
            background-image: url(icon-1.png);
        }

        &:nth-child(2):before {
            background-image: url(icon-2.png);
        }

        &:nth-child(3):before {
            background-image: url(icon-3.png);
        }

        &:nth-child(4):before {
          background-image: url(icon-4.png);
        }
      }
    }
	}

	.form{
		background: #fff;
	}

	.form-item{
		@include borderBottom();
    background: #fff;
    margin:0 px2rem(30);
    display: flex;
    align-items: center;
    height: px2rem(100);
    position: relative;

    b{
      @include size(px2rem(36));
      display: block;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      margin-right: px2rem(16);

      &.icon-city{
      	@include icons(location, false);
      }

      &.icon-car{
        @include icons(car, false);
      }
    }

    label{
      @include fsize(32);
      color:$dark-color;
      display: block;
      width: px2rem(130);
      box-sizing:border-box;
    }

    p{
      @include fsize(32);
      display: flex;
      flex:1;
      border:0;
      padding:0;
      width:0;
      align-items: center;
      white-space: nowrap;
      overflow:hidden;
      text-overflow: ellipsis;

      &.not-support{
        strong{
          flex:1;
          font-size:px2rem(24);
        }

        span{
          flex:initial;
          width:auto;
          max-width: px2rem(200);
          margin-right: px2rem(20);
        }
      }

      span,em,i,strong{
      	display:block;
      }

      em,span{
      	flex:1;
      }

      span{
      	width: 0;
      	overflow: hidden;
      	text-overflow: ellipsis;
      }

      strong{
      	color:$main-color;
      }

      i{
      	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAUCAQAAAAT+RSaAAAAzUlEQVQYGWXBMS9DYRiG4fdIalGrGbtBdwtmk4HVZmSy+QEdbE3u5yuS6nQmsUgjjb0WP8AqmCRnoQl9jE6/c13BnSbXq9GkMdYrG5G7XNYY6zNtRa5cpMT60l7kvEAP60dH0ZTOMeYsmjjmF3PhInJpn2+sIa3IpW1VmPvBUuTo8IH1GLmrdV4wzzGPjt4xT4OVqNOuKsyobEddOtQUc0Mr6nSqGVbXRfxzoS7WjJOoo6Uh1lQHUVe2GWFV/Z2YpwfMW38zcrrVJK1Fwx++tXCARQG0twAAAABJRU5ErkJggg==) no-repeat center center;
      	width: px2rem(12);
      	height: px2rem(20);
      	background-size: contain;
      }

      em{
      	color:#d0d0d0;
      }
    }
	}

  li > label{
    width: px2rem(174) !important;
  }
</style>

<script>
	import MobileVerify from 'libs/vue-components/mobile-verify'
	import citySelector from 'libs/citySelect'
	// import carSelector from 'libs/carSelect'
  import CarSelector from 'libs/vue-components/car-selector'

	export default {
		props: {
			banner: {
				type: String,
				default: ''
			},
      from:{
        type: String,
        default: ''
      },
      channel:{
        type: String,
        default: ''
      },
      source:{
        type: String,
        default: ''
      },
			cityName: {
				type: String,
				default: ''
			},
			cityId: {
				type: Number,
				default: 0
			},
			api: {
				type: String,
				required: true
			},
      interfaceCity: {
        type: String,
        required: true
      },
      interfaceValidate: {
        type: String,
        required: true
      },
      interfaceBrand: {
        type: String,
        required: true
      },
      interfaceSeries: {
        type: String,
        required: true
      },
      interfaceCar: {
        type: String,
        required: true
      }
		},

	  data () {
	    return {
	    	submiting: false,
	    	carId: '',
        carPrice: '',
	    	carName: '',
        packageId: '',
        supportCity: true,
        validateCode: '',
        mobile: '',
        orders: ''
	    }
	  },

	  computed:{
	  	disabled(){
	  		return this.submiting || !this.carId || !this.cityId || !this.supportCity
	  	},

      cityOptions(){
        return {
          ...window.city,
          NoHotCity: true,
          loadCityUrl: `${this.interfaceCity}?packageId=${this.packageId}&carId=${this.carId}`,
          dataType: 'json'
        }
      }
	  },

	  methods: {
      selectCarCallback(data){
       this.carId = data.car.id
       this.carName = data.brand.name + ' ' + data.series.name + ' ' + data.car.name
       this.validateCity()
      },

	  	goBack(){
	  		window.history.go(-1)
	  	},

      /**
       * 选车型后校验城市是否支持该车型，并取得packageId
       */
      validateCity(){
        this.$http.get(this.interfaceValidate, {params: {carId: this.carId, cityId: this.cityId}}).then(response => response.json()).then(res => {
          if(res.Result){
            this.supportCity = res.Data.Matchable
            this.packageId = res.Data.LoanPackageId
            this.carPrice = res.Data.CarPrice
            this.orders = `${res.Data.LoanPackageId}_${res.Data.ProductId}_0`
          }else{
            toole.showAlert(res.Message)
          }
        })
      },

	  	changeCity(){
	  		citySelector.citySelect(this.cityOptions, data => {
	  			this.cityId = data.CityId
	  			this.cityName = data.CityName
          this.supportCity = true
	  		})
	  	},

	  	changeCar(){
        this.$broadcast('showCarSelector')
	  	},

	  	submit(data){
	  		if(this.disabled || !data){
	  			return false
	  		}

	  		this.submiting = true
        this.validateCode = data.authcode
        this.mobile = data.mobile

        this.signin()
	  	},

      signin(){
        const params = {
          code: this.validateCode, 
          Telephone: this.mobile, 
          line: 550,
          CarId: this.carId,
          CityId: this.cityId,
          Orders: this.orders,
          Source: this.source,
          Channel: this.channel,
          From: this.from
        }
        
        this.$http.post(this.api, params).then(response => response.json()).then(res => {
          this.submiting = false
          if(res.Result){
            if(dev){
              console.log('提交表单')
            }else{
              window.location.href = res.Data.RedirectUrl
            }
          }else{
            tools.showAlert(res.Message)
          }
        })
      }
	  },

	  components: {
	  	MobileVerify,
      CarSelector
	  }
	}
</script>