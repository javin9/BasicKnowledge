<template>
  <div class="component-rule" @click="modal=true"><span>活动规则</span><em></em></div>
  <div class="component-rule-modal" v-show="modal" transition="opacity" >
    <h3>活动说明</h3>
    <article>
      <h6>活动时间：6.1-6.30</h6>
      <h6>活动玩法</h6>
      <ul>
        <li>用户参与本次6月购车节活动，仅限于新车贷款下单后，即享首付直减的优惠活动，最高可达6000元。下单后如分享本次活动获得好友助力支持的用户，可获得更多优惠。</li>
        <li>活动期间加油助力人数越多，优惠力度越大（详见奖品说明）。如获得66人加油，可在活动期间每日上午9:00-11:00通过自己的分享页面抢最高优惠“免息券”，免息券名额有限，先到先得。</li>
        <li>活动期间主动分享活动页面的老用户，以及通过该分享页面成功贷款的新用户，双方均可获得1000元京东E卡。
          <p>如何激活：老用户需要新用户成功贷款首次还款后可激活使用（激活后会正常显示账号和密码）；</p>
          <table>
            <tr>
              <th width="30%"></th>
              <th colspan="2">激活条件</th>
            </tr>
            <tr>
              <td>老用户</td>
              <td class="left">①新用户成功贷款并完成放款</td>
              <td class="left">②在第①条件满足后，完成自身贷款订单的下一次还款操作</td>
            </tr>
            <tr>
              <td>新用户</td>
              <td colspan="2">成功贷款并完成放款</td>
            </tr>
          </table>
        </li>
        <li>助力加油的好友在整个活动期间只能帮助<em>同一用户加油</em>一次。</li>
        <li><strong>优惠叠加规则：</strong>
          <ul>
            <li>购车节优惠除了基础优惠外，其他均为递进关系，优惠不能相互叠加；</li>
            <li>免息券与购车节其他优惠、日常优惠不可叠加使用</li>
            <li>用户通过分享活动“邀请”好友成功贷款得到的京东E卡（同享卡），可与免息券叠加使用；如果用户是“被邀请”得到的京东E卡（优惠卡），则不能与任何梯度优惠叠加使用；被邀请用户将活动继续分享给其他好友且好友成功贷款，会得到新的京东E卡（同享卡），该京东E卡（同享卡）可与所有优惠叠加使用。</li>
            <li>日常优惠只能和购车节基础优惠以及同享卡叠加使用。</li>
          </ul>
        </li>
        <li><strong>金融产品参加规则：</strong>
          <ul>
            <li>购车节基础优惠：易鑫集团自营产品中的一证贷、两证通减首付产品参加；LCV、新能源车型不参加</li>
            <li>购车节进阶、升级优惠：易鑫集团自营所有产品</li>
            <li>购车节最高免息优惠：易鑫集团自营产品中的一证贷产品参加；LCV、新能源车型不参加</li>
          </ul>
        </li>
        <li>京东E卡、免息券查看路径:登陆m.daikuan.com-个人中心-我的卡券。</li>
      </ul>
      <h6>奖品说明</h6>
      <table>
        <tr>
          <th colspan="2" width="20%">优惠奖品</th>
          <th width="30%">优惠内容</th>
          <th width="15%">优惠数量</th>
          <th>完成条件</th>
        </tr>
        <tr>
          <td rowspan="4" width="6%">购车节优惠</td>
          <td>最高</td>
          <td>贷款购车免息</td>
          <td>200名</td>
          <td class="left">活动期间获得66人支持后，限定时间内领取到免息券（免息券使用规则见活动玩法中说明）</td>
        </tr>
        <tr>
          <td>升级</td>
          <td>赠送1000元京东E卡</td>
          <td>不限</td>
          <td>活动期间获得18人支持</td>
        </tr>
        <tr>
          <td>进阶</td>
          <td>赠送500元京东E卡</td>
          <td>不限</td>
          <td>活动期间获得6人支持</td>
        </tr>
        <tr>
          <td>基础</td>
          <td>下单即享首付最高立减6000元</td>
          <td>不限</td>
          <td>活动期间下单可得</td>
        </tr>
        <tr>
          <td colspan="2">分享优惠</td>
          <td>参与分享活动可另外获得1000元京东卡</td>
          <td>不限</td>
          <td>活动期间通过主动分享活动页面的老用户，以及通过分享页面成功贷款的新用户（此券可与立减优惠叠加使用）</td>
        </tr>
        <tr>
          <td colspan="2">日常优惠</td>
          <td>赠送500元京东E卡</td>
          <td>不限</td>
          <td>通过“小鑫帮您贷”下单即可领取</td>
        </tr>
      </table>
      <h6>备注</h6>
      <ul>
        <li>免息券仅适用于贷款额度2-9万，首付比例20%起，贷款额度9-12万，首付比例30%起，贷款期限12-36期的易鑫集团一证贷产品。</li>
        <li>基础优惠根据贷款额度不同，相应的首付优惠金额也不同，具体优惠额度请参考下方明细：
          <table>
            <tr>
              <th width="50%">贷款额度</th>
              <th>优惠额度</th>
            </tr>
            <tr>
              <td>20000~50000</td>
              <td>1000</td>
            </tr>
            <tr>
              <td>50001~70000</td>
              <td>2500</td>
            </tr>
            <tr>
              <td>70001~90000</td>
              <td>3500</td>
            </tr>
            <tr>
              <td>90001~120000</td>
              <td>4500</td>
            </tr>
            <tr>
              <td>120001~200000</td>
              <td>6000</td>
            </tr>
          </table>
        </li>
      </ul>
    </article>
    <a href="javascript:void(0)" class="component-rule-modal-close" @click="modal=false"></a>
  </div>
  <mask @click="modal=false" :touchmove="true"></mask>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-rule{
    @include fsize(24);
    line-height: px2rem(38);
    padding:0 px2rem(14) 0 px2rem(30);
    position: absolute;
    right:0;
    color:#f84671;
    border-radius:px2rem(40) 0 0 px2rem(40);
    background: #ffd9c1 ;

    span{
      display: inline-block;
      vertical-align: middle;
    }

    em{
      display: inline-block;
      vertical-align: middle;
      width: px2rem(10);
      height: px2rem(20);
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAUCAYAAAC07qxWAAAAlElEQVQoz2P47ZTPB8SpDIQAUJEsEP8H4nnEKC6CKs4gRvE8qGJLYhRfgCoWI6SQGYh/AvE3YkxVgJp6mhjFtqSERC5UcRYxipuhigOJjYyZ+BTxQhVdBWJ2fArvQRXy4lO0AapIH5+iHqiiMHyKEqGKGvApsoQqWoJPkTBU0WV8ikSB+C0Q/wNiVnwKG6GmqeILfAB9DomutiaGlAAAAABJRU5ErkJggg==) no-repeat right center;
      background-size: contain;
      margin-left: px2rem(10);
    }
  }

  .component-rule-modal{
    background: #fff;
    position: fixed;
    left: 50%;
    top:50%;    
    transform:translateX(-50%) translateY(-50%);
    z-index: 10000;
    width: px2rem(640);
    border-radius:px2rem(10);
    padding:0 px2rem(20);

    &-close{
      @include size(px2rem(80));
      position: absolute;
      background: url(./del.png) no-repeat left top;
      right:px2rem(20);
      top:px2rem(-40);
      background-size: contain;
    }

    h3{
      @include borderBottom;
      @include fsize(32);
      text-align: center;
      color:$dark-color;
      font-weight: normal;
      line-height: px2rem(84);
    }

    article{
      @include fsize(24);
      color:#444;
      padding:0 px2rem(23) px2rem(40);
      line-height: $main-line-height;
      height:px2rem(800);
      overflow-y: scroll;

      h6{
        @include fsize(26);
        margin:px2rem(15) 0;
        color:$dark-color;
      }

      > ul{
        padding-left: px2rem(30);
        li{
          list-style-type: decimal;
          margin-bottom: px2rem(10);

          em{
            color:$main-color;
          }

          > ul{
            padding-left: px2rem(26);
            li{
              list-style-type: disc;
            }
          }
        }
      }

      p{
        @include fsize(24);
        font-weight: bold;
        color:$dark-color;
        padding-top: px2rem(20);
      }

      strong{
        font-weight: bold;
      }

      table{
        width: 100%;
        margin:px2rem(20) 0;
        td,th{
          @include border($dark-color);
          text-align: center;

          &.left{
            text-align: left;
            padding:0 px2rem(5);
          }
        }
      }
    }
  }
</style>

<script>
import mask from 'libs/mask'
export default {
  props:[],
  data () {
    return {
      modal: false
    }
  },

  watch: {
    modal(value){
      if(value){
        this.$broadcast('showMask')
      }else{
        this.$broadcast('hideMask')
      }
    }
  },

  components: {
    mask
	}
}
</script>