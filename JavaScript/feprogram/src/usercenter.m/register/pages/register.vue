<template>
  <component-header title="新用户注册" :hide-back="true"></component-header>
  <div v-show="showForm">
    <mobile-verify 
    :disabled="submiting" 
    :encryption="true"    
    :show-slide-verify="true"
    :get-slide-verify-api="getSlideVerifyApi"
    :check-slide-verify-api="checkSlideVerifyApi"
    :business-id="businessId" @submit="submit"></mobile-verify>
    <p class="term-link">注册即视为同意<a href="javascript:void(0)" @click="showTerm">《网络服务条款》</a>内容条款</p>
  </div>

  <success-box v-if="showSuccessBox" :tel="registerTel"></success-box>
  <fail-box v-if="showFailBox" :portrait="user.portrait" :name="user.name" :tel="user.tel"></fail-box>
</template>

<style>
  body{
    background: #fff;
  }
</style>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .term-link{
    @include fsize(24);
    color:$normal-color;
    padding: px2rem(20) px2rem(30);

    a{
      color:#5fc3e8;
    }
  }
</style>

<script>
  import ComponentHeader from 'libs/header'
  import MobileVerify from 'libs/vue-components/mobile-verify'
  import SuccessBox from '../components/success-box'
  import FailBox from '../components/fail-box'

  export default {
    props: {
    },

    data () {
      return {
        submiting: false,
        status: '',
        user: {},
        registerTel: '',
            getSlideVerifyApi:getSlideVerifyApi,
        checkSlideVerifyApi:CheckSign,
        businessId:businessid
      }
    },

    computed:{
      showForm(){
        return this.status === ''
      },
      showSuccessBox(){
        return this.status === 'success'
      },
      showFailBox(){
        return this.status === 'fail'
      }
    },
  
    methods: {
      showTerm(){
        tools.serviceProvision({
          txt: ' <div class="tit_box">易鑫车贷服务条款与隐私政策</div><div class="list_p"><p>本网站（网址：www.daikuan.com）由北京易鑫信息科技有限公司及其关联实体（以下简称“易鑫”）运营，易鑫依照以下服务条款向您提供相关服务。请您使用本服务条款涉及的服务前,仔细阅读。您只有完全同意所有服务条款，才能成为易鑫的用户（以下简称"用户"）并使用相应服务。您在申请使用服务过程中点击"同意服务条款"按钮，即表示您已明确同意和遵守本服务条款以及经参引而并入其中的所有条款、政策以及指南，并受其约束。易鑫会根据法律法规的要求或业务运营的需要，对本服务条款不时地进行修改。除非另有规定，否则任何变更或修改的内容将于本网站发布之时立即生效，您对本网站服务的使用、继续使用将表明您接受此等变更或修改。如果您不同意本服务条款（包括易鑫不定时对其或其中引述的其他规则所进行的任何修改）的全部规定，则请您停止使用服务，或主动取消服务。</p><p>为了便于您更好地了解服务的内容和使用服务的条件，易鑫将在本网站上发布易鑫对本服务条款的修改，您应不时地审阅本服务条款。</p></div><div class="list_p"><p class="tit2"><strong>一、服务内容</strong></p><p>   1.1服务的具体内容由易鑫根据实际情况提供，包括但不限于信息、图片、文章、评论、积分抽奖活动等，易鑫将定期或不定期根据用户的意愿，以电子邮件、短信、电话等方式为用户提供信息，并向用户提供学习、交流平台（以上统称“服务”）。</p><p>1.2服务仅供个人用户使用。非经易鑫书面同意，您或其他用户均不得将服务的任何信息用于商业及其他一切经济目的。</p><p>1.3您使用服务时所需的相关的设备以及网络资源等（如个人电脑及其他与接入互联网或移动网有关的装置）及所需的费用（如为接入互联网而支付的电话费及上网费）均由您自行负担。</p><p></p>            </div>            <div class="list_p"><p class="tit2"><strong>二、信息提供和隐私保护</strong></p><p>2.1您在访问、使用本网站或申请使用服务时，必须提供本人真实的个人信息，且您应该根据实际变动情况及时更新和完善个人信息，以便于您更好地接受易鑫提供的服务。同时，保护用户隐私也是易鑫的重要原则，易鑫会通过各种技术手段和强化内部管理等办法提供隐私保护服务功能，充分保护您的个人信息安全。</p><p>2.2本网站不负责审核您提供的个人信息的真实性、准确性或完整性，因信息不真实、不准确或不完整而引起的任何问题及其后果，由您自行承担，且您应保证本网站免受由此而产生的任何损害或责任。若易鑫发现您提供的个人信息是虚假、不准确或不完整的，易鑫有权自行决定终止向您提供服务。</p><p>2.3您理解，为申请获得服务，您应向易鑫提供您的个人信息。您基于需要易鑫提供更优质服务和产品的目的，授权易鑫会在定期或不定期以电子邮件、短信、电话等方式为您提供服务。为了服务的精准性，易鑫会在提供服务的同时询问您有关婚姻状况、真实年龄、是否持有居住证以及征信情况等问题；为向您提供服务之目的，易鑫须向有必要的第三方透露您的个人信息。您特此向易鑫授权，为向您提供服务之目的，易鑫有权使用您的个人信息、您申请服务时提供相关信息和（或）您在使用服务时储存在本网站的非公开内容（以下简称“个人资料”）。易鑫保证在除为向您提供服务之目的外，不对外公开或向其他非必要第三方提供您的个人资料，但下列情况除外：</p><p>2.3.1事先获得您的明确授权；</p><p>2.3.2按照相关司法机构或政府主管部门的要求；</p><p>2.3.3为维护本网站合法权益之目的；</p><p>2.3.4为维护社会公共利益；</p><p>2.3.5为了配合政府或法律的合法要求、传票或指令等，为了保护本网站的系统和用户，或者为了确保服务和系统的完整与操作，易鑫可获取和披露其认为必要或恰当的任何信息，包括但不限于用户的个人信息、IP地址和流量信息、使用历史以及发布内容；</p><p>2.3.6法律法规或服务要求的其他合法情形。</p>            </div>            <div class="list_p"><p class="tit2"><strong>三、使用准则</strong></p><p>3.1您在使用车贷服务过程中，必须遵循国家的相关法律法规，不通过车贷发布、复制、上传、散播、分发、存储、创建或以其它方式公开含有以下内容的信息：</p><p>    3.1您在使用服务过程中，必须遵循国家的相关法律法规，符合易鑫关于使用服务相关的合法合理要求，不通过本网站或服务发布、复制、上传、散播、分发、存储、创建或以其它方式公开含有以下内容的信息：</p><p>    3.1.1违反宪法所确定的基本原则的；</p><p>    3.1.2危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p><p>    3.1.3损害国家荣誉和利益的；</p><p>    3.1.4煽动民族仇恨、民族歧视，破坏民族团结的；</p><p>    3.1.5破坏国家宗教政策，宣扬邪教和封建迷信的；</p><p>    3.1.6散布谣言，扰乱社会秩序，破坏社会稳定的；</p><p>    3.1.7散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的、欺诈性的或其它令人反感的数据、信息、文本、音乐、声音、照片、图形、代码或其它材料；</p><p>    3.1.8侮辱或者诽谤他人，侵害他人合法权益的；</p><p>    3.1.9可能侵犯他人的专利、商标、商业秘密、版权或其它知识产权或专有权利的内容；</p><p>    3.1.10假冒任何人或实体或以其它方式歪曲您与任何人或实体之关联性的内容；</p><p>    3.1.11未经易鑫同意而擅自提供的促销信息、政治活动、广告或意见征集；</p><p>    3.1.12任何第三方的私人信息，包括但不限于地址、电话号码、电子邮件地址、身份证号以及信用卡卡号；</p><p>    3.1.13病毒、不可靠数据或其他有害的、破坏性的或危害性的文件；</p><p>    3.1.14与内容所在的互动区域的话题不相关的内容；</p><p>    3.1.15依易鑫的自行判断，足以令人反感的内容，或者限制或妨碍他人使用或享受互动区域或车贷服务的内容，或者可能使易鑫或易鑫关联方或其他用户遭致任何类型损害或责任的内容；</p><p>    3.1.16其他法律法规或规章制度禁止的或不符合易鑫要求的内容。</p><p>3.2用户不得利用车贷的服务从事下列危害计算机信息网络安全的活动：</p><p>    3.2.1未经允许，进入计算机信息网络或者使用计算机信息网络资源；</p><p>    3.2.2未经允许，对计算机信息网络功能进行删除、修改或者增加；</p><p>    3.2.3未经允许，对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加；</p><p>    3.2.4故意制作、传播计算机病毒等破坏性程序；</p><p>    3.2.5其他危害计算机信息网络安全的行为。</p><p>        3.3易鑫保留在任何时候为任何理由而不经通知地过滤、移除、筛查或编辑本本网站上发布或存储的任何内容的权利，您须自行负责备份和替换在本本网站发布或存储的任何内容，成本和费用自理。</p><p>3.4您须对自己在使用服务过程中的行为承担法律责任。</p><p>3.5如您的操作影响系统总体稳定性或完整性，易鑫将暂停或终止您的操作，直到相关问题得到解决。</p><p></p>            </div>            <div class="list_p"><p class="tit2"><strong>四、免责声明</strong></p><p>4.1本网站是一个开放平台，用户将文章或照片等个人资料上传到互联网上，有可能会被其他组织或个人复制、转载、擅改或做其它非法用途，用户必须充分意识此类风险的存在。您明确同意使用本网站及服务所存在的风险或产生的一切后果将完全由您自身承担，易鑫对上述风险或后果不承担任何责任。</p><p>    4.2作为网络服务的提供者，易鑫对用户在本网站上的任何论坛、个人主页或其它互动区域做出的任何陈述、声明或内容不承担任何责任。如您的前述行为违反本服务条款、违反道德或法律的，侵犯他人权利（包括但不限于知识产权）的，易鑫不知道您的侵权行为或未接到被侵权人通知的；或者明知您的侵权行为或经被侵权人通知后，并采取删除、屏蔽、断开链接等相关必要措施的，易鑫对您的侵权行为不承担任何责任。同时，易鑫对任何第三方通过本网站发送服务或包含在服务中的任何内容不承担责任。</p><p>    4.3对您、其他用户或任何第三方发布、存储或上传的任何内容或由该等内容导致的任何损失或损害，易鑫不承担责任。</p><p>    4.4对任何第三方通过本网站或服务可能对您造成的任何错误、中伤、诽谤、诬蔑、不作为、谬误、淫秽、色情或亵渎，易鑫不承担责任。</p><p>    4.5对黑客行为、计算机病毒、或因您保管疏忽致使账号、密码被他人非法使用、盗用、篡改的或丢失，或由于与本网站链接的其它网站所造成您个人资料的泄露，易鑫不承担责任。如您发现任何非法使用用户帐号或安全漏洞的情况，请立即与易鑫联系。</p><p>    4.6因任何非本网站原因造成的网络服务中断或其他缺陷，易鑫不承担任何责任。</p><p>    4.7易鑫不保证服务一定能满足您的要求；不保证服务不会中断，也不保证服务的及时性、安全性、准确性。</p><p>    4.8任何情况下，因使用本网站而引起或与使用本网站有关的而产生的由易鑫负担的责任赔偿总额，无论是基于合同、保证、侵权、产品责任、严格责任或其它理论，均不得超过您因访问或使用本网站而向本网站支付的任何报酬（如果有的话）。</p>            </div>            <div class="list_p"><p class="tit2"><strong>五、服务变更、中断或终止</strong></p><p>5.1如因升级的需要而需暂停网络服务、或调整服务内容，易鑫将尽可能在本网站上进行通告。由于用户未能及时浏览通告而造成的损失，易鑫不承担任何责任。</p><p>5.2您明确同意，易鑫有权根据实际情况随时调整本网站提供的服务内容、种类和形式，或自行决定授权第三方向您提供原本易鑫提供的服务。因业务调整给您或其他用户造成的损失，易鑫不承担任何责任。同时，易鑫保留随时变更、中断或终止服务全部或部分服务的权利。</p><p>5.3发生下列任何一种情形，易鑫有权单方面中断或终止向您提供服务而无需通知您，且无需对您或第三方承担任何责任：</p><p>5.3.1您提供的个人资料不真实；</p><p>5.3.2您违反本服务条款及其他网站内规定；</p><p>5.3.3未经易鑫书面同意，将本网站用于商业及其他任何经济目的。</p><p>5.4您可以随时通知易鑫终止向您提供服务或直接取消服务。自您终止或取消服务之日起，易鑫不再向您承担任何形式的责任。</p>            </div>            <div class="list_p"><p class="tit2"><strong>六、知识产权及其它权利</strong></p><p>6.1用户可以充分利用本网站共享信息。您可以在本网站上发布从本网站个人主页或其他网站复制的图片和信息等内容，但这些内容必须属于公共领域或者您拥有以上述使用方式使用该等内容的权利，且您有权对该等内容做出本条款下之授权、同意、认可或承诺。</p><p>6.2对您在本网站上发布或以其它方式传播的内容，您作如下声明和保证：</p><p>6.2.1对于该等内容，您有所有权或使用权；</p><p>6.2.2该等内容是合法的、真实的、准确的、非误导性的；</p><p>6.2.3使用和发布此等内容或以其它方式传播此等内容不违反本服务条款，也不侵犯任何人或实体的任何权利或造成对任何人或实体的伤害。</p><p>6.3未经相关内容权利人的事先书面同意，您不得擅自复制、传播在本网站上的该等内容，或将其用于任何商业目的，所有这些资料或资料的任何部分仅可作为个人或非商业用途而保存在某台计算机内。否则，易鑫及/或权利人将追究您的法律责任。</p><p>6.4您在本网站上发布或传播的自有内容或有使用权的内容，您特此同意如下：</p><p>6.4.1授予易鑫使用、复制、修改、改编、翻译、传播、发表此等内容，从此等内容创建派生作品，以及在全世界范围内通过任何媒介（现在已知的或今后发明的）公开展示和表演此等内容的权利；</p><p>6.4.2授予本网站及其关联方和被许可人一项权利，可依他们的选择而使用用户有关此等内容而提交的名称；</p><p>6.4.3授予易鑫在第三方侵犯您在本网站上的权益、或您发布在本网站上的内容情况下，依法追究其责任的权利（但这并非易鑫的义务）。</p><p>6.5您在本网站上公开发布或传播的内容、图片等为非保密信息，易鑫没有义务将此等信息作为您的保密信息对待。在不限制前述规定的前提下，易鑫保留以适当的方式使用内容的权利，包括但不限于删除、编辑、更改、不予采纳或拒绝发布。易鑫无义务就您提交的内容而向您付款。一旦内容已在本网站上发布，易鑫也不保证向您提供对在本网站上发布内容进行编辑、删除或作其它修改的机会。</p><p>6.6如有权利人发现您在本网站上发表的内容侵犯其权利，并依相关法律、行政法规的规定向易鑫发出书面通知的，易鑫有权在不事先通知您的情况下自行移除相关内容，并依法保留相关数据。您同意不因该种移除行为向易鑫主张任何赔偿，如易鑫因此遭受任何损失，您应赔偿易鑫的损失（包括但不限于赔偿各种费用及律师费）。</p><p>6.7若您认为您发布第6.6条指向内容并未侵犯其他方的权利，您可以向易鑫以书面方式说明被移除内容不侵犯其他方权利的书面通知，该书面通知应包含如下内容：您详细的身份证明、住址、联系方式、您认为被移除内容不侵犯其他方权利的证明、被移除内容在本网站上的位置以及书面通知内容的真实性声明。易鑫收到该书面通知后，有权决定是否恢复被移除内容。</p><p>6.8您特此同意，如果6.7条中的书面通知的陈述失实，您将承担由此造成的全部法律责任，如易鑫因此遭受任何损失，您应赔偿易鑫的损失（包括但不限于赔偿各种费用及律师费）。</p>            </div>            <div class="list_p"><p class="tit2"><strong>七、风险提示</strong></p><p>7.1请您仔细识别投资理财产品面临或可能承担的风险，包括但不限于外部市场风险、借款人信用风险、发行机构自身的管理风险、技术风险、合规风险，区分不同类型的理财产品不同的收益预期风险等，特别是收益性高的产品、P2P产品、法律法规及监管政策禁止承诺保本保息的产品、渲染预期收益率的产品、未进行专业术语定义、未标注风险提示的产品等。</p><p>7.2呈现于本网站的投资理财等产品信息均由第三方合作机构提供，具体产品详情请咨询相应发售机构。</p><p>7.3不同机构的不同产品的专用术语定义会有所不同，包括但不限于&ldquo;预期年化收益率&rdquo;、&ldquo;产品托管费率&rdquo;、&ldquo;手续费&rdquo;、计算方式等，请您谨慎识别并咨询具体发售机构。</p><p>7.4本网站不会对投资的未来效果、收益或者与其相关的情况做出保证性承诺，不会含有明示或者暗示保本、无风险或者保收益等内容。如您发现上述内容，可以随时向易鑫举报，举报电话4000-169-169。</p>            </div>            <div class="list_p"><p class="tit2"><strong>八、特别约定</strong></p><p>8.1您使用本服务的行为若有任何违反国家法律法规或侵犯任何第三方的合法权益的情形时，易鑫有权直接删除该等违反规定之信息，并可以暂停或终止向您提供服务。</p><p>8.2若您利用服务从事任何违法或侵权行为，由您自行承担全部责任，因此给易鑫或任何第三方造成任何损失，您应负责全部赔偿责任，并使易鑫免受由此产生的任何损害。</p><p>8.3您同意易鑫通过重要页面的公告、通告、电子邮件以及常规信件的形式向您传送与服务有关的任何通知和通告。</p><p>8.4本服务条款之效力、解释、执行均适用中华人民共和国法律。</p><p>8.5如就本协议内容或其执行发生任何争议，应尽量友好协商解决；协商不成时，任何一方均可向北京市海淀区人民法院提起诉讼。</p><p>8.6本服务条款中的标题仅为方便而设，不影响对于条款本身的解释。</p></div>',
          title: '车贷服务条款'
        })
      },

      resetData(){
        this.user = {}
      },

      submit(data){
        if(!data){
          return false
        }

        this.submiting = true
        this.resetData()

        this.$http.post('/Register/Register', {mobile: data.mobile, validateCode: data.authcode}).then(response => response.json().then(res => {
          if(res.Result){
            if(res.IsExist){
              this.submiting = false
              if(res.Data.HeadPortrait){
                this.user.portrait = res.Data.HeadPortrait
              }
              this.user.name = res.Data.NickName
              this.user.tel = res.Data.Telphone
              this.status = 'fail'
            }else{
              this.status = 'success'
              this.registerTel = res.Data.TelphoneText
            }
          }else{
            tools.showAlert(res.Message)
            this.submiting = false
          }
        }))
      }
    },

    components: {
      ComponentHeader,
      MobileVerify,
      SuccessBox,
      FailBox
    }
  }
</script>