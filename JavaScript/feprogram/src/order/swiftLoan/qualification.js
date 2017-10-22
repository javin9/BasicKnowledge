require("./qualification.scss");
require("./gauge.js");
var check = require("libs/check");
    var fg=false;

    var opts = {
        angle: 0,
        lineWidth: 0.02
    };

    if(tools.getUrlParam("provision") =="false"){
        $("#provision").hide();
    }else{
        $("#provision").show();
    }
    var target = '';
    var gauge = '';

    var ua = navigator.userAgent.toLowerCase();
    var c = function(r){
        return r.test(ua);
    };
    if(!c(/msie 8/) && !c(/msie 7/)){
        target = document.getElementById('canvas-preview');
        gauge = new Gauge(target).setOptions(opts);
        gauge.maxValue = 130000;
        gauge.animationSpeed = 55;
    }

    var checkbcxx=function(){
        var fg=true;
        for(var i in defaultQualification){
            if(defaultQualification[i]==-1){
                fg=false;
            }

        }
        return fg;
    };


    var ordera = {

        init: function(){
            var layx3p=$(".layx3-con").offset().top;
            if($(window).scrollTop()>layx3p+80-$(window).height()){
                $(".layx3-con").removeClass("layx3f");
            }else{
                $(".layx3-con").addClass("layx3f");
            }
            $(window).scroll(function(){
                if($(window).scrollTop()>layx3p+80-$(window).height()){
                    $(".layx3-con").removeClass("layx3f");
                }else{
                    $(".layx3-con").addClass("layx3f");
                }
            })
            //$("input[name=CertificateNumber]").val("13080219870121141X");
            $(".hqdk").click(function(){
                //$(".layx22-left2-zsxm input").blur();
                //$(".layx22-left2-sfzh input").blur();

                //if(fg){
                //location='/loanapplyyx/Result';
                //}

                if($(".layx3 input[type=checkbox]")[0] && !$(".layx3 input[type=checkbox]")[0].checked){
                    tools.showAlert("请阅读信息使用授权书，并勾选");
                    return;
                }

                // 赠险判断
                var IsSelectedInsurance = false;
                if( ($(".sec_insurance").length <= 0) || ($(".sec_insurance input[type=checkbox]")[0] && !$(".sec_insurance input[type=checkbox]")[0].checked)){
                    IsSelectedInsurance = false;
                } else {
                    IsSelectedInsurance = true;
                }

                if($(this).hasClass('disable')){
                    return;
                }else if(checkbcxx()){
                    $(".hqdk").addClass('disable');
                    $.ajax({
                        url:AddQuaUrl,
                        type:"post",
                        dataType:"json",
                        data: {
                            "Career":$("input[name=Career]").val(),"Credit":$("input[name=Credit]").val(),"Income":$("input[name=Income]").val(),"HouseState":$("input[name=HouseState]").val(),"Funds":$("input[name=Funds]").val(),"Insurance":$("input[name=Insurance]").val(),"MaritalStatus":$("input[name=MaritalStatus]").val(),"Education":$("input[name=Education]").val(),"ProductIds":$("input[name=ProductIds]").val(),"OrderID":$("input[name=OrderID]").val(),"CarId":$("input[name=CarId]").val(),"CityId":$("input[name=CityId]").val(),"CarPrice":$("input[name=CarPrice]").val(),"CertificateNumber":$("input[name=CertificateNumber]").val(),"IsSelectedInsurance": IsSelectedInsurance
                        },
                        beforeSend: function () {
                            $("a.hqdk").html("提交中..");
                        },
                        success: function (res) {
                            $(".hqdk").removeClass('disable');
                            $("a.hqdk").html("提交");
                            if(res.Result==1){
                                if(res.Data.IsHighQulification){
                                    $(".spedwin").css("left",($(window).width()-$(".spedwin").width())/2+$(window).scrollLeft());
                                    $(".spedwin").css("top",($(window).height()-$(".spedwin").height())/2+$(window).scrollTop());

                                    $("#maskLayer").css("display","block");
                                    //alert($);
                                    if(c(/msie 8/) || c(/msie 7/)){
                                        $("#canvas-preview").css("display","none");
                                        $(".sped").addClass("_sped");
                                        $("#spedz2").html(res.Data.ApproveQuota);
                                        $(".spedwin").css("display","");
                                    }else{
                                        gauge.maxValue = res.Data.ApproveQuota;
                                        $("#canvas-preview").css("display","");
                                        $(".sped").removeClass("_sped");
                                        $(".spedwin").css("display","");
                                        gauge.set(res.Data.ApproveQuota);
                                    }
                                }else{
                                    document.getElementById("formQ").submit();
                                }
                            }

                            $(".spedwin-jx").click(function(){
                                if(res.Data.IsHavingDeposit){
                                    location=payUrl+'?OrderID='+$("input[name=OrderID]").val();
                                }else{
                                    location=applySuccessUrl+'?OrderID='+$("input[name=OrderID]").val();
                                }
                            })

                        }
                    });
                }else{
                    tools.showAlert("请勾选补充信息");
                    $(".hqdk").removeClass('disable');
                }
            })


            $(".layx22-left5-zy a,.layx22-left5-shsr a,.layx22-left5-sbzm a,.layx22-left5-xyjl a,.layx22-left5-zfzt a,.layx22-left5-gjj a").click(function(){
                $(this).siblings("a").removeClass("on");

                $(this).addClass("on");

                if(this.parentNode.className.indexOf("layx22-left5-zy")!=-1){
                    $("input[name=Career]").val($(this).attr("data-id"));
                    defaultQualification.Career=$(this).attr("data-id");
                }else if(this.parentNode.className.indexOf("layx22-left5-shsr")!=-1){
                    $("input[name=Income]").val($(this).attr("data-id"));
                    defaultQualification.Income=$(this).attr("data-id");
                }else if(this.parentNode.className.indexOf("layx22-left5-sbzm")!=-1){
                    $("input[name=Insurance]").val($(this).attr("data-id"));
                    defaultQualification.Insurance=$(this).attr("data-id");
                }else if(this.parentNode.className.indexOf("layx22-left5-xyjl")!=-1){
                    $("input[name=Credit]").val($(this).attr("data-id"));
                    defaultQualification.Credit=$(this).attr("data-id");
                }else if(this.parentNode.className.indexOf("layx22-left5-zfzt")!=-1){
                    $("input[name=HouseState]").val($(this).attr("data-id"));
                    defaultQualification.HouseState=$(this).attr("data-id");
                }else if(this.parentNode.className.indexOf("layx22-left5-gjj")!=-1){
                    $("input[name=Funds]").val($(this).attr("data-id"));
                    defaultQualification.Funds=$(this).attr("data-id");
                }
            })

            for(var i=0;i<$(".layx22-left5-zy a").size();i++){
                if($(".layx22-left5-zy a").eq(i).attr("data-id")==defaultQualification.Career){
                    $(".layx22-left5-zy a").eq(i).addClass("on");
                    $("input[name=Career]").val(defaultQualification.Career);
                    break;
                }
            }
            for(var i=0;i<$(".layx22-left5-shsr a").size();i++){
                if($(".layx22-left5-shsr a").eq(i).attr("data-id")==defaultQualification.Income){
                    $(".layx22-left5-shsr a").eq(i).addClass("on");
                    $("input[name=Income]").val(defaultQualification.Income);
                    break;
                }
            }
            for(var i=0;i<$(".layx22-left5-sbzm a").size();i++){
                if($(".layx22-left5-sbzm a").eq(i).attr("data-id")==defaultQualification.Insurance){
                    $(".layx22-left5-sbzm a").eq(i).addClass("on");
                    $("input[name=Insurance]").val(defaultQualification.Insurance);
                    break;
                }
            }
            for(var i=0;i<$(".layx22-left5-gjj a").size();i++){
                if($(".layx22-left5-gjj a").eq(i).attr("data-id")==defaultQualification.Funds){
                    $(".layx22-left5-gjj a").eq(i).addClass("on");
                    $("input[name=Funds]").val(defaultQualification.Funds);
                    break;
                }
            }
            for(var i=0;i<$(".layx22-left5-xyjl a").size();i++){
                if($(".layx22-left5-xyjl a").eq(i).attr("data-id")==defaultQualification.Credit){
                    $(".layx22-left5-xyjl a").eq(i).addClass("on");
                    $("input[name=Credit]").val(defaultQualification.Credit);
                    break;
                }
            }
            for(var i=0;i<$(".layx22-left5-zfzt a").size();i++){
                if($(".layx22-left5-zfzt a").eq(i).attr("data-id")==defaultQualification.HouseState){
                    $(".layx22-left5-zfzt a").eq(i).addClass("on");
                    $("input[name=HouseState]").val(defaultQualification.HouseState);
                    break;
                }
            }

            //alert(defaultQualification);

            //如何贷款？
            $("#howgetgifts").hover(function(e){
                $(this).parent().prev(".tip").show();
            },function(e){
                $(this).parent().prev(".tip").hide();
            });

            // 赠险弹层
            $('#popInsuranceTrig').click(function(){
                var _insuranceCompanyName = $('input[name="InsuranceCompanyName"]').val();
                if( _insuranceCompanyName == 'syzx' ){
                    $('#popInsuranceCont2').removeClass('hide');
                } else {
                    $('#popInsuranceCont1').removeClass('hide');
                }
                $('#maskLayer').show();
                var pageH = document.documentElement.clientHeight;
                if( $('.popInsuranceCont').height() > pageH -100 ){
                    $('.popInsuranceCont').css({'top': '50px'});
                    $('.popInsuranceCont .popCont_bd').css({'height': pageH - 154 + 'px', 'overflow-y': 'auto', 'top': '50px'});
                }
            });
            $('.popCont_close').click(function(){
                $('#maskLayer').hide();
                $('.popInsuranceCont').addClass('hide');
            });
        }
    }

    ordera.init();