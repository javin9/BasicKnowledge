

import check from 'libs/check'

module.exports.init = function () {
    $('#step_5_name').val('');
    $('#step_5_id').val('');
    $('#verficationBtn').css('background', '#D0D0D0');
    var intentTimeOfPhone = null;
    var intentTimeOfPhone_text = null;

    //获取验证码
    $("#verficationBtn").click(function (e) {
        if ($("#step_5_phone").val() == '') {
            return;
        }
        check.getCode(60, "step_5_phone", "verficationBtn", 550, false, false);
    });

    //数据验证
    var userNameIn = false;
    var certificateNumberIn = false;
    var userMobileIn = false;
    var validateIn = false;
    var intentTimeOfPhoneIn = false;
    var step_5_name_box = false;

    $("#step_5_name_box").on('blur', function () {
        if ($("#step_5_name_box").val() != "") {
               $('#step_5_name_box').removeClass('red_border');
            $('#step_5_name_boxerror').hide();
            step_5_name_box = true;
            isClickPop();
        }
        else {
               $('#step_5_name_box').addClass('red_border');
            $('#step_5_name_boxerror').show();
            step_5_name_box = false;
        }
    });
    $("#step_5_id").on('blur', function () {
        if (check.isID($("#step_5_id").val())) {
              $('#step_5_id').removeClass('red_border');
            $('.info-desc').css('top', '-20px');
            $("#step_5_iderror").hide();
            certificateNumberIn = true;
            isClickPop();
        }
        else {
              $('#step_5_id').addClass('red_border');
            $('.info-desc').css('top', '-5px');
            $("#step_5_iderror").show();
            certificateNumberIn = false;
        }
    });
    $("#step_5_name").on('blur', function () {
        if ($("#step_5_name").val() != "") {
            $("#step_5_name_validate").hide();
            $("#step_5_name").removeClass('red_border');
            //$("#step_5_name").addClass('hei_border');
            $(".process_border_container").css("visibility", "inherit");
            $(".process_border_container").css("visibility", "visible");
            userNameIn = true;
            if (isLoggedIn) {
                $("#suerBtn_step_5").css('background', '#e9474d');
            }
        }
        else {
            $("#step_5_name_validate").show();
            $("#step_5_name").addClass('red_border');
            //$("#step_5_name").removeClass('hei_border');
            $(".process_border_container").css("visibility", "inherit");
            $(".process_border_container").css("visibility", "visible");
            userNameIn = false;
        }
    });

    function Mobile1() {
        var Xtext = $("#step_5_phone")[0];
        var str = Xtext.value;
        if (str.length == 3 || str.length == 8)
            Xtext.value = Xtext.value + " ";
    }
    function Modile2() {
        var reg = /^(\d{3})(\d{4})(\d{4})$/;
        var matches = reg.exec($("#step_5_phone").val());
        if (matches) {
            var newNum = matches[1] + ' ' + matches[2] + ' ' + matches[3];
            $("#step_5_phone").val(newNum);
        }
    }
    $("#step_5_phone").on('keyup', function () {
        var oEvent = window.event; 
        if (oEvent.keyCode != 8) { 
         Mobile1();
        }
    });
    $("#step_5_phone").on('blur', function () {
        Modile2();
        var phone = $("#step_5_phone").val().replace(/ /g, "");
        if (check.isPhoneNumber(phone)) {
            $("#step_5_phone_validate").hide();
            $("#step_5_phone").removeClass('red_border')
            //$("#step_5_phone").addClass('hei_border')
            $(".process_border_container").css("visibility", "inherit");
            $(".process_border_container").css("visibility", "visible");
            $('#verficationBtn').css('background', '#e9474d');
            userMobileIn = true;
            isClick();
             //添加埋点
            try {
               bc.evt.send('mobile','mobblur',phone)
            }
            catch (err) {}
        }
        else {
            $("#step_5_phone_validate").show();
            $("#step_5_phone").addClass('red_border');
            //$("#step_5_phone").removeClass('hei_border');
            $(".process_border_container").css("visibility", "inherit");
            $(".process_border_container").css("visibility", "visible");
            $('#verficationBtn').css('background', '#D0D0D0');
            userMobileIn = false;
        }
    });

    $("#step_5_verification").on('blur keyup', function () {
        if ($("#step_5_verification").val() != "") {
            $("#step_5_verification_validate").hide();
            $("#step_5_verification").removeClass('red_border');
            //$("#step_5_verification").addClass('hei_border');
            $(".process_border_container").css("visibility", "inherit");
            $(".process_border_container").css("visibility", "visible");

            validateIn = true;
            isClick();
        }
        else {
            //$("#step_5_verification_validate").show();
            //$("#step_5_verification").addClass('red_border');
            //$("#step_5_verification").removeClass('hei_border');
            // $(".process_border_container").css("visibility", "inherit");
            // $(".process_border_container").css("visibility", "visible");
            validateIn = false;

        }
    });
    function isClick() {
        if (validateIn && userMobileIn && userNameIn) {
            $("#suerBtn_step_5").css('background', '#e9474d');
        }

    }
    function isClickPop() {
        if ($("#step_5_name_box").val() != "" && certificateNumberIn) {
            $(".suerBtn_pop").css('background', '#e9474d');
        }

    }
    //选择意向电话时间
    $(document).on("click", 'span[datatype="call_time"]', function (e) {
        $(e.target).addClass("radioBorderBtn").siblings().removeClass("radioBorderBtn");
        intentTimeOfPhone = $(e.target).attr("data-value");
        intentTimeOfPhone_text = $(e.target).text();
        intentTimeOfPhoneIn = true;
    });
    $('span[datatype="call_time"]:eq(0)').trigger("click");

    //确定按钮
    $('.suerBtnp_step_5 .suerBtn').click(function (e) {
        if (isLoggedIn) {
            if (isAuthenticated) {
                gotoNextStep();
            } else {
                if (userNameIn) {
                    gotoNextStep();
                } else {
                    $("#step_5_name_validate").show();
                    $("#step_5_name").addClass('red_border');
                    //$("#step_5_name").removeClass('hei_border');
                    return;
                }
            }

        } else {
            if ($('.suerBtnp_step_5 .suerBtn').hasClass('btnDisabled')) {
                return;
            } else if (userNameIn && userMobileIn && validateIn) {
                if ($("#step_5_verification").val() == '') {
                    $("#step_5_verification_validate").show();
                    $("#step_5_verification").addClass('red_border');
                    //$("#step_5_verification").removeClass('hei_border');
                    return;
                }
                $("#step_5_verification_validate").hide();
                $("#step_5_verification").removeClass('red_border');
                //$("#step_5_verification").addClass('hei_border');

                check.checkCode($("#step_5_verification").val(), "step_5_phone", 550, function (result) {
                    if (result.Result) {
                        //console.log("提交个人信息");
                        $('.suerBtnp_step_5 .suerBtn').addClass('btnDisabled')
                        gotoNextStep();
                    } else {
                        //alert("验证码错误，请重试！");
                        $("#step_5_verification_validate").show();
                        $("#step_5_verification").addClass('red_border');
                        //$("#step_5_verification").removeClass('hei_border');
                        $('.suerBtnp_step_5 .suerBtn').removeClass("btnDisabled").html("立即申请");
                    }
                });
            }
            else {
                return;
            }
        }
    })
}

function gotoNextStep() {
    if($("#step_5_phone").val()){
        var phone = $("#step_5_phone").val().replace(/ /g, "");
    }else{
         var phone = $("#step_5_phone").val();
    }
    
    $('.suerBtnp_step_5 .suerBtn').trigger("dataSelect", {
        userName: $("#step_5_name").val(),
        certificateNumber: $("#step_5_id").val(),
        certificateType: "105",
        userMobile: phone,
        intentTimeOfPhone: '',
        intentTimeOfPhone_text: '',
        isOK: true
    });
    $('.suerBtnp_step_5 .suerBtn').trigger("nextStep");
    $('.name-certification').hide();
    $('#maskLayer').hide();
}
exports.submitBack = function (status) {
    $('.suerBtnp_step_5 .suerBtn').removeClass("btnDisabled").html("立即申请");
}

