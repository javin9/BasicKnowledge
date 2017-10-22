<template>
    <div class="form_box">
        <ul class="fromList checkApp clearfix">
            <li class="chooseCity nobg">
                <a href="javascript:void(0);">
                    <span class="triggers active fontSize_15" data-id="-1" id="ChooseCity" :CityId="CityId" ><em v-text="CityName" :CityId="CityId" @click='chooseCity' ></em></span>
                    <b class="left_tit fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/dingweichengshi.png" alt="Alternate Text" /></i>用车城市</b>
                </a>
                <div class="dis_mark" :class="[cityReadonly:showClass:'']"></div>
            </li>
            <li class="xqtis ">请选择您的用车城市</li>
            <li class="xqtis" id="liCity" :class="[ShowTip?showClass:'']">该城市不支持投保，请选择其它城市</li>
            <li class="nobg carBigBox">
                <a href="javascript:void(0);">
                    <div class="car_box fontSize_15">
                        <input type="text" :name="[isNewCarClass?newCarName: carName]" id="car_num" placeholder="请输入车牌号" class="input_text fontSize_15 uppercase nochinese" v-model='LicensePlateCode' maxlength="7" />
                        <div class="new_car" :class=" [showNewCarClass ? '' : hideClass]">
                            <em class="fontSize_15">未上牌</em><div class="sex_btn" @click='chooseNewCar()' :class="[isNewCarClass?checkedClass:'']"></div>
                        </div>
                    </div>
                    <b class="left_tit fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/Licenseplatenumber.png" alt="Alternate Text" /></i>车牌号</b>
                </a>
            </li>
            <li class="xqtis" id="liCarNum">请输入车牌号</li>
            <li style="display: none" :class="[showDateClass ? showClass:'' ]">
                <a href="javascript:void(0);">
                    <span class="triggers fontSize_15" data-id="-1">
                        <input type="text" placeholder="请选择注册日期" name="FirstRegisterDate" class="input_text RegisterDate fontSize_15" readonly="readonly" v-model.trim="FirstRegisterDate" :class="[isNewCarClass?hideClass:showClass]" @click="chooseFirstRegisterDate">
                        <input type="text" placeholder="请选择注册日期" name="NewCarFirstRegisterDate" class="input_text RegisterDate fontSize_15" readonly="readonly" readonly="readonly" v-model.trim="FirstRegisterDate" :class="[isNewCarClass?showClass:hideClass]" @click="chooseNewCarFirstRegisterDate" >
                    </span>
                    <b class="left_tit  fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/date.png" alt="Alternate Text" /></i>注册日期</b>
                </a>
            </li>
            <li class="xqtis" name="FirstRegisterDate">请选择注册日期</li>
            <li class="nobg">
                <a href="javascript:void(0);">
                    <span class="triggers  fontSize_15" data-id="-1">
                        <input id="Name" type="text" placeholder="请输入车主姓名" maxlength="15" name="Name" class="input_text fontSize_15" v-model.trim="OwnerName">
                    </span>
                    <b class="left_tit  fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/name.png" alt="Alternate Text" /></i>车主姓名</b>
                </a>
            </li>
            <li class="xqtis">请输入车主姓名</li>
            <!-- @*北京地区*@ -->
            <li class="nobg" :class="[hideinsuredName?hideClass:'']">
                <a href="javascript:void(0);">
                    <span class="triggers  fontSize_15" data-id="-1">
                        <input type="text" placeholder="请输入被保人姓名" name="Name" class="input_text uppercase nochinese fontSize_15" maxlength="30" v-model.trim="InsuredName">
                    </span>
                    <b class="left_tit  fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/name.png" alt="Alternate Text" /></i>被保人姓名</b>
                </a>
            </li>
            <li class="xqtis">请输入被保人姓名</li>
            <li class="nobg">
                <a href="javascript:void(0);">
                    <span class="triggers  fontSize_15" data-id="-1">
                        <input type="tel" placeholder="请输入车主手机号" name="Telephone" class="input_text fontSize_15" maxlength="11" v-model.trim="OwnerPhone" @input="onTelephoneInput(($event))" @blur="phoneSend()">
                    </span>
                    <b class="left_tit  fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/phone.png" alt="Alternate Text" /></i>手机号</b>
                </a>
            </li>
            <li class="xqtis">请输入车主手机号</li>
            <li class="nobg IDCard" :class="[ShortEName == 'CPIC' ? showClass:hideClass]">
                <a href="javascript:void(0);">
                    <span class="triggers fontSize_15" :class="[OwnerNo=='请输入车主身份证号' ? '' : activeClass]" v-text='OwnerNo' @click="keyBoardClick($event)"></span><i class="cursor-blink hide"></i>
                    <b class="left_tit  fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/identity-card.png" alt="Alternate Text" /></i>身份证号</b>
                </a>
            </li>
            <li class="xqtis">请输入车主身份证号</li>
            <li class="nobg code_box hide">
                <a href="javascript:void(0);">
                    <span class="triggers  fontSize_15" data-id="-1">
                        <input type="tel" placeholder="请输入验证码" name="ValidateCode" class="input_text fontSize_15" v-model.trim="MobilePhoneNo" maxlength="4" id="MobilePhoneNo">
                        <button class="code_btn fontSize_13" :v-text="verifyCodeText" :class="[again?'grey':'']" @click="getVerifyCode()">获取验证码</button>
                    </span>
                    <b class="left_tit  fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/yanzhengma.png" alt="Alternate Text" /></i>验证码</b>
                </a>
            </li>
            <li class="xqtis">请输入验证码</li>
            <!-- @*北京新车*@ -->
            <li class="nobg" id="InvoiceNumber" style="display: none;">
                <a href="javascript:void(0);">
                    <span class="triggers  fontSize_15" data-id="-1">
                        <input type="number" placeholder="请输入发票号" name="InvoiceNumber" class="input_text fontSize_15" maxlength="8" v-model.trim='InvoiceNumber' @input="onInvoiceNumberInput(#event)">
                    </span>
                    <b class="left_tit  fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/fapiaohao.png" alt="Alternate Text" /></i>发票号</b>
                </a>
            </li>
            <li class="xqtis">请输入发票号</li>
            <li class="" id="InvoiceDateTrigger" style="display: none;">
                <a href="javascript:void(0);">
                    <span class="triggers  fontSize_15" data-id="-1">
                        <input type="text" placeholder="请选择发票日期" name="InvoiceDate" class="input_text fontSize_15" readonly="readonly" v-model.trim='InvoiceDate' @click="chooseInvoiceDate">
                    </span>
                    <b class="left_tit  fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/date.png" alt="Alternate Text" /></i>发票日期</b>
                </a>
            </li>
            <li class="xqtis">请选择发票日期</li>
            <li class="" :class="[hideMileageEnergyType?hideClass:'']" id="EnergyType">
                <a href="javascript:void(0);">
                    <span class="triggers fontSize_15 active">
                        <input type="text" name="EnergyType" placeholder="请选择能源类型" class="input_text fontSize_15" readonly="readonly" :val_num="EnergyTypeAttr" v-model.trim="EnergyType" @click="chooseEnergyType">
                    </span>
                    <b class="left_tit  fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/ranyou.png" alt="Alternate Text" /></i>能源类型</b>
                </a>
            </li>
            <li class="xqtis">请选择能源类型</li>
            <li class="" :class="[hideMileageEnergyType?hideClass:'']" id="Mileage">
                <a href="javascript:void(0);">
                    <span class="triggers active fontSize_15">
                        <input type="text" name="EnergyType" placeholder="请选择行驶里程" class="input_text fontSize_15" readonly="readonly" :val_num="MileageAttr" v-model.trim="Mileage" @click="chooseMileage">
                    </span>
                    <b class="left_tit fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/xingshilicheng.png" alt="Alternate Text" /></i>行驶里程</b>
                </a>
            </li>
            <li class="xqtis">请选择行驶里程</li>
            <li class="" :class="DrivingCity?hideClass:''" id="DrivingCity">
                <a href="javascript:void(0);" style="padding-left: 4rem;">
                    <span class="triggers  fontSize_15" :val_num="DrivingCityCodeVal">
                        <input type="text" name="DrivingCity" placeholder="请选择行驶证登记地区" class="input_text fontSize_15" readonly="readonly" :val_num="DrivingCityCodeVal" v-model.trim="DrivingCityCode" @click="chooseDrivingCity">
                    </span>
                    <b class="left_tit  fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/dengjidiqu.png" alt="Alternate Text" /></i>行驶证登记地区</b>
                </a>
            </li>
            <li class="xqtis">请选择行驶证登记地区</li>
        </ul>
        <div class="submit_btn_box">
            <a href="javascript:void(0);" class="submit_btn fontSize_16 back_gray" @click="subInfo()">为爱车投保</a>
            <p class="sub_pop_tit fontSize_12" :class='[showGiftClass? "": hideClass]'><i class="icon i7"></i><em v-text="GiftTag"></em></p>
        </div>
    </div>
    <!-- @*续保身份验证弹出框*@ -->
    <div class="code_alert_box">
        <div class='mark'></div>
        <div class='info'>
            <div class='info_main'>
                <p class="fontSize_15" align="center">
                    欢迎再次选择<i data-bind="text: companyName"></i><br />
                    请输入身份证号快速报价
                </p>
                <div class="box clearfix">
                    <input type="text" placeholder="请输入车主身份证号" name="IDCard" class="input_text" data-bind="value: OwnerNo" maxlength="18" id="OwnerNo1" style="width: 70%;">
                    @*<i class="cursor-blink hide" style="left:0.8rem;"></i>*@
                    <span class="removeVal">
                        <img src="../../comm/images/icon/remove.png" alt="Alternate Text" /></span>
                </div>
                <div class="bottom">
                    <input type="button" name="name" value="取消" class="bottomBtn fontSize_16 close remvoe_btn" />
                    <input type="button" name="name" value="确定" class="bottomBtn fontSize_16 save_btn" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ifvisible from '../../comm/script/ifvisible.js';
import '../../comm/script/date.js';
import '../../comm/script/scrollselect.js';
/*APP判断*/
export default {
  data () {
    return {
        fromValue:(comm.getUrlParam('yxms') && comm.getUrlParam('yxms') != 'null' && comm.getUrlParam('yxms') != null) ? comm.getUrlParam('yxms') : '',
        hideClass:'hide',
        showClass:'show',
        showNewCarClass: true,
        activeClass:'active',
        checkedClass:'checked',
        CityName:(comm.getUrlParam('CityName') && comm.getUrlParam('CityName') != 'null' && comm.getUrlParam('CityName') != null) ? comm.getUrlParam('CityName') : '北京',
    	CityId:(comm.getUrlParam('CityID') && comm.getUrlParam('CityID') != 'null' && comm.getUrlParam('CityID') != null) ? comm.getUrlParam('CityID') : '110100',//国标码
        ShortEName:comm.getUrlParam('ShortEName'),//保险公司名称
        companyName:comm.getUrlParam('ShortEName'),
        ProvinceId:'',//省
        LicensePlateCode:'京',//车牌号
        shortCode:'京',//城市编码
        oldLicensePlateCode:'',//车牌号
        isNewCarClass:false,//是否是新车
        FirstRegisterDate:'',//注册日期
        OwnerName:'',//车主姓名
        InsuredName:'',//被保人姓名
        OwnerPhone:'',//车主手机号码
        OwnerNo:'请输入车主身份证号',//身份证号码
        isOwnerNoActive:false,
        MobilePhoneNo:'',//验证码
        InvoiceNumber:'',//发票号码
        InvoiceDate:'',//发票日期
        verifyCodeText:'获取验证码',
        EnergyType:'汽油',//能源类型
        EnergyTypeAttr:'A',//能源类型编码
        Mileage:'小于3万里',//行驶里程
        MileageAttr:'1',//行驶里程属性值
        carName:'CarNumber',
        newCarName:'NewCarNumber',
        hideinsuredName:true,//是否隐藏被保人
        DrivingCity: true, //是否显示行驶证登记地区
        DrivingCityCode:'', //是否显示行驶证登记地区
        DrivingCityCodeVal:'', //行驶证登记地区代号
        newCar:false,
        hideMileageEnergyType: true,
        ShowTip:false,//是否显示红色字体提示
        GiftTag:'',//投保礼内容
        showGiftClass:false,
        showDateClass:false,//是否显示注册日期
        isFocus:false,
        again:true,
        seconds:59,//倒计时
        myprotocol: "http:",
        maxlength:7,
        codeinterval:'',
        cityReadonly: false,//城市选择
        orderId:(comm.getUrlParam('orderId')&&comm.getUrlParam('orderId')!=null&&comm.getUrlParam('orderId')!='null'&&comm.getUrlParam('orderId')!='')?comm.getUrlParam('orderId'):((comm.getCookie('orderid') && comm.getCookie('orderId')!='' && comm.getCookie('orderid') != null)?comm.getCookie('orderid'):''),//订单号
        juGift:false,
        SendMessage:false,
    }
  },
  components: {
  },
  methods:{
    init:function(){
        console.log(this.orderId)
        this.setData();
        this.showDate();//判断是否要显示注册日期
        this.isShowNewCar();//判断展示新车按钮
        this.changeCheck();//input验证
        this.DetectPageStatus(300);
    },
    setData: function (time) {//设置初始化数据
        var $that = this;
        if ($that.ShortEName == undefined) {
            var subUrl = comm.getSubUrl('?');
            var host = window.location.host;
            host = $that.myprotocol+'//' + host + subUrl;
            window.open(host, '_self');
            return false;
        }
        if ($that.ShortEName == 'CCIC' ) {
            $that.juGift = true;
        } else if ($that.ShortEName == 'AXATP') {
            $that.juGift = true;
            //姓名2-5中文
            $('input[name=Name]').attr('name', 'FourName');
        }else if ($that.ShortEName == 'CPIC') {
            //姓名2-5中文
            $('input[name=Name]').attr('name', 'FourName');
        }else if ($that.ShortEName == 'AIC') {
            //永诚仅能输入京牌
            carNumberName = 'BJ_CarNumber';
            $('#car_num').attr('name', carNumberName);
        }else if ($that.ShortEName == 'PICC') {
            $that.hideBeibaoren = false;
        }
        $that.companyName =$that.ShortEName;
        if ($that.orderId && $that.orderId != '') {
            if ($that.ShortEName == 'AIC') {
                $that.cityReadonly = true;
            }
            var _data = {
                orderId: $that.orderId, ShortEName: $that.ShortEName
            };
            Store.GetInsuranceBasicInfo(_data).then(function (data) {
                if (data.Result) {
                    var mydata = data.Data;
                    $that.CityId = mydata.VehicleCityId;
                    $that.CityName = mydata.CityName;
                    comm.setCookie('chooseCityName',mydata.CityName);
                    var licenseNumber = mydata.LicenseNumber;
                    console.log(licenseNumber)
                    licenseNumber = licenseNumber.replace('*', '＊');
                    $that.LicensePlateCode = licenseNumber;//车牌号
                    if($that.LicensePlateCode.indexOf('＊')>= 0){
                        $('#car_num').attr('readonly','readonly');
                    }else{
                        $('#car_num').removeAttr('readonly');
                    }
                    console.log($that.LicensePlateCode)
                    if ($that.ShortEName =='CCIC' || $that.ShortEName =='CIC' )//只有大地才赋值，否则到第二页会有值带出
                        $that.FirstRegisterDate = mydata.FirstRegisterDate;//初登日期
                    $that.isNewCarClass = mydata.NoLicenseFlag;//是否新车mydata.NoLicenseFlag
                    $that.OwnerName = mydata.Name;//车主姓名
                    $that.InsuredName = mydata.InsuredName;//被保人姓名
                    $that.b_IdVal = mydata.InsuredIdNo;//被保人证件号
                    // $('.IDCard span').text(mydata.OwnerIdNo).addClass('active');
                    $that.OwnerNo = mydata.OwnerIdNo;//身份证号
                    $that.OwnerPhone = mydata.Phone;//车主手机号
                    $that.InvoiceNumber = mydata.CarInvoiceNum; //发票号
                    $that.InvoiceDate = comm.formatDateTime(mydata.CarInvoiceDate);//发票日期
                    $that.ProvinceId = mydata.VehicleCityId.substr(0, 2) + '0000';//省编码
                    $that.EnergyType = comm.ConvertEnergyType(mydata.FuelType);//能源类型
                    $that.EnergyTypeAttr = mydata.FuelType;//能源类型
                    $that.Mileage = comm.ConvertMileage(mydata.AverageMile);//行驶里程
                    $that.MileageAttr = mydata.AverageMile;//行驶里程
                    $that.DrivingCityCodeVal = mydata.TraveltaxAddress;//行驶证登记地区
                    $that.DrivingCityCode = comm.DrivingCityType(mydata.TraveltaxAddress);
                    $that.setNewCar();
                    if($that.ShortEName == 'PICC'){
                        if($that.CityId == '120100'){//人保天津需要行驶证登记地区
                            $that.DrivingCity = false;
                        }else{
                            $that.DrivingCity = true;
                        }
                        if ($that.CityId == '120100' || $that.ProvinceId == '210000'){//objViewModel.CityId() == '110100'
                            $that.hideMileageEnergyType = false;
                        }else{
                            $that.hideMileageEnergyType = true;
                        }
                    }else{
                        if($that.CityId == '110100' && $that.ShortEName == 'AXATP'){
                            $that.hideMileageEnergyType = true;//安盛北京地区显示形式里程和能源类型
                        }
                    }
                    $that.showGift();
                    $that.canNotInsureCity();
                    $that.getCityShortCode();
                    $that.newEnergyCarNumber();
                }
            });
        } else {
            if ($that.ShortEName == 'AIC') {
                $that.CityId = '110100';
                $that.CityName = '北京';
                $that.ProvinceId = '110000';//省
                $that.LicensePlateCode = '京';
                $that.cityReadonly = true;
            } else if ($that.ShortEName == 'ZABX') {
                $that.CityId = '500100';
                $that.CityName = '重庆';
                $that.ProvinceId = '500000';//省
                $that.LicensePlateCode = '渝';
            }
            else if ($that.ShortEName == 'CCIC') {
                $that.CityId = '310100';
                $that.CityName = '上海';
                $that.ProvinceId = '310000';//省
                $that.LicensePlateCode = '沪';
            }
            else {
                // $that.CityId = comm.getUrlParam('CityID');
                $that.CityName = decodeURIComponent($that.CityName).Trim();
                $that.LicensePlateCode = decodeURIComponent($that.LicensePlateCode);
            }
            if($that.ShortEName == 'PICC'){//人保北京需要燃料种类，天津、辽宁需要行驶里程
                if($that.CityId == '120100'){//人保天津需要行驶证登记地区
                    $that.DrivingCity = false;
                }else{
                    $that.DrivingCity = true;
                }
                if ( $that.CityId == '120100' || $that.ProvinceId == '210000'){//objViewModel.CityId() == '110100' ||
                    $that.hideMileageEnergyType = false;
                }else{
                    $that.hideMileageEnergyType = true;
                }
            }else{
                if($that.CityId == '110100' && $that.ShortEName == 'AXATP'){
                    $that.hideMileageEnergyType = true;//安盛北京地区显示形式里程和能源类型
                }
            }
            $that.canNotInsureCity();
            $that.getCityShortCode();
            $that.newEnergyCarNumber();
            $that.showGift();
            $that.wechatShare();
        }
        comm.setCookie('chooseCityName',$that.CityName);
    },
    DetectPageStatus:function(time){//检测用户是否在操作页面  time-空闲多长时间
        var $that = this;
        ifvisible.ifvisible.setIdleDuration(time);
        ifvisible.ifvisible.on('statusChanged', function(e){
            if(e.status == 'idle'){
                $that.saveSendData();
            }
        });
    },
    newEnergyCarNumber:function(){
        var $that = this;
        //新能源车牌号【太保：上海（310100）、南京（320100）、无锡（320200）、济南（370100）、深圳（440300）】
        if ($that.ShortEName == "CPIC") {
            //不区分城市了，所有地区都支持
            $("#car_num").attr("maxlength", 8);//新能源车牌号+1位
            this.maxlength = 8;
        }
    },
    isShowNewCar :function(){//是否显示新车按钮
        var $that = this;
        $that.ShortEName == 'CLIC' ? $that.showNewCarClass=false:$that.showNewCarClass=true;
    },
    wechatShare: function () {
        var $that = this;
        if ($that.ShortEName == "AXATP") {
            var host = window.location.host;
            var myprotocol = window.location.protocol;
            var config = {};
            config.SkipUrl = myprotocol + "//" + host + '/InsureApi/UserBasicInfo' + comm.getUrlParamStr("?"),// 分享的网页链接
            config.Title = "好司机，省到底，我是安盛天平车险，在chexian.com等你！",
            config.Detail = "安盛天平，风险更低，价格更低！",
            config.ImageUrl = APIURL + "/images/insurance/pic300.jpg"// 图片
            comm.customWXShare(config);
        } else {
            comm.setWXShare();//微信分享
        }
    },
    chooseCity: function () {//选择城市
        var $that = this;
        var NewCity = new NewSelectCity({
            Trigger: $('#ChooseCity'), //触发事件的dom
            hot: true,//是否显示热门城市，如果不是选择城市那么这个属性失效
            isCity: true, //选择城市还是区县
            islocation: true,//是否需要定位城市 ，如果不是选择城市那么这个属性失效
            main_box: $('.form_box'), //要隐藏的box
            shortEName: $that.ShortEName,
            CallBack: function (obj) { //回调事件
                $that.CityId = obj.RegionId;
                $that.CityName = obj.CityName;
                $that.ProvinceId = obj.ProvinceId;
                $that.LicensePlateCode = obj.LicensePlateCode;
                $that.shortCode = obj.LicensePlateCode;
                $that.oldLicensePlateCode = obj.LicensePlateCode;
                if($that.isNewCarClass){
                    $that.isNewCar(true, $that.LicensePlateCode);
                }else{
                    $that.isNewCar(false, $that.LicensePlateCode);
                }
                if($that.CityId == '110100'){//北京地区显示被保人姓名
                    if($that.ShortEName == 'AXATP'){
                        $that.hideMileageEnergyType = false;//安盛北京地区显示形式里程和能源类型
                    }
                }
                if($that.ShortEName == 'PICC'){//人保天津需要行驶证登记地区
                    if($that.CityId == '120100'){
                        $that.DrivingCity = false;
                    }else{
                        $that.DrivingCity = true;
                    }
                    if($that.CityId == '120100' || $that.ProvinceId == '210000'){
                        $that.hideMileageEnergyType = false;
                    }else{
                        $that.hideMileageEnergyType = true;
                    }
                }
                $that.canNotInsureCity();
                $that.showGift();
                $that.wechatShare();
            }
        });
    },
    canNotInsureCity: function () {//验证城市是否能投保
        var $that = this;
        var flag = false;
        var _data = {
            shortEName:$that.ShortEName,
            gBcode:$that.CityId,
            from:$that.fromValue
        };
        Store.GetInsureRegionByGbcode(_data).then(function (res ) {
            if (res.Data != null) {
                var shortEName = $that.ShortEName;
                if(res.Data[shortEName] == null){
                    $that.ShowTip = true;
                }else{
                    $that.ShowTip = false;
                }
                //前端控制
                if ($that.ShortEName == 'CCIC') {
                    if (!comm.nonsupportCity_CCIC($that.CityId, $that.ProvinceId)) {//验证不能投保的城市
                        $that.ShowTip = true;
                    }
                }
                else if ($that.ShortEName == 'ZABX') {//众安车险目前仅支持重庆、黑龙江、广西、陕西、山东、青岛投保，需要前端在投保城市上做控制
                    if (!comm.isFeigaiCity($that.CityId, $that.ProvinceId)) {
                        $that.ShowTip = true;
                    }
                } else if ($that.ShortEName == 'AIC' && $that.CityId == '110100') {
                    $that.ShowTip = false;
                }
            }
        });
    },
    getCityShortCode: function () {//获取车牌号的简码
        var $that = this;
        Store.GetRegionByRegionid({regionid:$that.CityId}).then(function (res ) {
            $that.shortCode = res.Data.LicensePlateCode;
            $that.oldLicensePlateCode = $that.shortCode;
            comm.setCookie('chooseCityName',res.Data.Name);
            //如果不是返回
            if (!$that.orderId && $that.orderId == null  && $that.orderId == 'null' ) {
                $that.LicensePlateCode = $that.shortCode;
                $that.CityId =res.Data.RegionId;
                $that.CityName = res.Data.Name;
            }
        });
    },
    isNewCar: function (newCar, code) {//是否是新车
        // newCar  --  是否是新车 true/false
        var $that = this;
        var val = $that.shortCode;
        if ($that.isNewCarClass) {
            $that.isNewCarClass = true;
            $that.oldLicensePlateCode = $that.LicensePlateCode;
            $that.LicensePlateCode = val + '＊';
            $('#car_num').attr('readonly', 'readonly');
            if ($that.ShortEName != 'CPIC' && $that.ShortEName != 'AXATP' && $that.CityId == '110100') {
                $('#InvoiceNumber').show();
                $('#InvoiceDateTrigger').show();
            } else {
                $('#InvoiceNumber').hide();
                $('#InvoiceNumber').next('li[class=xqtis]').hide();
                $('#InvoiceDateTrigger').hide();
                $('#InvoiceDateTrigger').next('li[class=xqtis]').hide();
            }
            $that.Mileage = '新车';
            $that.MileageAttr = '0';
        } else {
            $that.isNewCarClass = false;
            $that.LicensePlateCode = $that.oldLicensePlateCode;
            $that.Mileage = '小于3万里';
            $that.MileageAttr = 1;
            $('#car_num').removeAttr('readonly');
            $('#InvoiceNumber').hide();
            $('#InvoiceNumber').next('li[class=xqtis]').hide();
            $('#InvoiceDateTrigger').hide();
            $('#InvoiceDateTrigger').next('li[class=xqtis]').hide();
        }
    },
    chooseNewCar: function () {//选择新车按钮
        var $that = this;
        if($that.isNewCarClass){
            $that.isNewCarClass = false;
        }else{
            $that.isNewCarClass = true;
            if(!$that.ShowTip){
                $that.FirstRegisterCheck();
                // $('#car_num').blur(); //新车Name输入框获取焦点
            }
        }
        $('#liCarNum').hide();
        $that.isNewCar($that.isNewCarClass,$that.LicensePlateCode);
    },
    setNewCar: function () {//设置新车
        var $that = this;
        if ($that.isNewCarClass) {
            $('.car_num').attr('readonly', 'readonly');
            $('.sex_btn').addClass('checked');
            $('#car_num').attr('name', 'NewCarNumber');
            if ($that.ShortEName != 'CPIC' && $that.ShortEName != 'AXATP' && $that.CityId == '110100') {
                $('#InvoiceNumber').show();
                $('#InvoiceDateTrigger').show();
            } else {
                $('#InvoiceNumber').hide();
                $('#InvoiceNumber').next('li[class=xqtis]').hide();
                $('#InvoiceDateTrigger').hide();
                $('#InvoiceDateTrigger').next('li[class=xqtis]').hide();
            }
        }
    },
    showGift:function(){//投保礼显示
        var $that = this;
        var _data = {
            channel:$that.fromValue,
            shortEName:$that.ShortEName,
            cityId:$that.CityId,
        };
        // 投保礼显示控制
        Store.GetInsuredGiftTag(_data).then(function (res ) {
            if(res.Result){
                    var text = res.Message;
                    $('.sub_pop_tit').removeClass('hide').html(text);
                    $that.GiftTag = text;
                    $that.showGiftClass = true;
                }else{
                    $that.showGiftClass = false;
                }
        });
    },
    showDate:function () {//是否显示注册日期
        var $that = this;
        ($that.ShortEName=='CCIC'|| $that.ShortEName=='CIC') ? $that.showDateClass = true : $that.showDateClass = false;
    },
    chooseInvoiceDate:function () {//发票日期
        var $that = this;
        var dateInput = $('input[name=InvoiceDate]');
        dateInput.DatePicker({
            date: new Date().daysShift(1),
            minDate: new Date((new Date().getTime()) - 24 * 60 * 60 * 1000 * 365),
            maxDate: new Date(),
            showHour: false,
            moduleTitle: '发票日期',
            onSelectDate: function (aDate) {
                $that.InvoiceDate = aDate.pattern('yyyy-MM-dd');
                $('#InvoiceDateTrigger').next('li[class=xqtis]').hide();
            }
        });
    },
    chooseFirstRegisterDate: function () {//初登日期
        var $that = this;
        var dateInput = $('input[name=FirstRegisterDate]');
        var date = new Date();
        var year = date.getFullYear() - 1;
        var month = date.getMonth() + 1;
        var day = date.getDate();
        dateInput.DatePicker({
            date: new Date(year + '/' + month + '/' + day),
            minDate: new Date((new Date().getTime()) - 24 * 60 * 60 * 1000 * 365 * 15),
            maxDate: new Date(),
            showHour: false,
            moduleTitle: '注册日期',
            titleFor:'MinDate',
            fullTitle: '暂不支持15年以上车辆投保',
            onSelectDate: function (aDate) {
                $that.FirstRegisterDate = aDate.pattern('yyyy-MM-dd');
                $('li[name=FirstRegisterDate]').hide();
            }
        });
    },
    chooseNewCarFirstRegisterDate: function () {//新车初登日期
        var $that = this;
        var dateInput = $('input[name=NewCarFirstRegisterDate]');
        dateInput.DatePicker({
            date: new Date().daysShift(1),
            minDate: new Date((new Date().getTime()) - 24 * 60 * 60 * 1000 * 270),
            maxDate: new Date(),
            showHour: false,
            moduleTitle: '新车注册日期',
            onSelectDate: function (aDate) {
                $that.FirstRegisterDate = aDate.pattern('yyyy-MM-dd');
                $('li[name=FirstRegisterDate]').hide();
                $that.FirstRegisterCheck();
            }
        });
    },
    FirstRegisterCheck: function () {//新车提示语
        var $that  =this;
        console.log($('input[name=FirstRegisterDate]').parents('li').css('display') != 'none')
        if ($('input[name=FirstRegisterDate]').parents('li').css('display') != 'none' && $that.isNewCarClass && $that.FirstRegisterDate != '') {
            //新车注册日期1
            var days = comm.getDays($that.FirstRegisterDate);
            if (days > 270) {
                $('li[name=FirstRegisterDate]')[0].innerHTML = '新车注册日期1年以内';
                $('li[name=FirstRegisterDate]').show();
                return false;
            }
        }
    },
    keyBoardClick:function(e){//身份证点击
        var $that = this;
        var $this = e.currentTarget;
        new KeyBoard($this,{initText:'请输入车主身份证号',callback:function(obj){
            if(obj.isHidden && obj.val != undefined  && $that.OwnerNo != ''   && $that.OwnerNo != 'undefined'){
                var valCheck = checkIdCard($that.OwnerNo);
                if(valCheck == true){
                    $($this).parents('li').next().addClass('hide').hide();
                }else{
                    $($this).parents('li').next().text(valCheck)
                    $($this).parents('li').next().removeClass('hide').show();
                }
            }
            if(obj.val == '' || obj.val == undefined || obj.val == '请输入车主身份证号'){
                $that.OwnerNo = '请输入车主身份证号';
                $that.isOwnerNoActive = false;
            }else{
                $that.OwnerNo = obj.val;
                $that.isOwnerNoActive = true;
            }
        }});
    },
    getVerifyCode:function(){
        var $that = this;
        //获取验证码
        if ($that.OwnerPhone != '') {
            $that.again(true);
            $that.verifyCodeText('(60)后获取');
            $that.codeinterval = setInterval($that.handle, 1000);//开启定时器
            var _data = {
                phone: $that.OwnerPhone,
                timestamp: new Date()
            };
            Store.GetVerifyCode(_data).then(function (res ) {
                if (res.Code == 200) {
                    ///成功
                } else {
                    $that.verifyCodeText = '获取验证码';
                    $that.again = false;
                    showAlert(res.Message);
                }
            });
        } else {
            showAlert('请输入手机号');
        }
    },
    handle: function () {//验证码事件
        var $that = this;
        if (seconds == 0) {
            clearInterval($that.codeinterval);
            clearTimeout($that.codeinterval);
            $that.verifyCodeText = '获取验证码';
            $that.again(false);
            seconds = 59;
        } else {
            if (seconds < 10)
                $that.verifyCodeText = '(0' + seconds + ')后获取';
            else
                $that.verifyCodeText = '(' + seconds + ')后获取';
            seconds = seconds - 1;
        }
    },
    checkVerifyCode: function () {//验证验证码
        var $that = this;
        //关闭定时器
        clearInterval($that.codeinterval);
        clearTimeout($that.codeinterval);
        if (SubmitCheck()) {
            comm.showLoadingDiv();
            var _data = {
                phone:$that.phone,
                code:$that.MobilePhoneNo
            };
            Store.CheckVerifyCode(_data).then(function (res ) {
                $("#loadingdiv").hide();
                    CloseLoading();
                    if (res.Code == 200) {
                        //成功
                        $that.onSubmit();
                    } else {
                        CloseLoading();//loading
                        $that.verifyCodeText = '获取验证码';
                        $that.again = false;
                        if (res.Message == '')
                            showAlert('验证手机验证码错误');
                        else
                            showAlert(res.Message);
                    }
            });
        }
    },
    chooseEnergyType: function () {//选择能源类型
        var $that = this;
        $that.energytypeSel = new scroll_select({
            Trigger: $('#EnergyType span'),
            objLen: 2,
            obj: { val: ['汽油', '柴油', '电', '混合油', '天然气', '液化石油气', '甲醇', '乙醇', '太阳能', '无', '其他', '混合动力'], attr: ['A', 'B', 'C', 'D', 'E', 'F', 'L', 'M', 'N', 'Y', 'Z', 'o'] },
            CallBack: function (obj, dom) {
                $that.EnergyType = obj.val;
                $that.EnergyTypeAttr = obj.attr;
            }
        });
    },
    chooseMileage: function () {//选择行驶里程
        var $that = this;
        if($that.isNewCarClass){return false};
        $that.mileageSel = new scroll_select({
            Trigger: $('#Mileage span'),
            objLen: 2,
            obj: { val: ['新车', '小于3万里', '大于3万里'], attr: ['0', '1', '30000'] },
            CallBack: function (obj, dom) {
                $that.Mileage = obj.val;
                $that.MileageAttr = obj.attr;
            }
        });
    },
    chooseDrivingCity:function(){//人保天津地区需要选择行驶证登记地区
        var $that = this;
        // 天津和平区:10100; 天津河东区:10200; 天津河西区:10300; 天津南开区:10400; 天津河北区:10500; 天津红桥区:10600; 天津塘沽区:10700; 天津汉沽区:10800; 天津大港区:10900; 天津东丽区:11000; 天津西青区:11100; 天津津南区:11200; 天津北辰区:11300; 天津直属:11400; 天津开发区:11500; 天津保税区:11600; 天津新技术产业园区:11700; 天津空港物流区:11900; 天津宁河县:22100; 天津武清区:22200; 天津静海区:22300; 天津宝坻区:22400; 天津蓟县:22500; 非天津:40100
        $that.DrivingCityEvent = new scroll_select({ //初始化行驶证登记地区下拉事件
            Trigger: $('#DrivingCity span'),
            objLen: 2,
            obj: {
                val: ['天津和平区', '天津河东区', '天津河西区', '天津南开区', '天津河北区', '天津红桥区', '天津塘沽区', '天津汉沽区', '天津大港区', '天津东丽区','天津西青区','天津津南区','天津北辰区','天津直属','天津开发区','天津保税区','天津新技术产业园区','天津空港物流区','天津宁河县','天津武清区','天津静海区','天津宝坻区','天津蓟县','非天津'],
                attr: [10100, 10200, 10300, 10400, 10500, 10600, 10700,10800,10900, 11000, 11100,11200,11300,11400,11500,11600,11700,11900,22100,22200,22300,22400,22500,40100]
            },
            CallBack: function(obj, dom) {
                $('#DrivingCity span').addClass('active');
                $that.DrivingCityCode = obj.val;
                $that.DrivingCityCodeVal = obj.attr;
                $('#DrivingCity').next().hide();
            }
        });
    },
    saveSendData:function(){//判断是否需要按字段保存
        var $that = this;
        $that.carNum = checkInputVal($('#car_num'));
        $that.name = checkInputVal($('input#Name'));
        $that.tel = checkInputVal($('input[name=Telephone]'));
        $that.registerDate = checkInputVal($('input.RegisterDate:visible'));
        if($that.carNum && $that.name && $that.tel ){
            $that.sendAjax();
        }
    },
    sendAjax:function(){//按字段保存
        var $that = this;
        $that.carNum = checkInputVal($('#car_num'));
        $that.name = checkInputVal($('input#Name'));
        $that.tel = checkInputVal($('input[name=Telephone]'));
        $that.registerDate = checkInputVal($('input.RegisterDate:visible'));
        if(!$that.carNum && !$that.name && !$that.tel ){
            return false;
        }
        var sendData = $that.getPostData;
        if($that.oldObj){
            $that.newObj = $that.getPostData;
            var isChange = comm.findChange($that.newObj,$that.oldObj,['OwnerPhone','OwnerName','LicenseNo']);
            if(isChange){
                $that.saveSendData();
                $that.oldObj=$that.getPostData();
            }
        }
        if($that.ShortEName() == 'CCIC'){
            if(sendData.FirstRegisterDate == ''){
                sendData.FirstRegisterDate = new Date((new Date().getTime()) - 24 * 60 * 60 * 1000 * 365).pattern('yyyy-MM-dd');
            }
        }
        $that.oldObj = sendData;
        Store.SaveFieldBasicInfo(_data).then(function (res ) {
            if(res.Result){
                $that.FieldOrderId = res.Data.OrderId;
            }
        });
    },
    setInter:function(){
        var $that = this;
        $that.repeat;
        $that.repeat = setInterval(function(){
            if($that.oldObj){
                $that.newObj = $that.getPostData();
                var isChange = comm.findChange($that.newObj,$that.oldObj,['OwnerPhone','OwnerName','LicenseNo']);
                if(isChange){
                    $that.saveSendData();
                    $that.oldObj=$that.getPostData();
                }
            }else{
                $that.oldObj = $that.getPostData();
            }
        },180000);//180000
    },
    getPostData: function () {//获取需提交的用户数据
        var data = {};
        var $that = this;
        data.IsMobile = 1;
        data.ShortEName = $that.ShortEName;
        data.LicenseNo = $that.LicensePlateCode.Trim().toUpperCase();//车牌号
        data.LicenseNo = data.LicenseNo.replace('＊', '*');
        if (data.LicenseNo.length > this.maxlength)
            data.LicenseNo = data.LicenseNo.substr(0, this.maxlength);
        data.FirstRegisterDate = $that.FirstRegisterDate;//初登日期
        data.NoLicenseFlag = $that.isNewCarClass == true ? 1 : 0//是否新车
        data.OwnerName = $that.OwnerName.trim();//车主姓名
        if($that.ShortEName == 'CPIC'){
            data.OwnerIdNo = $that.OwnerNo;//身份证号
        }
        data.OwnerPhone = $that.OwnerPhone;//车主手机号
        data.CarInvoiceNum = $that.InvoiceNumber; //发票号
        data.CarInvoiceDate = $that.InvoiceDate;//发票日期
        data.ProvinceId = $that.ProvinceId;//省编码
        data.CityCode = $that.CityId;//城市（国标码）
        data.CityName = $that.CityName.Trim();//城市名称
        data.FuelType = $that.EnergyTypeAttr;//能源类型
        data.AverageMile = $that.MileageAttr;//行驶里程
        data.FieldOrderId = $that.FieldOrderId;
        data.Source = comm.getUrlParam("source") ? comm.getUrlParam("source") : "";
        data.PromoCode = comm.getUrlParam("promocode") ? comm.getUrlParam("promocode") : "";
        data.TraveltaxAddress = $that.DrivingCityCodeVal;
        data.PiccCityName = $that.CityName;
        //from
        //斑马
        if (comm.getUrlParam('ZebraUid'))
            data.ZebraUid = comm.getUrlParam('ZebraUid');
        else
            data.ZebraUid = '';
        if (comm.getUrlParam('ShopId'))
            data.ShopId = comm.getUrlParam('ShopId');
        else
            data.ShopId = '';
        if ($that.fromValue)
            data.From = $that.fromValue;
        if (comm.getUrlParam('didaUserType'))
            data.didaUserType = comm.getUrlParam('didaUserType');
        if (comm.getUrlParam('didaPhoneNo'))
            data.didaPhoneNo = comm.getUrlParam('didaPhoneNo');
        if (comm.getUrlParam('didaUserName'))
            data.didaUserName = comm.getUrlParam('didaUserName');
        return data;
    },
    changeCheck:function(){//input变化验证
        var $that = this;
        $('input').on('inputchange',function(){
            var isTrue = comm.getInputCheck();
            if (isTrue) {
                if($that.DrivingCityCode == '' && $that.ShortEName == 'PICC' && $that.CityId == '120100'){
                    return false;
                }
                if (!$("#liCity").hasClass("show"))
                $('.submit_btn').removeClass('back_gray');
            }else{
                $('.submit_btn').addClass('back_gray');
            }
        });
    },
    onTelephoneInput: function (e) {//手机号的处理
        var $that = this;
        var $this = e.currentTarget;
        if ($($this).val().length > 11) {
            $($this).val($($this).val().substr(0, 11)) ;
        }
        if (comm.checkPhoneNum($($this).val()))
            $that.again = false;
        else
            $that.again = true;
        $that.OwnerPhone = $($this).val();
    },
    onInvoiceNumberInput: function () {//发票号的处理
        var $that = this;
        var $this = e.currentTarget;
        if ($this.value.length > 8) {
            $this.value = $this.value.substr(0, 8);
        }
        $that.InvoiceNumber = $this.value;
    },
    phoneSend:function(){//发送短信
        var $that = this;
        if(comm.checkPhoneNum($that.OwnerPhone)){
            //发送短信  参数 ---- mobile：手机号   smsType:发送类型  companyName：中文保险公司名
            // 【基本信息页】已经填写手机号，立即发送
            if ($that.SendMessageTel == $that.OwnerPhone){
                if($that.SendMessage){
                    return false;
                }
            }
            $that.SendMessage = true;
            var _data = {
                mobile:$that.OwnerPhone,
                smsType:1,
                companyName:comm.getCompanyName($that.ShortEName),
                from:$that.fromValue
            };
            Store.SendMessage(_data).then(function (res ) {
                if(res.Result){
                        $that.SendMessageTel = $that.OwnerPhone;
                        $that.SendMessage = true;
                    }else{
                        $that.SendMessage = false;
                    }
            });
        }
    },
    subInfo:function(){
        var $that = this;
        $('input').blur();
        if(SubmitCheck()){
            if($that.DrivingCityCode == '请选择行驶证登记地区' && $that.ShortEName == 'PICC' && $that.CityId == '120100'){
                $('#DrivingCity').next().removeClass('hide').show();
                return false;
            }
            if(!$(this).hasClass('back_gray')){
                if ($that.ShortEName == 'CPIC') {
                    if (checkIdCard($that.OwnerNo) == true) {
                        $('.IDCard span').parents('li').next().addClass('hide').hide();
                    } else {
                        $('.IDCard span').parents('li').next().text(checkIdCard($that.OwnerNo))
                        $('.IDCard span').parents('li').next().removeClass('hide').show();
                        return false;
                    }
                }
                $that.FirstRegisterCheck();
                //弹出遮罩层
                comm.showLoadingDiv();
                $that.onSubmit();
            }else{
                $('#loadingdiv').hide(); CloseLoading();
                $('input').blur();
            }
        }
    },
    onSubmit: function () {//提交
        comm.showLoadingDiv();
        var $that = this;
        var postdata = $that.getPostData();
        Store.AddInsuranceBasicInfo(postdata).then(function (data) {
            $("#loadingdiv").hide();
            comm.CloseLoading();
            if (data.Data != null) {
                if (data.Message == '0') {
                    //成功
                    var subUrl = comm.getSubUrl();
                    var orderid = data.Data.OrderId;
                    comm.setCookie('ComCode', data.Data.ComCode);
                    comm.setCookie('orderid', orderid);
                    var url;
                    if(data.Data.IsRedirect == '1'){
                        url = '/InsuranceApi/InsuranceChoice?orderId=' + orderid + '&showCar=1&ShortEName=' + $that.ShortEName + '&SessionId=' + data.Data.SessionId + subUrl;
                    }else{
                        url = '/InsuranceApi/UserDetailInfo?orderId=' + orderid + '&ShortEName=' + $that.ShortEName + '&SessionId=' + data.Data.SessionId + subUrl;
                    }
                    comm.setCookie('xubao',false);
                    comm.qqOpenUrl(url);
                }
                else if (data.Message == '1') {
                    var url;
                    var subUrl = comm.getSubUrl();
                    var orderid = data.Data.OrderId;
                    if(data.Data.IsIdVerifi == '1'){//续保需要验证身份信息
                        $that.showIdBox(data);
                    }else{
                        url = '/InsuranceApi/InsuranceChoice?orderId=' + orderid + '&showCar=1&ShortEName=' + $that.ShortEName+ '&return=0' + '&SessionId=' + data.Data.SessionId + subUrl;
                        comm.setCookie('xubao',true);
                    }
                    comm.qqOpenUrl(url);
                } else if (data.Message == '2' || data.Message == null) {
                    //失败
                    if (data.Data.ErrorDetail != null)
                        comm.showAlert(data.Data.ErrorDetail);
                    else
                        comm.showAlert('提交失败,请重新提交');
                    comm.setCookie('xubao',false);
                }
            }else{
                comm.CloseLoading();
                comm.showAlert('提交失败,请重新提交');
                comm.setCookie('xubao',false);
            }
        })
    },
    showIdBox:function(res){
        var $that = this;
        $that.OwnerNo = '';
        $('.code_alert_box').show();
        $('.code_alert_box .close').unbind().bind('click',function(){
            $('.code_alert_box').hide();
        });
        $('.code_alert_box .save_btn').click(function(){
            if($(this).hasClass('back_gray')){
                showAlert('请输入正确的身份证号',{btnCallBack:function(){
                    $('.alert_box.error_box').hide();
                    $('.code_alert_box').show();
                }});
            }else{
                $('#loadingdiv').show();
                var _data = {
                    OrderId:res.Data.OrderId,
                    SessionId:res.Data.SessionId,
                    OwnerIdNo: $that.OwnerNo,
                    ShortEName:$that.ShortEName
                };
                var errorCallback = function(){
                    $('#loadingdiv').hide();
                    comm.setCookie('xubao',false);
                };
                Store.RenewalConfirm(_data).then(function (res,errorCallback) {
                    if(IDres.Message == '0'){
                        var url = '/InsuranceApi/InsuranceChoice?orderId=' + res.Data.OrderId + '&showCar=1&ShortEName=' + $that.ShortEName+ '&return=0' + '&SessionId=' + res.Data.SessionId + comm.getSubUrl();
                        comm.qqOpenUrl(url);
                        comm.setCookie('xubao',true);
                    }else{
                        $('#loadingdiv').hide();
                        $('.code_alert_box').hide();
                        comm.showAlert(IDres.Data.ErrorMessage,{btnCallBack:function(){
                            $('.alert_box.error_box').hide();
                            $('.code_alert_box').show();
                        }});
                        comm.setCookie('xubao',false);
                    }
                });
            }
        });
    },
  },
  created(){
    this.ShortEName = comm.getUrlParam('ShortEName');
    // this.init();
  },
  ready:function(){
    this.init();
  }
}
//input change事件
$.event.special.inputchange = {
    setup: function () {
        var self = this, val;
        $.data(this, 'timer', window.setInterval(function () {
            val = self.value;
            if ($.data(self, 'cache') != val) {
                $.data(self, 'cache', val);
                $(self).trigger('inputchange');
            }
        }, 20));
    },
    teardown: function () {
        window.clearInterval($.data(this, 'timer'));
    },
    add: function () {
        $.data(this, 'cache', this.value);
    }
};
</script>