<template>
    <div class="form_box info_box">
        <header class="top_title">
            <a href="javascript:void(0);" class="return" @click="goReturn">
                <img src="../../comm/images/icon/fanhui.png" alt="Alternate Text" /></a>
            <a href="javascript:void(0);" class="center fontSize_17">填信息</a>
        </header>
        <p class="uploadPopMian fontSize_13 clearfix">
            <img src="../../comm/images/icon/prompt-blue.png" class=""><span class="fontSize_13">识别信息可能有误，请核对修改！</span><img src="../../comm/images/icon/close-whigt.png" class="close" @click="closeTip"></p>
        <h4 class="pop_tit fontSize_13 PatternSampleBox clearfix ">车辆信息<span class="PatternSample fontSize_13" @click='seeCarImg()'>在哪查看车辆信息？</span></h4>
        <ul class="fromList checkApp">
            <li class="nobg photoBigBox">
                <a href="javascript:void(0);">
                    <span class="triggers fontSize_15" data-id="-1">
                        <input id="FrameNumID" type="text" placeholder="请输入车架号" class="input_text uppercase nochinese fontSize_15" maxlength="17" autocapitalize="characters" v-model.trim="FrameNum" :name="[xubaoFrameNumID?'FrameNum1':'FrameNum']" @blur="frameNumBlur($event)" @focus="frameNumFocus($event)">
                    </span>
                    <b class="left_tit fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/VIN.png" alt="Alternate Text" /></i>车架号</b>
                </a>
                <div class="photoBox viewport-flip ">
                    <p class="photoList flip out">
                        <img src="../../comm/images/icon/Camera.png" alt="Alternate Text" /></p>
                    <p class="photoList flip fontSize_12">可拍照</p>
                    <input id="camera" class="camera" name="file" type="file" value="上传图片" />
                </div>
            </li>
            <li class="xqtis">请输入车架号</li>
            <li class="nobg">
                <a href="javascript:void(0);">
                    <span class="triggers fontSize_15" data-id="-1">
                        <input id="EngineNoID" type="text" placeholder="请输入发动机号" class="input_text uppercase nochinese fontSize_15" autocapitalize="characters" maxlength="16" name="EngineNo" v-model.trim="EngineNo" :name="[xubao?'EngineNo1':'EngineNo']" @blur="engineNoBlur($event)" @focus="engineNoFocus($event)">
                    </span>
                    <b class="left_tit fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/engine-number.png" alt="Alternate Text" /></i>发动机号</b>
                </a>
            </li>
            <li class="xqtis">请输入发动机号</li>
            <li class="">
                <a href="javascript:void(0);" class="BrandModel">
                    <span class="triggers fontSize_15" data-id="-1">
                        <input type="text" placeholder="请选择品牌型号" class="input_text fontSize_15" name="BrandModel" readonly="readonly" v-model="BrandModel" @click="searchCarType($event)">
                    </span>
                    <b class="left_tit fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/model.png" alt="Alternate Text" /></i>品牌型号</b>
                </a>
            </li>
            <li class="xqtis" name="brandModel">请输入品牌型号</li>
            <li class="configModel" :class="[ConfigModel == '请输入配置型号' || ConfigModel == '' ? hideClass : showClass]">
                <a href="javascript:void(0);">
                    <span class="triggers active fontSize_15" v-text="ConfigModel" :class="[ConfigModel = '请输入配置型号' ? '' ?activeClass]"></span>
                    <input type="hidden" placeholder="请输入配置型号" name="ConfigModel"  readonly="readonly" class="fontSize_15" v-model.trim="ConfigModel" @click="searchCarType">
                    <b class="left_tit fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/configuration.png" alt="Alternate Text" /></i>配置型号</b>
                </a>
            </li>
            <li class="xqtis" name="configModelLi">请输入配置型号</li>
            <li class="FirstRegisterDateLi" :class="[showDate?'':hideClass]">
                <a href="javascript:void(0);">
                    <span class="triggers fontSize_15" data-id="-1">
                        <input type="text" placeholder="请选择注册日期" name="FirstRegisterDate" class="input_text fontSize_15" v-model.trim="FirstRegisterDate" :class="[isNewCar?hideClass:'']" readonly="readonly" @click="chooseFirstRegisterDate">
                        <input type="text" placeholder="请选择注册日期" name="NewCarFirstRegisterDate" class="input_text fontSize_15" v-model.trim="FirstRegisterDate" :class="[isNewCar? '':hideClass]" readonly="readonly" @click="chooseNewCarFirstRegisterDate">
                    </span>
                    <b class="left_tit fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/date.png" alt="Alternate Text" /></i>注册日期</b>
                </a>
            </li>
            <li class="xqtis" name="FirstRegisterDate">请选择注册日期</li>
            <li class="nobg noIcon" name="NewEnergy" :class="[hideNewEnergy?hideClass:showClass]">
                <a href="javascript:void(0);">
                    <div class="sex_btn" style="float: right;" :class="[isNewEnergy?checkedClass:'']" @click='NewEnergySwitch'></div>
                    <b class="left_tit fontSize_15"><i class="imgBox"></i>是否新能源车？</b>
                </a>
            </li>
            <li class="xqtis">请选择是否是新能源车</li>
            <li class="nobg noIcon" name="Transfer" :class="[isNewCar?hideClass:'']">
                <a href="javascript:void(0);">
                    <div class="sex_btn" style="float: right;" :class="[Transfer?checkedClass:'']" @click="TransferSwitch"></div>
                    <b class="left_tit fontSize_15"><i class="imgBox"></i>是一年内过户的二手车吗？<img src="../../comm/images/icon/help.png" alt="Alternate Text" @click="showTeansferInfo"/></b>
                </a>
            </li>
            <li class="xqtis">请选择是否是过户车</li>
            <li class="TransferDate" :class="[Transfer?showClass:hideClass]">
                <a href="javascript:void(0);">
                    <span class="triggers fontSize_15" data-id="-1">
                        <input type="text" placeholder="请选择过户日期" name="TransferDate" class="input_text fontSize_15" readonly="readonly" v-model.trim="TransferDate" @click="chooseTransferDate">
                    </span>
                    <b class="left_tit fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/date.png" alt="Alternate Text" /></i>过户日期</b>
                </a>
            </li>
            <li name="TransferDate" class="xqtis">请选择过户日期</li>
            <li class="nobg IDCard" :class="[hideIDCard?hideClass:'']">
                <a href="javascript:void(0);">
                    <span class="triggers fontSize_15" :class="[OwnerNo=='请输入车主身份证号'|| OwnerNo==''? '' :activeClass]" v-text='OwnerNo' @click="clickIdCard($event)"></span>
                    <i class="cursor-blink hide"></i>
                    <b class="left_tit fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/identity-card.png" alt="Alternate Text" /></i>身份证号</b>
                </a>
            </li>
            <li class="xqtis">请输入车主身份证号</li>
            <li class="ValidateCode nobg" :class="[showValidateCode?showClass:hideClass]">
                <a href="javascript:void(0);">
                    <span class="triggers fontSize_15" data-id="-1">
                        <input type="text" placeholder="验证码" name="ValidateCode" v-model.trim="verifyCode" class="input_text uppercase fontSize_15" style="width: 60%;" maxlength="4">
                        <span style="float: right;">
                            <img id="validateCodePic" style="height: 0.81rem; width: 2.11rem; padding-top: 0.333333rem" src="../../comm/images/icon/Back-Arrow-wight.png" @click="getValidateCode"/>
                        </span>
                    </span>
                    <b class="left_tit fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/yanzhengma.png" alt="Alternate Text" /></i>验证码</b>
                </a>
            </li>
            <li id="vcTip" class="xqtis" :class="[showValidateCode?showClass:hideClass]">请输入验证码</li>
            <li class="" :class="[ShortEName == 'PICC' ? '':hideClass]">
                <a href="javascript:void(0);" style="padding-left: 4.113333rem;">
                    <span class="triggers fontSize_15" data-id="-1">
                        <input type="text" placeholder="请选择商业险起保日期" name="shyDate" class="input_text fontSize_15" readonly="readonly" v-model.trim="shy_date" @click="chooseSHYDate">
                    </span>
                    <b class="left_tit fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/date.png" alt="Alternate Text" /></i>商业险起保日期</b>
                </a>
            </li>
            <li name="shyDate" class="xqtis">请选择商业险起保日期</li>
            <li class="" :class="[ShortEName == 'PICC' ? '':hideClass]">
                <a href="javascript:void(0);" style="padding-left: 4.113333rem;">
                    <span class="triggers fontSize_15" data-id="-1">
                        <input type="text" placeholder="请选择交强险起保日期" name="jqDate" class="input_text fontSize_15" readonly="readonly" v-model.trim="jq_date" @click="chooseJQDate">
                    </span>
                    <b class="left_tit fontSize_15"><i class="imgBox">
                        <img src="../../comm/images/icon/date.png" alt="Alternate Text" /></i>交强险起保日期</b>
                </a>
            </li>
            <li name="jqDate" class="xqtis">请选择交强险起保日期</li>
        </ul>
        <div class="modular" name="insuredInfo" :class="[ShortEName == 'PICC' ? '':hideClass]">
            <h3 class="t_tit fontSize_15">被保人信息 <span class="fontSize_12" style="color: #999;">(享有保险金请求权)</span><span class="infoFastBtn fontSize_14" @click='insuredSameOwner'>被保人即车主 <em class="checkBtn" :class="[isSameOwner?checkedClass:'']"></em></span></h3>
            <ul class="fromList checkApp clearfix mar_bot_20" :class="[isSameOwner?hideClass:showClass]">
                <li class="nobg">
                    <a href="javascript:void(0);">
                        <span class="triggers  fontSize_15" data-id="-1">
                            <input type="text" placeholder="请输入被保人姓名" maxlength="15" class="input_text fontSize_15" name="Name" v-model.trim="InsuredName" @input="sameName">
                        </span>
                        <b class="left_tit  fontSize_15"><i class="imgBox">
                            <img src="../../comm/images/icon/name.png" alt="Alternate Text" /></i>被保人</b>
                    </a>
                </li>
                <li class="xqtis"></li>
                <!--证件号-->
                <li class="nobg b_IdVal">
                    <a href="javascript:void(0);">
                        <span class="triggers fontSize_15" :class="[b_IdVal=='请输入被保人身份证号'|| b_IdVal==''? '' :activeClass]" v-text="b_IdVal" @click="clickBVal($event)"></span>
                        <i class="cursor-blink hide"></i>
                        <b class="left_tit  fontSize_15"><i class="imgBox">
                            <img src="../../comm/images/icon/identity-card.png" alt="Alternate Text" /></i>身份证号</b>
                    </a>
                </li>
                <li class="xqtis"></li>
            </ul>
        </div>
        <div class="submit_btn_box">
            <a href="javascript:void(0);" class="submit_btn fontSize_16" @click='onSubmit'>去报价</a>
        </div>
    </div>
    <div class="uploadMain">
        <h3 class="fontSize_16">拍摄获取行驶证相关信息</h3>
        <img src="http://192.168.145.9:8013/jinrong/assets/insurance.m/comm/images/xingshizheng01.html.png" alt="Alternate Text" />
        <p class="fontSize_13">1、调整拍摄角度，避免反光影响</p>
        <p class="fontSize_13">2、确保图像清晰，可以提高识别正确率</p>
    </div>
    <div class="PatternSample_box" :class="[showCarImg?showClass:hideClass]" @click='seeCarImg()'>
        <div class="main">
            <h3 class="fontSize_16">行驶证信息实例</h3>
            <p class="fontSize_13">请对照红框选择区域进行填写</p>
            <img src="http://192.168.145.9:8013/jinrong/assets/insurance.m/comm/images/xingshizheng02.html.png" class="old" alt="图样示例" :class="[isNewCar?hideClass:'']"/>
            <img src="http://192.168.145.9:8013/jinrong/assets/insurance.m/comm/images/PatternSample_new.html.png" class="new" alt="图样示例" :class="[isNewCar?'':hideClass]"/>
            <a href="javascript:void(0);" @click='seeCarImg()'><i class="icon i33" @click='seeCarImg()'></i></a>
        </div>
        <div class="mark"></div>
    </div>
    <div class="alert_box code_alert">
        <div class="alert_mark"></div>
        <div class="alert_info">
            <div class="alert_title fontSize_15 show">验证手机号</div>
            <div class="alert_info_box">
                <div class="info_main">
                    <div class="code_inp_box">
                        <input type="text" name="code" maxlength="6" data-bind="value: verifyCode, attr: { placeholder: mantissaPlaceholder }" class="input_text fontSize_13" placeholder="请输入验证码" /></div>
                    <input type="button" name="name" value="获取验证码" class="code_btn fontSize_15" />
                </div>
            </div>
            <div class="bottom edit">
                <a href="javascript:void(0)" name="verifyCode" class="btn btn_save fontSize_15">确认</a>
                <a href="javascript:void(0)" name="verifyCode" class="btn edit_btn btn_no fontSize_15">取消</a>
            </div>
        </div>
    </div>
</template>
<script>
// import '../../comm/script/check.js';
import ifvisible from '../../comm/script/ifvisible.js';
import '../../comm/script/date.js';
import '../../comm/script/scrollselect.js';
import '../../comm/script/searchCar.js';
import '../../comm/script/ajaxfileupload.js';
/*APP判断*/
export default {
  data () {
    return {
        fromValue:(comm.getUrlParam('yxms') && comm.getUrlParam('yxms') != 'null' && comm.getUrlParam('yxms') != null) ? comm.getUrlParam('yxms') : '',
        showClass:'show',
        hideClass:'hide',
        checkedClass:'checked',
        activeClass:'active',
        newCarClass:'new',
        oldCarClass:'old',
        isNewCar:false,
        ShortEName:comm.getUrlParam('ShortEName'),
        SessionId:'',
        FrameNum:'',//车架号
        EngineNo:'',//发动机号
        BrandModel:'',//品牌型号
        ConfigModel:'请输入配置型号',//配置型号
        FirstRegisterDate:'',//注册日期
        isNewEnergy:false,//是否是新能源车
        hideNewEnergy:true,//是否显示新能源车
        Transfer:false,//是否是过户车
        showTransfer:true,//是否显示过户车
        OwnerNo:'请输入车主身份证号',//车主身份证号
        verifyCode:'',//验证码
        shy_date:'',//商业险生效日期
        jq_date:'',//交强险生效日期
        isSameOwner:true,//被被人信息是否同车主
        InsuredName:'',//被保人姓名
        b_IdVal:'请输入被保人身份证号',//被保人身份证号
        showValidateCode:false,//是否显示验证码
        showDate:true,
        showCarImg:false,
        ComCode:'',
        juGift:false,
        VehicleOwnerIDNumber:'',//存储被保人身份证号
        LicensePlateCode:'',
        CityId:'',
        CityName:'',
        ProvinceId:'',
        xubao:(comm.getCookie('xubao') == 'true' && comm.getCookie('xubao')) ? true : false,
        xubaoFrameNumID:false,
        xubaoEngineNoID:false,
        FieldOrderId:'',//按字段保存id
        orderId:comm.getUrlParam('orderId'),//订单ID
        CooperateId:'',
        vehicleModel:'',//车型ID
    }
  },
  components: {
  },
  methods:{
    init:function(){
        var $that = this;
        this.ShortEName == 'CCIC' || this.ShortEName == 'CIC' ? this.showDate =false:this.showDate=true;
        this.setData();
        this.animatePhoto();
        this.uploadFun();
        $('#FrameNumID,#EngineNoID').on('inputchange',function(){
            console.log($that.FrameNum)
            var postObj = {
                VinNo:$that.FrameNum.length == 17?($that.FrameNum.indexOf('*') >=0 ? $that.VinNo : $that.FrameNum):'',
                url:'/InsuranceApi/SelectCarModels2',//查询车型代码ajax请求路径
                SessionId:$that.SessionId,
                CityId:$that.CityId,
                orderId:$that.orderId,
                errorFun:function(res){
                    console.log(res.Message)
                    if(res.Message == 'E8' && $that.vehicleModel == ''){
                        // $('.pop_alert p').text('查无对应车型，请检查车架号是否正确');
                        // $('.pop_alert').show().delay(3000).fadeOut();
                        $('.uploadPopMian span').text('查无对应车型，请检查车架号是否正确');
                        $(".uploadPopMian").show().delay(3000).fadeOut();
                    }
                }
            };
            if($that.ShortEName == 'CPIC'){
                if($that.ProvinceId == '370000' && $that.CityId != '370200'){
                    if(checkInputVal($('#FrameNumID'))&&checkInputVal($('#EngineNoID'))){
                        $that.getBrandModel(postObj);
                    }
                }
            }else if($that.ShortEName == 'CIC' && checkInputVal($('#FrameNumID'))&&checkInputVal($('#EngineNoID'))){
                $that.getBrandModel(postObj);
            }
        });
        $('.photoBox').click(function(){
            if($(this).hasClass('active')){
                $(this).removeClass('active');
                $('.uploadMain').fadeOut();
            }else{
                $(this).addClass('active');
                $('.uploadMain').fadeIn();
            }
        });
        $('.uploadMain').click(function(){
            $('.photoBox').removeClass('active');
            $('.uploadMain').fadeOut();
        });
    },
    setData: function() {
        var $that = this;
        $that.SessionId = comm.getUrlParam('SessionId');
        if(comm.getCookie('ComCode')) $that.ComCode = comm.getCookie('ComCode');
        if ($that.ShortEName == 'CCIC' || $that.ShortEName == 'AXATP') {
            $that.juGift = true;
        }
        $('.SOSBtn a').attr('href','tel:'+comm.companyTel($that.ShortEName).tel);
        if($that.ShortEName == 'PICC'){
            $that.fillInsuredInfo();
        }
        var _data = {
            orderId: $that.orderId,
            ShortEName: $that.ShortEName
        };
        if($that.orderId == 'null' || $that.orderId == null || !$that.orderId){
            return false;
        }
        Store.GetInsuranceBasicInfo(_data).then(function (data) {
            if (data.Result) {
                var mydata = data.Data;
                $that.OwnerName = mydata.Name;
                $that.LicensePlateCode = mydata.LicenseNumber;
                $that.CityId = mydata.VehicleCityId;
                $that.CityName = mydata.CityName;
                $that.ProvinceId = mydata.VehicleCityId.substring(0,2)+'0000';
                $that.isNewCar = mydata.NoLicenseFlag;
                $that.OwnerPhone = mydata.Phone;
                $that.FirstRegisterDate = mydata.FirstRegisterDate; //初登日期
                $that.SessionId = mydata.SessionId;
                $that.isNewEnergy = mydata.IsNewEnergy;//是否能源车
                $that.TransferDate = mydata.TransferLicenceDate; //过户日期
                if ($that.isNewEnergy == 1) {
                    $that.hideNewEnergy = false;
                    $that.isNewEnergy = false;
                }else{
                    $that.hideNewEnergy = true;
                    $that.isNewEnergy = true;
                }
                if($that.xubao && $that.xubao == 'true'){
                    if(mydata.VIN && mydata.VIN != 'null' && mydata.VIN != '' ){
                        // $('input#FrameNumID').attr('readonly','readonly');
                        // $('#FrameNumID').attr('name','FrameNum1');
                        $that.xubaoFrameNumID = true;
                        $('#FrameNumID').attr('readonly','readonly');
                        $that.frameNo = mydata.VIN;
                        var VIN= mydata.VIN;//车架号
                        var newVIN = VIN.substring(0,10)+'****'+VIN.substring(14,17);//加密车架号
                        if($that.ShortEName == 'AXATP'){
                            $that.FrameNum = $that.frameNo; //车架号
                            $('input').unbind();
                        }else{
                            $that.FrameNum = newVIN; //车架号
                        }
                    }else{
                        $that.xubaoFrameNumID = false;
                        $('#FrameNumID').removeAttr('readonly');
                    }
                    if(mydata.EngineNumber && mydata.EngineNumber!= 'null' && mydata.EngineNumber!= ''){
                        $that.xubaoEngineNoID = true;
                        $('#EngineNoID').attr('readonly','readonly');
                        $that.VehicleOwnerIDNumber = mydata.OwnerIdNo;
                        var EngineNumberCode = '';
                        for(var i=0;i<EngineNumber.length-4;i++){
                            EngineNumberCode+='*';
                        }
                        var newEngineNumber = EngineNumber.substring(0,2)+EngineNumberCode+EngineNumber.substring(EngineNumber.length-2);//
                        if($that.ShortEName == 'AXATP'){
                            $that.EngineNo = $that.engineNo; //发动机号
                            $('input').unbind();
                        }else{
                            $that.EngineNo = newEngineNumber; //发动机号
                        }
                    }else{
                        $that.xubaoEngineNoID = true;
                        $('#EngineNoID').removeAttr('readonly');
                    }
                    if(mydata.OwnerIdNo && mydata.OwnerIdNo !=''&&mydata.OwnerIdNo !='null'){
                        $that.VehicleOwnerIDNumber = mydata.OwnerIdNo;
                        var VehicleOwnerIDNumber = mydata.OwnerIdNo;//身份证号
                        var newVehicleOwnerIDNumber = VehicleOwnerIDNumber.substring(0,10)+'****'+VehicleOwnerIDNumber.substring(14);//加密身份证号
                        $that.OwnerNo = newVehicleOwnerIDNumber;//身份证号
                    }else{
                        $that.OwnerNo = '请输入车主身份证号';
                    }
                    if($that.ShortEName == "PICC" && mydata.InsuredIdNo && mydata.InsuredIdNo !=''&&mydata.InsuredIdNo !='null'){
                        $that.b_IdVal = mydata.InsuredIdNo;
                        var InsuredIdNo = mydata.InsuredIdNo;//身份证号
                        var newInsuredIdNo = InsuredIdNo.substring(0,10)+'****'+InsuredIdNo.substring(14);//加密身份证号
                        $that.b_IdVal = newInsuredIdNo;//身份证号
                    }else{
                        $that.b_IdVal = '请输入被保人身份证号'
                    }
                    $that.InsuredName = mydata.InsuredName;//被保人姓名
                    $that.vehicleModel = mydata.VehicleModelNameID; //车型ID
                    $that.ConfigModel = mydata.VehicleModelName; //配置型号
                    $that.BrandModel = mydata.VehicleModelName; //品牌型号
                    $that.ExhaustCapacity = mydata.ExhaustCapacity;
                    $that.ModelYear = mydata.ModelYear;
                    $that.VehicleFamily = mydata.VehicleFamily;
                    $that.VehicleBrand = mydata.VehicleBrand;
                    $that.VehiclePrice = mydata.VehiclePrice;
                    $('.submit_btn').removeClass('back_gray');
                    if($that.ShortEName == "PICC"){
                        $that.isInsuredInfoSameOwner();
                        $that.shy_date = mydata.bizBeginDate;
                        $that.jq_date = mydata.forceBeginDate;
                    }
                }else{
                    $that.xubaoFrameNumID = false;
                    $that.xubaoEngineNoID = false;
                    $('input#FrameNumID,input#EngineNoID').removeAttr('readonly');//,input#OwnerNo
                    if (comm.getUrlParam('orderId')!= undefined && comm.getUrlParam('orderId') != 'undefined'&& comm.getUrlParam('orderId') != 'null'&& comm.getUrlParam('orderId') != null) {//如果是用户从报价页面返回
                        $that.EngineNo = mydata.EngineNumber; //发动机号
                        $that.engineNo = mydata.EngineNumber;
                        $that.FrameNum =mydata.VIN; //发动机号
                        $that.frameNo = mydata.VIN;
                        $that.Transfer = mydata.IsTransfer; //是否过户车
                        $that.TransferDate = mydata.TransferLicenceDate; //过户日期
                        $that.OwnerName = mydata.Name;
                        $that.OwnerNo = (mydata.OwnerIdNo != '') ?mydata.OwnerIdNo:'请输入车主身份证号';
                        $that.InsuredName = mydata.InsuredName;//被保人姓名
                        $that.b_IdVal = mydata.InsuredIdNo != '' ?mydata.InsuredIdNo:'请输入被保人身份证号';//被保人证件号
                        $that.ExhaustCapacity = mydata.ExhaustCapacity;
                        $that.ModelYear = mydata.ModelYear;
                        $that.VehicleFamily = mydata.VehicleFamily;
                        $that.VehicleBrand = mydata.VehicleBrand;
                        $that.VehiclePrice = mydata.VehiclePrice;
                        if (mydata.VehicleModelName) {
                            $that.vehicleModel = mydata.VehicleModelNameID; //车型ID
                            var index = mydata.VehicleModelName.indexOf(' ');
                            var brandmodel = mydata.VehicleModelName != '' ? mydata.VehicleModelName.substr(0, index) : '';
                            $that.ConfigModel = mydata.VehicleModelName; //配置型号
                            $that.BrandModel = brandmodel; //品牌型号
                            // $('.configModel').show();
                        }
                        if (mydata.Seats && mydata.Seats != 'undefined' && mydata.Seats != 'null') {
                            $that.Seats = mydata.Seats;
                            comm.setCookie('seatsNum', mydata.Seats);
                        } else if (comm.getCookie('seatsNum') && comm.getCookie('seatsNum') != 'undefined' && comm.getCookie('seatsNum') != 'null') {
                            $that.Seats = comm.getCookie('seatsNum');
                        } else {
                            $that.Seats = '';
                        }
                        $that.getValidateCode();//江苏地区验证码
                        $('.submit_btn').removeClass('back_gray');
                        if($that.ShortEName == "PICC"){
                            $that.isInsuredInfoSameOwner();
                            $that.shy_date = mydata.bizBeginDate;
                            $that.jq_date = mydata.forceBeginDate;
                        }
                    } else {//获取用户的历史信息
                        $that.getHistoryInfo(mydata);
                    }
                }
                $that.pageCtrl();//
                $that.DetectPageStatus(300);//检测用户是否在操作页面 -- 300
                $that.setInter();
                $that.saveSendData();
                $that.showNewEnergy();
                $that.wechatShare();//微信分享
            }
        });
    },
    wechatShare:function(){
        var $that = this;
        if ($that.ShortEName == "AXATP") {
            var host = window.location.host;
            var myprotocol = window.location.protocol;
            var config = {};
            config.SkipUrl = myprotocol + "//" + host + '/InsureApi/UserBasicInfo?ShortEName=' + $that.ShortEName;// 分享的网页链接
            if ($that.yxms) {
                config.SkipUrl += "&yxms=" + $that.yxms;
            }
            config.Title = "好司机，省到底，我是安盛天平车险，在chexian.com等你！";
            config.Detail = "安盛天平，风险更低，价格更低！";
            config.ImageUrl = APIURL + "/images/insurance/pic300.jpg"// 图片
            comm.customWXShare(config);
        } else {
            comm.setWXShare();//微信分享
        }
    },
    goReturn:function(){
        var $that = this;
        comm.setCookie('orderid',$that.orderId)
        window.history.go(-1);
    },
    closeTip:function(){
        $('.uploadPopMian').hide();
    },
    showNewEnergy:function(){
        var $that = this;
        //如果车牌号为8位，显示是否新能源选择
        if ($that.LicensePlateCode.length==8) {
            $that.hideNewEnergy = false;
        }
    },
    saveSendData:function(){
        var $that = this;
        $('input').on('inputchange',function(){
            if($(this).attr('name') == 'searchInput') return false;
            if($(this).attr('name') == 'EngineNo') return false;
            if($(this).attr('name') == 'FrameNum') return false;
            if(checkInputVal($(this))){
                if($that.oldObj){
                    $that.newObj = $that.getSaveData();
                    var isChange = comm.findChange($that.newObj,$that.oldObj);
                    if(isChange){
                        $that.sendAjax();
                    }
                }else{
                    $that.oldObj = $that.getSaveData();
                    $that.sendAjax();
                }
            }
        });
        //重置inputchange事件
        $('input').on('blur',function(e){
            if($(this).attr('name') != 'searchInput'){
                if(checkInputVal($(this))){
                    if($that.oldObj){
                        $that.newObj = $that.getSaveData();
                        var isChange = comm.findChange($that.newObj,$that.oldObj);
                        if(isChange){
                            $that.sendAjax();
                            $that.oldObj=$that.getSaveData();
                        }
                    }else{
                        $that.oldObj = $that.getSaveData();
                        $that.sendAjax();
                    }
                }
            }
            // $(this).unbind('inputchange');
        });
        $('input[name=ConfigModel],input[name=FirstRegisterDate],input[name=NewCarFirstRegisterDate],input[name=BrandModel]').on('inputchange',function(e){//配置型号改变时
            if($that.oldObj){
                $that.newObj = $that.getSaveData();
                var isChange = comm.findChange($that.newObj,$that.oldObj);
                if(isChange){
                    $that.sendAjax();
                }
            }else{
                $that.oldObj = $that.getSaveData();
                $that.sendAjax();
            }
        });
    },
    animatePhoto:function(){//相机旋转
        var $that = this;
        // 在前面显示的元素，隐藏在后面的元素
        var eleBack = null, eleFront = null,
            // 纸牌元素们
            eleList = $(".photoList");
        if(eleList.length == 0) return false;
        // 确定前面与后面元素
        $that.funBackOrFront = function () {
            eleList.each(function () {
                if ($(this).hasClass("out")) {
                    $that.eleBack = $(this);
                    $(this).siblings().removeClass('out').addClass('in');
                } else {
                    $that.eleFront = $(this);
                }
            });
        };
        $that.funBackOrFront();
        $that.animatePhotoINterVal = setInterval(function () {
            // 切换的顺序如下
            // 1. 当前在前显示的元素翻转90度隐藏, 动画时间225毫秒
            // 2. 结束后，之前显示在后面的元素逆向90度翻转显示在前
            // 3. 完成翻面效果
            $($that.eleFront).addClass("out").removeClass("in");
            setTimeout(function () {
                $($that.eleBack).addClass("in").removeClass("out");
                // 重新确定正反元素
                $that.funBackOrFront();
            }, 200);
            return false;
        }, 1000);
    },
    pageCtrl: function() {
        var $that = this;
        //大地、安盛北京、上海之外隐藏身份证号
        if ($that.ShortEName == 'AXATP') {
            if ($that.CityId != '110100' && $that.CityId != '310100') {
                $that.hideIDCard = true;
            }
        }
        if ($that.ShortEName == 'CPIC'){
            $that.hideIDCard = true;//太保身份证号放在第一页了
        }
    },
    getBranchCode: function () {//分公司代码
        var $that = this;
        if ($that.CityId == '320200') {
            return "3020300";//无锡
        }
        else if ($that.CityId == '320400') {
            return "3020400";//常州
        }
        else if ($that.CityId == '320500') {
            return "3110100";//苏州
        } else {
            return "3020100";//江苏
        }
    },
    getValidateCode: function() { //获取验证码
        var $that = this;
        //新车和外地车不需要填验证码
        var plateNo = $that.LicensePlateCode;
        if (comm.isContains(plateNo, '苏') && !comm.isContains(plateNo, '*') && $that.CityId && $that.CityId.substr(0, 2) == '32') {
            var carVin = $that.FrameNum.Trim().toUpperCase().indexOf('*')>=0 ? $that.frameNo : $that.FrameNum.Trim().toUpperCase();//车架号
            var engineNo = $that.EngineNo.Trim().toUpperCase().indexOf('*')>=0 ? $that.engineNo : $that.EngineNo.Trim().toUpperCase();//发动机号
            if (carVin != '') {
                if ($that.ShortEName == 'CPIC') {//太保
                    var branchCode = $that.getBranchCode();//分公司代码
                    if (branchCode != '') {
                        $that.showValidateCode = true;
                        var currentTime = new Date().getTime();
                        $that.random = currentTime;
                        var url = 'http://www.ecpic.com.cn/cpiccar/sale/ortherPartner/generateCaptchaP09' + '?plateNo=' + encodeURI(encodeURI(plateNo)) + '&carVin=' + carVin + '&branchCode=' + branchCode + '&random=' + currentTime;
                        $('#validateCodePic').attr('src', url);
                    }
                } else if ($that.ShortEName == 'YGBX' && engineNo != '') {//阳光
                    $that.showValidateCode =true;
                    $that.getAgencyCode();
                }
                //清空验证码
                $that.verifyCode('');
            } else {
                $('#vcTip').innerHTML = '请输入车架号、发动机号';
            }
        }
    },
    getAgencyCode: function () {
        var $that = this;
        Store.GetAgencyCode({gbCode: $that.CityId()}).then(function (data) {
            if(data!=''){
                var agentCode = data;
                var currentTime = new Date().getTime();
                var EngineNo = $that.EngineNo.Trim().toUpperCase().indexOf('*')>=0 ? $that.engineNo : $that.EngineNo.Trim().toUpperCase();//发动机号
                var FrameNum = $that.FrameNum.Trim().toUpperCase().indexOf('*')>=0 ? $that.frameNo : $that.FrameNum.Trim().toUpperCase();//车架号
                var url = 'http://chexian.sinosig.com/Net/netCarInfoControl!getVerificationCodeForInterface.action?frameNo=' + FrameNum + '&engineNo=' + EngineNo + '&license=' + encodeURIComponent($that.LicensePlateCode) + '&agentCode=' + agentCode + '&random=' + currentTime;
                $('#validateCodePic').attr('src', url);
            }
        });
    },
    seeCarImg:function(){//查看示例
        var $that = this;
        if ($that.showCarImg) {
            $that.showCarImg = false;
        } else {
            $that.showCarImg = true;
        }
    },
    fillInsuredInfo:function(){//被保人同步车主信息
        var $that = this;
        $that.InsuredName = $that.OwnerName;
        if($that.OwnerNo.indexOf('*') >= 0 ){
            $that.b_IdVal = $that.VehicleOwnerIDNumber;
        }else{
            $that.b_IdVal = $that.OwnerNo;
        }
    },
    clearInsuredInfo: function () {//清空被保人信息
        var $that = this;
        $that.InsuredName = '';
        $that.b_IdVal = '请输入被保人身份证号';
    },
    isInsuredInfoSameOwner:function(){
        var $that = this;
        if($that.OwnerName == $that.InsuredName && $that.OwnerNo==$that.b_IdVal) {
            //同
            $that.isSameOwner = true;
        } else {
            $that.isSameOwner = false;
        }
    },
    DetectPageStatus:function(time){//检测用户是否在操作页面  time-空闲多长时间
        var $that = this;
        ifvisible.ifvisible.setIdleDuration(time);
        ifvisible.ifvisible.on('statusChanged', function(e){
            // console.log(e.status)
            if(e.status == 'idle' && $('.info_box').is(':visible')){
                //发送短信  参数 ---- mobile：手机号   smsType:发送类型  companyName：中文保险公司名
                // 【详细信息页】，离开5分钟未操作
                var _data = {
                    'mobile':$that.OwnerPhone,//手机号
                    'smsType':2,//发送类型
                    'companyName':comm.getCompanyName($that.ShortEName),//发送类型
                    from:$that.fromValue
                };
                Store.SendMessage(_data).then(function (res) {console.log(res)});
            }

        });
    },
    setInter:function(){
        var $that = this;
        $that.repeat;
        $that.repeat = setInterval(function(){
            if($that.oldObj){
                $that.newObj = $that.getSaveData();
                var isChange = comm.findChange($that.newObj,$that.oldObj);
                if(isChange){
                    $that.sendAjax();
                }
            }else{
                $that.oldObj = $that.getSaveData();
            }
        },600000);//600000
    },
    getSaveData:function(){
        var $that =this;
        var data = {};
        data.ShortEName = $that.ShortEName;
        data.OrderID = $that.orderId;
        data.VehicleFrameNo = checkInputVal($('#FrameNumID')) ? ($that.FrameNum.Trim().toUpperCase().indexOf('*')>=0 ? $that.frameNo : $that.FrameNum.Trim().toUpperCase()):''; //车架号
        data.EngineNo = checkInputVal($('#EngineNoID')) ? ($that.EngineNo.Trim().toUpperCase().indexOf('*')>=0 ? $that.engineNo : $that.EngineNo.Trim().toUpperCase()):''; //发动机号
        data.SpecialCarFlag = $that.Transfer?'1':'0'; //是否过户车
        data.SpecialCarDate = checkInputVal($('input[name=TransferDate]')) ? $that.TransferDate:''; //过户日期
        data.VehicleId = $that.vehicleModel; //车型ID
        data.Seats = $that.Seats;
        data.VehicleModelName =  checkInputVal($('input[name=BrandModel]')) ? $that.ConfigModel:''; //品牌型号BrandModel(传配置型号)
        data.FirstRegisterDate = checkInputVal($('input[name=FirstRegisterDate]')) ? $that.FirstRegisterDate:''; //初登日期
        data.OwnerIdNo = $that.hideIDCard?'':($that.OwnerNo.indexOf('*')>=0 ?(isCardID1($that.OwnerNo) == true?$that.VehicleOwnerIDNumber:''):(isCardID($that.OwnerNo) == true?$that.OwnerNo:''));
        data.CityName = $that.CityName;
        data.FieldOrderId = $that.FieldOrderId;
        data.IsMobile=1;
        data.InsuredName = $that.InsuredName == null ? '' : $that.InsuredName.Trim();//被保人姓名
        data.InsuredCertifyNo = $that.ShortEName == 'PICC'?($that.b_IdVal.indexOf('*')>=0 ?(isCardID1($that.b_IdVal) == true?$that.b_IdVal:''):(isCardID($that.b_IdVal) == true?$that.b_IdVal:'')):'';
        data.From = $that.fromValue;
        data.ExhaustCapacity = $that.ExhaustCapacity;
        data.ModelYear = $that.ModelYear;
        data.VehicleFamily = $that.VehicleFamily;
        data.VehicleBrand = $that.VehicleBrand;
        data.VehiclePrice = $that.VehiclePrice;
        data.IsNewEnergy = $that.hideNewEnergy?0:($that.isNewEnergy ?1 :0);
        return data;
    },
    getPostData: function () {
        var $that = this;
        var data = {};
        data.ShortEName = $that.ShortEName;
        data.OrderID = $that.orderId;
        data.EngineNo = $that.EngineNo.Trim().toUpperCase().indexOf('*') >= 0 ? $that.engineNo : $that.EngineNo.Trim().toUpperCase(); //发动机号
        data.VehicleFrameNo = $that.FrameNum.Trim().toUpperCase().indexOf('*') >= 0 ? $that.frameNo : $that.FrameNum.Trim().toUpperCase(); //发动机号
        data.OwnerIdNo = $that.hideIDCard?'':($that.OwnerNo.indexOf('*')>=0 ?(isCardID1($that.OwnerNo) == true?$that.VehicleOwnerIDNumber:''):(isCardID($that.OwnerNo) == true?$that.OwnerNo:''));
        data.SpecialCarFlag = $that.Transfer ? '1' : '0'; //是否过户车
        if (data.SpecialCarFlag == '1')
            data.SpecialCarDate = $that.TransferDate; //过户日期
        else
            data.SpecialCarDate = ""; //过户日期
        data.VehicleId = $that.vehicleModel; //车型ID
        data.Seats = $that.Seats;
        data.VehicleModelName = $that.ConfigModel; //品牌型号BrandModel(传配置型号)
        data.FirstRegisterDate = $that.FirstRegisterDate; //初登日期
        data.CityName = $that.CityName;
        data.IsNewEnergy = $that.hideNewEnergy?0:($that.isNewEnergy ?1 :0);
        data.OcrID=$that.CooperateId;
        data.InsuredName = $that.InsuredName == null? '' : $that.InsuredName.Trim();//被保人姓名
        data.InsuredCertifyNo = $that.ShortEName == 'PICC'?($that.b_IdVal.indexOf('*')>=0 ?(isCardID1($that.b_IdVal) == true?$that.b_IdVal:''):(isCardID($that.b_IdVal) == true?$that.b_IdVal:'')):'';
        data.From = $that.fromValue;
        data.ExhaustCapacity = $that.ExhaustCapacity;
        data.ModelYear = $that.ModelYear;
        data.VehicleFamily = $that.VehicleFamily;
        data.VehicleBrand = $that.VehicleBrand;
        data.VehiclePrice = $that.VehiclePrice;
        data.bizBeginDate = $that.ShortEName == 'PICC'?$that.shy_date:'';
        data.forceBeginDate = $that.ShortEName == 'PICC'?$that.jq_date:'';
        return data;
    },
    saveData: function() {
        var $that = this;
        var data = {
            CityId: $that.CityId,
            //配送城市
            CityName: $that.CityName,
            //配送城市
            SessionId: $that.SessionId,
            //
            OwnerName: $that.OwnerName,
            //车主姓名
            OwnerNo: $that.OwnerNo,
            //车主证件号
            OwnerPhone: $that.OwnerPhone,
            //车主电话
            InsuredIDNo: $that.b_IdVal,
            //被保人证件号
            InsuredPhone: $that.beibaorenTel,
            //被保人电话
            AddresseeName: $that.addresseeName,
            //配送人
            AddresseePhone: $that.addresseeTel,
            //配送电话
            ProvinceId: $that.addresseeProvinceId,
            //省id
            AddresseeDetails: $that.addresseeDetails,
            //详细地址
            isInsuredReadonly: $that.isInsuredReadonly
        };
        comm.mySetCookie('basicInfo', $toJsonString(data));
        //图片验证码
        if ($that.showValidateCode) {
            comm.mySetCookie('validateCode',$toJsonString({
                random: $that.random,
                validateCode: $that.verifyCode.toUpperCase()
            }));
        } else {
            comm.mySetCookie('validateCode', '');
        }
    },
    sendAjax:function(){
        var $that = this;
        var _data = $that.getSaveData();
        $that.oldObj = _data;
        Store.SaveFieldVehicleInfo(_data).then(function (res) {
            if(res.Result){
                $that.FieldOrderId = res.Data.OrderId;
            }
        });
    },
    searchCarType: function() {
        var $that = this;
        mqq.ui.setTitleButtons({
            left: {
                title: '返回',
                callback: function() {
                    $(window).scrollTop($that.scroll_t);
                    $('.form_box.info_box').show();
                    $('.form_box.search_car').hide();
                    mqq.ui.setTitleButtons({
                        left: {
                            title: '返回',
                            callback: function() {
                                mqq.ui.popBack();
                            }
                        },
                        right: {
                            title: ' '
                        }
                    });
                }
            },
            right: {
                title: ' '
            }
        });
        var postdata ={
            obj: {
                SessionId: $that.SessionId,
                SellerId: "",
                VIN: checkInputVal($('#FrameNumID'),false)? ($that.FrameNum.Trim().toUpperCase().indexOf('*') >=0 ? $that.frameNo : $that.FrameNum.Trim().toUpperCase()):'',
                OrderId:$that.orderId,
                ComCode: $that.CityId,
                SearchCode: $that.searchCode,//输入的搜索字符
                ShortEName: $that.ShortEName,//保险公司简码
                page: 1,//第几页
                pageSize: 1000,//行数
                callback: "jsonp",
                LicenseNumber : $that.LicensePlateCode,//车牌号
                EngineNumber :  checkInputVal($('#EngineNoID'),false)?($that.EngineNo.Trim().toUpperCase().indexOf('*')>=0 ? $that.engineNo : $that.EngineNo.Trim().toUpperCase()):''//发动机号
            }
        };
        if($that.ShortEName == 'CPIC'){
            if($that.ProvinceId == '370000' && $that.CityId != '370200'){
                if(checkInputVal($('#FrameNumID'),true) && checkInputVal($('#EngineNoID'),true)){
                    searchCarFn.searchCar(postdata);
                }
            }else{
                searchCarFn.searchCar(postdata);
            }
        }else if($that.ShortEName == 'CIC'){
            if(checkInputVal($('#FrameNumID'),true) && checkInputVal($('#EngineNoID'),true)){
                searchCarFn.searchCar(postdata);
            }
        }else{
            searchCarFn.searchCar(postdata,$that);
        }
    },
    showTeansferInfo:function(){//显示二手车的定义
        comm.showAlert('若车辆发生所有权变更登记(即过户行为)后，首次使用最新车辆信息投保车险时，请选择过户车！',{text:'朕知道了',title:'什么情况下选过户车?'})
    },
    TransferSwitch: function() { //过户车的切换
        var $that = this;
        if($that.xubao){ return false}
        if ($that.Transfer) {
            $that.Transfer = false;
        } else {
            $that.Transfer = true;
        }
        $('li[name=TransferDate]').hide();
    },
    chooseTransferDate: function() {
        var $that = this;
        var dateInput = $('input[name=TransferDate]');
        if($that.xubao){ return false}
        dateInput.DatePicker({
            date: new Date().daysShift(1),
            minDate: new Date((new Date().getTime()) - 24 * 60 * 60 * 1000 * 455),
            maxDate: new Date(),
            showHour: false,
            moduleTitle: '过户日期',
            onSelectDate: function(aDate) {
                $that.TransferDate = aDate.pattern('yyyy-MM-dd');;
                $('.TransferDate').next('li[class=xqtis]').hide();
                $that.transferDateCheck();
            }
        });
    },
    transferDateCheck: function () {
        var $that = this;
        //过户日期不能小于注册日期
        if ($that.Transfer == 1 || $that.Transfer =="是" || $that.Transfer ) {
            var firstRegisterDate = $that.FirstRegisterDate;//注册日期
            var transferDate = $that.TransferDate;//过户日期
            if (firstRegisterDate && transferDate) {
                if (firstRegisterDate == transferDate) {
                    //提示
                    $(".xqtis").hide();
                    $("li[name='TransferDate']").text("过户日期不能小于注册日期");
                    $("li[name='TransferDate']").css("display", "list-item");
                    $("li[name='TransferDate']").removeClass("hide");
                    return false;
                } else {
                    var res = comm.DateDiff(firstRegisterDate, transferDate);//注册日期大于过户日期false,小于等于是true
                    if (!res) {
                        //提示
                        $(".xqtis").hide();
                        $("li[name='TransferDate']").text("过户日期不能小于注册日期");
                        $("li[name='TransferDate']").css("display", "list-item");
                        $("li[name='TransferDate']").removeClass("hide");
                        return false;
                    } else {
                        $("li[name='TransferDate']").css("display", "none");
                        return true;
                    }
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
    },
    NewEnergySwitch: function () { //新能源车的切换
        var $that = this;
        if($that.xubao){ return false}
            $that.isNewEnergy = !$that.isNewEnergy;
    },
    chooseFirstRegisterDate: function () {//初登日期
        var $that = this;
        var dateInput = $('input[name=FirstRegisterDate]');
        if($that.xubao){ return false}
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
        if($that.xubao){ return false}
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
    chooseSHYDate:function(){
        var $that = this;
        $that.shy_date = new Date((new Date().getTime()) + 24 * 60 * 60 * 1000).pattern('yyyy-MM-dd');
        $('input[name=shyDate]').DatePicker({
              date: new Date().daysShift(1),
              minDate: new Date((new Date().getTime()) + 24 * 60 * 60 * 1000),//new Date((new Date().getTime()) + 24 * 60 * 60 * 1000)
              maxDate: new Date((new Date().getTime()) + 24 * 60 * 60 * 1000 * 90),
              showHour: false,
              moduleTitle: '起保日期',
              onSelectDate: function (aDate) {
                var newDate = aDate.pattern('yyyy-MM-dd');
                $that.shy_date = newDate;
                $('li[name=shyDate]').hide();
              }
          });
    },
    chooseJQDate: function() {
        var $that = this;
        $that.jq_date = new Date((new Date().getTime()) + 24 * 60 * 60 * 1000).pattern('yyyy-MM-dd');
        $('input[name=jqDate]').DatePicker({
          date: new Date().daysShift(1),
          minDate: new Date((new Date().getTime()) + 24 * 60 * 60 * 1000),//new Date((new Date().getTime()) + 24 * 60 * 60 * 1000)
          maxDate: new Date((new Date().getTime()) + 24 * 60 * 60 * 1000 * 90),
          showHour: false,
          moduleTitle: '起保日期',
          onSelectDate: function (aDate) {
            var newDate = aDate.pattern('yyyy-MM-dd');
            $that.jq_date = newDate;
            $('li[name=jqDate]').hide();
          }
        });
    },
    uploadFun:function(){ //上传行驶证
        var $that = this;
        //证件上传
        $("body").unbind('change').on("change", "input[type=file]", function () {
            clearInterval($that.animatePhotoINterVal);
            // funBackOrFront();
            $('.uploadMain').fadeOut();
            //控制上传图片显示
             $.ajaxFileUpload({
                url: APIURL+'/InsuranceApi/UpdateOcr',
                type:'post',
                // secureuri:false,
                data:{
                    file:$(this).attr("id"),
                },
                fileElementId: $(this).attr("id"),
                dataType: 'json',
                success: function (data, status,e) {
                    console.log("成功")
                    console.log(data)
                    $that.animatePhoto();
                    $('.uploadMain').fadeOut();
                    if(data != 'false'){
                        var obj = data;
                        var FirstRegisterDateCheck=false;
                        var FirstRegisterDateVal=false;
                        var BrandModelCheck=false;
                        var BrandModelVal=false;
                        var FrameNumCheck=false;
                        var FrameNumVal=false;
                        var EngineNoCheck=false;
                        var EngineNoVal=false;
                        var TransferDateCheck=false;
                        var TransferDateVal=false;
                        if(obj.Body.ItemAtt){
                            var arr = obj.Body.ItemAtt;
                            for(var i = 0; i < arr.length;i++){
                                if(arr[i].Name == "注册日期"){
                                    if($that.ShortEName != 'CCIC' && $that.ShortEName != 'CIC'){
                                        if(arr[i].Value != null){//注册日期
                                            $that.FirstRegisterDate = arr[i].Value;
                                            FirstRegisterDateVal = true;
                                        }else{
                                            $that.FirstRegisterDate = '';
                                        }
                                        FirstRegisterDateCheck = checkInputVal($('li.FirstRegisterDateLi input:visible'));
                                    }else{
                                        FirstRegisterDateCheck = true;
                                    }
                                }
                                if(arr[i].Name == "品牌型号"){
                                    if(arr[i].Value != null){//品牌型号
                                        $that.BrandModel = arr[i].Value;
                                        $(".search_inp input").val(arr[i].Value.replace("牌", "").Trim());
                                        $that.searchCode = arr[i].Value.replace("牌", "").Trim();
                                        BrandModelVal = true;
                                    }else{
                                        $that.BrandModel = '';
                                        $that.ConfigModel = '';
                                    }
                                    if($that.ConfigModel == ''){
                                        $that.ConfigModel = '请选择配置型号';
                                        $('.configModel span').removeClass('active');
                                    }else{
                                        $('.configModel span').addClass('active');
                                    }
                                    $('.configModel').show();
                                    BrandModelCheck =  checkInputVal($('input[name=BrandModel]'));
                                }else if(arr[i].Name == "车辆识别代号"){
                                    if(arr[i].Value != null){//车辆识别代号
                                        $that.FrameNum = arr[i].Value;
                                        FrameNumVal = true;
                                    }else{
                                        $that.FrameNum = '';
                                    }
                                    FrameNumCheck =  checkInputVal($('input[name=FrameNum]'));
                                }else if(arr[i].Name == "发动机号码"){
                                    if(arr[i].Value != null){//发动机号码
                                        $that.EngineNo = arr[i].Value;
                                        EngineNoVal = true;
                                    }else{
                                        $that.EngineNo = '';
                                    }
                                    EngineNoCheck =  checkInputVal($('input[name=EngineNo]'));
                                }else if(arr[i].Name == "发证日期"){
                                    if(arr[i].Value != null){//发证日期
                                        if($that.FirstRegisterDate != ""){
                                            var TransferDate =new Date(arr[i].Value).getTime();//发证日期
                                            var FirstRegisterDate = new Date($that.FirstRegisterDate).getTime(); //注册日期
                                            var result = (TransferDate - FirstRegisterDate) / (24 * 60 * 60 * 1000);
                                            if( result > 90  &&  result < 365){
                                                $that.Transfer = true;
                                                $that.TransferDate = arr[i].Value;
                                                TransferDateCheck =  checkInputVal($('input[name=TransferDate]'));
                                            }else{
                                                $that.Transfer = false;
                                                $that.TransferDate = '';
                                                TransferDateCheck = true;
                                            }
                                            TransferDateVal = true;
                                        }else{
                                            $that.Transfer = false;
                                            $that.TransferDate = '';
                                            TransferDateCheck = true;
                                        }

                                    }else{
                                        $that.Transfer = false;
                                        $that.TransferDate = '';
                                        TransferDateCheck = true;
                                    }
                                }
                            }
                            if(obj.Head.CooperateId && obj.Head.CooperateId != 'null') {$that.CooperateId = obj.Head.CooperateId.Value};
                        }
                        $that.getValidateCode();
                        if(checkInputVal($('input.FrameNumID')) && FrameNumCheck){
                            $that.vehicleModelQueryLy();
                        }
                        if(BrandModelCheck && FirstRegisterDateCheck && FrameNumCheck && EngineNoCheck && TransferDateCheck){
                            $('.uploadPopMian span').text('以下信息为系统识别，请仔细核对！');
                            $('.uploadPopMian').show();
                        }else{
                            if(BrandModelVal || FirstRegisterDateVal || FrameNumVal || EngineNoVal || TransferDateVal){
                                $('.uploadPopMian span').text('识别信息有误,请核对修改！');
                                $('.uploadPopMian').show();
                            }else{
                                $(".pop_alert p").text('行驶证识别失败，请重新手工填写或重新获取');
                                $(".pop_alert").show().delay(3000).fadeOut();
                            }
                        }
                    }else{
                        $(".pop_alert p").text('行驶证识别失败，请重新手工填写或重新获取');
                        $(".pop_alert").show().delay(3000).fadeOut();
                    }
                },
                error:function(data, status,e){
                    console.log("失败")
                    console.log(e)
                    alert(e)
                }
            });
        });
    },
    vehicleModelQueryLy: function (frameNo) {
        var $that = this;
         var postObj = {
            VinNo:$that.FrameNum.indexOf('*')>=0 ? CarInfo.VinNo : $that.FrameNum,
            url:'/InsuranceApi/SelectCarModels2',//查询车型代码ajax请求路径
            SessionId:$that.SessionId,
            CityId:$that.CityId,
            orderId:$that.orderId,
            ocrVehicleModel:$that.searchCode,
            errorFun:function(res){
                console.log(res.Message)
                console.log($that.vehicleModel)
                if(res.Message == 'E8' && $that.vehicleModel == ''){
                    // $('.pop_alert p').text('查无对应车型，请检查车架号是否正确');
                    // $('.pop_alert').show().delay(3000).fadeOut();
                    $('.uploadPopMian span').text('查无对应车型，请检查车架号是否正确');
                    $(".uploadPopMian").show().delay(3000).fadeOut();
                }
            }
        };
        this.getBrandModel(postObj);
    },
    getBrandModel: function(obj) { //力扬车型分析  --VehicleModelQueryLy(string vin)
        var $that = this;
        Store.VehicleModelQueryLy({'vin': obj.VinNo}).then(function (res ) {
            if (res.Result) {
                $("#searchInput").val(res.Data);
                var postdata = {
                    searchCodes: res.Data,
                    ocrVehicleModel: obj.ocrVehicleModel?obj.ocrVehicleModel:'',
                    SessionId: $that.SessionId,
                    SellerId: "",
                    VIN: $that.FrameNum.Trim().toUpperCase().indexOf('*')>=0 ? $that.frameNo : $that.FrameNum.Trim().toUpperCase(),
                    OrderId:$that.orderId,
                    ComCode: $that.CityId,
                    SearchCode: $that.searchCode,//输入的搜索字符
                    ShortEName: $that.ShortEName,//保险公司简码
                    page: 1,//第几页
                    pageSize: 1000,//行数
                    callback: "jsonp"
                };
                if (res.Data && res.Data != "") {
                    if($that.ShortEName == 'CPIC' && checkInputVal($('#EngineNoID'))){
                        if($that.ProvinceId == '370000' && $that.CityId != '370200'){
                            postdata.LicenseNumber = $that.LicensePlateCode;//车牌号
                            postdata.EngineNumber =  $that.EngineNo.Trim().toUpperCase().indexOf('*')>=0 ? $that.engineNo : $that.EngineNo.Trim().toUpperCase();//发动机号
                        }
                    }else if($that.ShortEName == 'CIC' && checkInputVal($('#FrameNumID')) && checkInputVal($('#EngineNoID'))){
                        postdata.LicenseNumber = $that.LicensePlateCode;//车牌号
                        postdata.EngineNumber =  $that.EngineNo.Trim().toUpperCase().indexOf('*')>=0 ? $that.engineNo : $that.EngineNo.Trim().toUpperCase();//发动机号
                    }
                    $that.searchCode = res.Data;
                    searchCarFn.searchCarFun({
                        url: obj.url,
                        obj: postdata,
                        loadding: false,
                        hideError:true,
                        codeArr:res.Data,
                        chooseBranObj:{
                            url: '/InsureApi/SelectCarModels',
                            obj:{
                                SessionId: $that.SessionId,
                                SellerId: "",
                                VIN: $that.FrameNum.Trim().toUpperCase().indexOf('*')>=0 ? $that.frameNo : $that.FrameNum.Trim().toUpperCase(),
                                OrderId:$that.orderId,
                                ComCode: $that.CityId,
                                // SearchCode: objViewModel.searchCode(),//输入的搜索字符
                                ShortEName: $that.ShortEName,//保险公司简码
                                page: 1,//第几页
                                pageSize: 1000,//行数
                                callback: "jsonp",
                                LicenseNumber: $that.LicensePlateCode,//车牌号
                                EngineNumber: $that.EngineNo.Trim().toUpperCase().indexOf('*')>=0 ? $that.engineNo : $that.EngineNo.Trim().toUpperCase()
                            }
                        }
                    });
                } else if (obj.errorFun) {
                    if (typeof(obj.errorFun)) {
                        obj.errorFun(res);
                    }
                }

            } else {
                if (obj.errorFun) {
                    if (typeof(obj.errorFun)) {
                        obj.errorFun(res);
                    }
                }
            }
        });
    },
    clickIdCard:function(e){
        var $that = this;
        var $this = e.currentTarget;
        if ($that.xubao) return false;
        if($($this).text().indexOf('*') >= 0){$($this).text($($this).text().replace(/\*/gi,''))}
        new KeyBoard($this,{initText:'请输入车主身份证号',callback:function(obj){
            if(obj.isHidden && obj.val != undefined){
                var valCheck = checkIdCard(obj.val);
                if(valCheck == true){
                    $($this).parents('li').next().addClass('hide').hide();
                }else{
                    $($this).parents('li').next().text(valCheck)
                    $($this).parents('li').next().removeClass('hide').show();
                }
            }
            if(obj.val == '' || obj.val == undefined ){
                $that.OwnerNo = "请输入车主身份证号";
            }else{
                $that.OwnerNo = obj.val;
            }
            if($that.isSameOwner && $that.ShortEName == 'PICC'){
                $that.b_IdVal = $that.OwnerNo;
            }
        }});
    },
    clickBVal:function(e){
        var $that = this;
        var $this = e.currentTarget;
        if ($that.xubao) return false;
        if($($this).text().indexOf('*') >= 0){$($this).text($($this).text().replace(/\*/gi,''))}
        new KeyBoard($this,{initText:'请输入被保人身份证号',callback:function(obj){
            if(obj.isHidden && obj.val != undefined){
                var valCheck = checkIdCard(obj.val);
                if(valCheck == true){
                    $($this).parents('li').next().addClass('hide').hide();
                }else{
                    $($this).parents('li').next().text(valCheck)
                    $($this).parents('li').next().removeClass('hide').show();
                }
            }
            if(obj.val == '' || obj.val == undefined ){
                $that.b_IdVal = "请输入被保人身份证号";
            }else{
                $that.b_IdVal = obj.val;
            }
        }});
    },
    insuredSameOwner:function(){
        var $that = this;
        //被保人同车主
        $that.isSameOwner = !$that.isSameOwner;
        if ($that.isSameOwner) {
            $that.fillInsuredInfo();
        }
        else{
            //清空被保人
            $that.clearInsuredInfo();
        }
    },
    sameName:function(){
        var $that = this;
        if($that.isSameOwner){$that.InsuredName = $that.OwnerName};
    },
    frameNumBlur:function(e){
        var obj = e.currentTarget;
        var $that = this;
        if ($(obj).val() != $that.frameNo) {
            var carVin = $that.FrameNum;
            if ($(obj).parents('li').next().css('display') == 'none' && carVin != '') {
                this.getValidateCode();
                var postObj = {
                    VinNo:$that.FrameNum.indexOf('*')>=0 ? detailInfo.VinNo : $that.FrameNum,
                    url:'/InsuranceApi/SelectCarModels2',//查询车型代码ajax请求路径
                    SessionId:$that.SessionId,
                    CityId:$that.CityId,
                    orderId:$that.orderId,
                    errorFun:function(res){
                        console.log(res.Message)
                        console.log($that.vehicleModel)
                        if(res.Message == 'E8' && $that.vehicleModel == ''){
                            $('.uploadPopMian span').text('查无对应车型，请检查车架号是否正确');
                            $(".uploadPopMian").show().delay(3000).fadeOut();
                        }
                    }
                };
                if($that.ShortEName == 'CPIC'){
                    if($that.ProvinceId == '370000' && $that.CityId != '370200'){
                        if(checkInputVal($('#FrameNumID'))&&checkInputVal($('#EngineNoID'))){
                            $that.getBrandModel(postObj);
                        }
                    }else{
                        if(checkInputVal($('#FrameNumID'))){
                            $that.getBrandModel(postObj);
                        }
                    }
                }else if($that.ShortEName == 'CIC'){
                    if(checkInputVal($('#FrameNumID'))&&checkInputVal($('#EngineNoID'))){
                        $that.getBrandModel(postObj);
                    }
                }else{
                    if(checkInputVal($('#FrameNumID'))){
                        $that.getBrandModel(postObj);
                    }
                }
            }
            $(obj).val().indexOf("*") >= 0?'':$that.frameNo=$(obj).val();
        }
    },
    frameNumFocus: function(e) {
        var obj = e.currentTarget;
        // this.frameNo = $(obj).val();
        $(obj).val().indexOf("*") >= 0?'':this.frameNo=$(obj).val();
    },
    engineNoBlur: function (e) {
        var $that = this;
        var obj = e.currentTarget;
        if ($(obj).val() != this.engineNo) {
            //修改了发动机号
            var en = this.EngineNo;
            if ($(obj).parents('li').next().css('display') == 'none' && en != '') {
                this.getValidateCode();
            }
            // this.engineNo = $(obj).val();
            $(obj).val().indexOf("*") >= 0?'':this.engineNo=$(obj).val();
        }
    },
    engineNoFocus:function(e){
        var obj = e.currentTarget;
        // this.frameNo = $(obj).val();
        $(obj).val().indexOf("*") >= 0?'':this.engineNo=$(obj).val();
    },

    onSubmit: function() {
        var $that = this;
        if ($that.showValidateCode && $that.verifyCode == '') {
            $('#vcTip').css('display', 'block');
            $('#vcTip').html('请输入验证码');
            return false;
        }
        var display = $(".configModel").css("display");
        if (display == "none" && ($that.ConfigModel == "" || $that.ConfigModel == "请选择配置型号") ) {
            $("li[name='configModelLi']").removeClass("hide");
            $("li[name='configModelLi']").show();
            return false;
        } else {
            $("li[name='configModelLi']").hide();
        }
        if($that.ShortEName == 'PICC'){
            if(checkIdCard($that.b_IdVal) == true){
                $('.b_IdVal span').parents('li').next().addClass('hide').hide();
            }else{
                $('.b_IdVal span').parents('li').next().text(checkIdCard($that.b_IdVal) )
                $('.b_IdVal span').parents('li').next().removeClass('hide').show();
                return false;
            }
        }
        if($that.ShortEName == 'AXATP' && $that.xubao){
            // return true;
            var subUrl = comm.getSubUrl();
            var orderid = $that.orderId;
            // window.location = '/InsuranceApi/InsuranceChoice?orderId=' + orderid + '&return=0&ShortEName=' + requestobj.ShortEName + '&twoPage=UserDetailInfo' + subUrl;
            var url = '/InsuranceApi/InsuranceChoice?orderId=' + orderid + '&return=0&ShortEName=' + $that.ShortEName + '&twoPage=UserDetailInfo' + subUrl;
            comm.qqOpenUrl(url);
        }else{
            var res = $that.transferDateCheck();
            if (res && SubmitCheck()) {
                //身份证号验证
                if (!$that.hideIDCard) {
                    if (checkIdCard($that.OwnerNo) == true) {
                        $('.IDCard span').parents('li').next().addClass('hide').hide();
                    } else {
                        $('.IDCard span').parents('li').next().text(checkIdCard($that.OwnerNo))
                        $('.IDCard span').parents('li').next().removeClass('hide').show();
                        return false;
                    }
                }
                //弹出遮罩层
                comm.showLoadingDiv();
            }else{
                return false;
            }
            var postdata = $that.getPostData();
            console.log(postdata)
            Store.UpdateInsuranceBasicInfo(postdata).then(function (data) {
                $("#loadingdiv").hide();
                comm.CloseLoading();
                if (data.Message == '0') {
                    //成功
                    $that.saveData();
                    var subUrl = comm.getSubUrl();
                    var orderid = $that.orderId;
                    var url = '/InsuranceApi/InsuranceChoice?orderId=' + orderid + '&return=0&ShortEName=' + $that.ShortEName + '&twoPage=UserDetailInfo' + subUrl;
                    comm.qqOpenUrl(url);
                } else if (data.Message == '2') {
                    //失败
                    if (data.Data.ErrorDetail != null) comm.showAlert(data.Data.ErrorDetail);
                    else comm.showAlert('提交失败,请重新提交');
                }
            });
        }
    },
  },
  created(){
  },
  ready:function(){
    APIURL = Store.insuranceAPI;
    this.ShortEName = comm.getUrlParam('ShortEName');
    this.init();
  }
}
function $toJsonString(obj) {
        var isArray = obj instanceof Array;
        var r = [];
        for (var i in obj) {
            var value = obj[i];
            if (typeof value == 'string') {
                value = '"' + value + '"';
            } else if (value != null && typeof value == 'object') {
                value = $toJsonString(value);
            }
            r.push((isArray ? '' : i + ':') + value);
        }
        if (isArray) {
            return '[' + r.join(',') + ']';
        } else {
            return '{' + r.join(',') + '}';
        }
    }
</script>