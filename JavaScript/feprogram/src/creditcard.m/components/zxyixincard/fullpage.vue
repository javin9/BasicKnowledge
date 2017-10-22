<template>
  <div id="dowebok" class="component-fullpage">
      <div class="component-fullpage-one section">
        <div class="component-fullpage-one-logo"></div>
        <div class="component-fullpage-one-header"></div>

        <div class="component-fullpage-one-container">
          <h3>{{carBannerName}}</h3>
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div class="swiper-img img01"></div>
              </div>
              <div class="swiper-slide">
                <div class="swiper-img img02"></div>
              </div>
              <div class="swiper-slide">
                <div class="swiper-img img03"></div>
              </div>
              <div class="swiper-slide">
                <div class="swiper-img img04"></div>
              </div>
            </div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
            <div class="swiper-pagination"></div>
          </div>
          <a :href="cardBannerUrl"></a>
        </div>
      </div>

      <!-- 新加第二屏开始 -->
      <div class="component-fullpage-four section">
        <header>
          <p>活动专区</p>
        </header>
        <div class="second-content">
          <span @click="showPopup(7)">活动细则 ></span>
          <span @click="showPopup(8)">活动细则 ></span>
        </div>
      </div>
      <!-- 新加第二屏结束 -->

      <div class="component-fullpage-two section">
        <header>
          一站式服务
          <span @click="showPopup(0)">基础服务 ></span>
        </header>
        <dl>
          <dd v-for="(index, service) in serviceDatas">
            <label v-if='index===0'></label>
            <h3>{{service.title}}</h3>
            <p v-if="service.subtitle">{{service.subtitle}}</p>
            <div>{{service.describe}}</div>
            <a :href="service.rightsUrl">领取权益</a>
            <span @click="showPopup(index+1)">权益明细 ></span>
          </dd>
        </dl>
      </div>
      <div class="component-fullpage-three section">
        <header>开卡有礼<p>兑换领取，先到先得</p></header>
        <div class="component-fullpage-three-info">
          <p>中信易鑫卡客户，在卡片批核后60天内（自然日），</p>
          <p>满足3笔399计积分交易。</p>
          <ul>
            <li>金卡赠送6次免费洗车服务，</li>
            <li>精英白金卡赠送12次免费洗车服务，</li>
            <li>尊贵白金卡赠送24次免费洗车服务。</li>
          </ul>
        </div>
        <dl>
          <dd v-for="gift in giftsDatas">
            <div>
              <h3>{{gift.carName}}</h3>
              <div class="car-img"></div>
              <a :href="gift.carDetailUrl">立即办卡</a>
            </div>
          </dd>
        </dl>
      </div>
  </div>

  <Popup
    :showpopup="isShowPopup"
  ></Popup>
</template>

<style scoped>
  @import './_fullpage.scss'
</style>

<script>
  import 'libs/fullPage'
  import Popup from './popup.vue'
  import swiper from 'libs/swiper'

  export default {
    data () {
      // 在易鑫app中
      const isInYixinApp = tools.isWebView() === 'yixinapp'
      // 来源自淘车来了
      const fromTaocheCome = /MicroMessenger/.test(window.navigator.userAgent) && +tools.getUrlParam('from') === 6981

      const cardBaseLink = 'https://creditcard.ecitic.com/citiccard/cardshop-h5/wap/initCardInfo.do'

      const sid = fromTaocheCome ? 'SJTCW' : isInYixinApp ? 'SJYXCD1' : 'SJYXCD'

      // 金卡链接
      const goldLink = `${cardBaseLink}?sid=${sid}&pid=CS0233`

      // 白金链接
      const platinaLink = `${cardBaseLink}?sid=${sid}&pid=CS0231`

      return {
        serviceDatas: [//第二屏数据
          {
            'title':'专享租车',
            'subtitle':'首付万元',
            'describe':'月供低至666元',
            'rightsUrl':'http://m.daikuan.com/activity/zxcobrandcard',
          },
          {
            'title':'投保有礼',
            'subtitle':'商业险保费',
            'describe':'最低低至4折',
            'rightsUrl':'http://baoxian.m.daikuan.com/?yxms=WMH0043',
          },
          {
            'title':'加油返现',
            'subtitle':'',
            'describe':'最高奖励150元',
            'rightsUrl':'http://dwz.cn/64W5oG',
          },
          {
            'title':'0元洗车',
            'subtitle':'',
            'describe':'最高24次0元洗车',
            'rightsUrl':'http://dwz.cn/64W5oG',
          },
          {
            'title':'0元帮买',
            'subtitle':'',
            'describe':'二手车0元帮买服务',
            'rightsUrl':'http://zt.taoche.com/zt/20170626/',
          },
          {
            'title':'延保5折',
            'subtitle':'',
            'describe':'延保套餐5折优惠',
            'rightsUrl':'http://zt.taoche.com/zt/20170627/',
          }
        ],
        giftsDatas: [//第三屏数据
          {
            'carName':'金卡（青春版）',
            'carDetailUrl':goldLink
          },
          {
            'carName':'白金卡（青春版）',
            'carDetailUrl':platinaLink
          },
          {
            'carName':'金卡（经典版）',
            'carDetailUrl':goldLink
          },
          {
            'carName':'白金卡（经典版）',
            'carDetailUrl':platinaLink
          }
        ],
        isShowPopup: false,
        popupIndex: 0,
        carBannerInfos: [//首屏轮播图
          {
            'carName':'金卡（经典版）',
            'carDetailUrl':goldLink
          },
          {
            'carName':'白金卡（经典版）',
            'carDetailUrl':platinaLink
          },
          {
            'carName':'金卡（青春版）',
            'carDetailUrl':goldLink
          },
          {
            'carName':'白金卡（青春版）',
            'carDetailUrl':platinaLink
          }
        ],
        carBannerName: '金卡（经典版）',
        cardBannerUrl: goldLink
      }
    },
    ready(){
      $('#dowebok').fullpage();

      var mySwiper = new Swiper('.swiper-container',{
        autoplay: 3000,
        loop: true,
        pagination: '.swiper-pagination',
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next',
        autoplayDisableOnInteraction: false,
        observer: true,
        observeParents: true,
        onSlideChangeEnd: (swiper) => {
          let activeIndex = swiper.activeIndex,
              infoLength = this.carBannerInfos.length,
              index = 0;
          if(activeIndex === infoLength+1){
            index = 1
          }else if(activeIndex === 0){
            index = infoLength
          }else {
            index = activeIndex
          }
          
          let carBannerInfo = this.carBannerInfos[index-1];
          this.carBannerName = carBannerInfo.carName
          this.cardBannerUrl = carBannerInfo.carDetailUrl
        }
      })
    },
    methods: {
      showPopup (index) {
        this.isShowPopup = true;
        this.$broadcast('showPopupFunc', index);
      }
    },
    components: {
        Popup,
    }
  }
</script>