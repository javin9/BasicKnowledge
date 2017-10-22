require('./lease.scss');

var check = require("libs/check");
var fg=false;
var fg2=false;
var fg3= false;
let isfirstClickSubmit = true;

var ordera = {

    init: function(){
        this.initFixBar();

        if(typeof username !="undefined")
        {
            //易鑫流程，没有这个变量
            $(".layx22-left2-zsxm input").val(username);
        }
        $(".layx22-left2-sfzh input").val('请输入18位证件号');

        /* var layx3p=$(".layx3").offset().top;
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
        }) */

        $(".layx22-left2-zsxm input").focus(function(){
            if(this.value==this.defaultValue){
                this.value="";
                this.style.color="#333";
            }
        })

        $(".layx22-left2-zsxm input").blur(function(){
            if(this.value==''){
                this.style.color="#c4c4c4";
                this.value=this.defaultValue;
            }

            if($(".layx22-left2-zsxm input").val()=="请输入您的中文全名"){
                fg=false;
                $(".layx22-left2-zsxm input").parent().next().html('请输入您的中文全名');
                $(".layx22-left2-zsxm input").parent().next().css("display","");
                return;
            }

            if(!check.isName($(".layx22-left2-zsxm input").val())){
                fg=false;
                $(".layx22-left2-zsxm input").parent().next().html('姓名格式错误，请核实');
                $(".layx22-left2-zsxm input").parent().next().css("display","");
                return;
            }

            $(".layx22-left2-zsxm input").parent().next().css("display","none");
            fg=true;
        })

        $(".layx22-left2-sfzh input").focus(function(){
            if(this.value==this.defaultValue){
                this.value="";
                this.style.color="#333";
            }
        })

        $(".layx22-left2-sfzh input").blur(function(){
            if(this.value==''){
                this.style.color="#c4c4c4";
                this.value=this.defaultValue;
            }

            if($(this).val()=="请输入18位证件号"){
                fg2=false;
                $(this).parent().next().html('请输入18位证件号');
                $(this).parent().next().css("display","");
                return;
            }

            if(!check.isID($(this).val())){
                fg2=false;
                $(this).parent().next().html('身份证号码格式错误，请核实');
                $(this).parent().next().css("display","");
                return;
            }

            $(this).parent().next().css("display","none");
            fg2=true;
        })

        let tpjyInputDom = $(".layx22-left2-tpjy input");
        tpjyInputDom.focus(function(){
            if(this.value==this.defaultValue){
                this.value="";
                this.style.color="#333";
            }
        })

        tpjyInputDom.blur(function(){
            if(this.value==''){
                this.style.color="#c4c4c4";
                this.value=this.defaultValue;
            }

            if(tpjyInputDom.val()=="请输入图片验证码"){
                fg3=false;
                tpjyInputDom.parent().next().html('请输入图片验证码');
                tpjyInputDom.parent().next().css("display","");
                return;
            }

            if(tpjyInputDom.val().length !== 4){
                fg3=false;
                tpjyInputDom.parent().next().html('请输入正确的验证码');
                tpjyInputDom.parent().next().css("display","");
                return;
            }

            tpjyInputDom.parent().next().css("display","none");
            fg3=true;
        })

        $('#changeCode').click(function(){
            $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
        });

        $("#submitBtn").click(function(){
            //$(".layx22-left2-zsxm input").blur();
            //$(".layx22-left2-sfzh input").blur();
            if(!$(this).hasClass('disable')){
                const ishasImgCode = !$('#imgValidateCodeBox').hasClass('hide');

                if($(".layx22-left2-zsxm input").val()=="请输入您的中文全名"){
                    $(".layx22-left2-zsxm input").parent().next().html('请输入您的中文全名');
                    $(".layx22-left2-zsxm input").parent().next().css("display","");
                }else if(!check.isName($(".layx22-left2-zsxm input").val())){
                    $(".layx22-left2-zsxm input").parent().next().html('姓名格式错误，请核实');
                    $(".layx22-left2-zsxm input").parent().next().css("display","");
                }

                if($(".layx22-left2-sfzh input").val()=="请输入18位证件号"){
                    $(".layx22-left2-sfzh input").parent().next().html('请输入18位证件号');
                    $(".layx22-left2-sfzh input").parent().next().css("display","");
                }else if(!check.isID($(".layx22-left2-sfzh input").val())){
                    $(".layx22-left2-sfzh input").parent().next().html('身份证号码格式错误，请核实');
                    $(".layx22-left2-sfzh input").parent().next().css("display","");
                }

                if(ishasImgCode){

                    if(tpjyInputDom.val()=="请输入图片验证码"){
                        tpjyInputDom.parent().next().html('请输入图片验证码');
                        tpjyInputDom.parent().next().css("display","");
                    }else if(tpjyInputDom.val().length !== 4){
                        tpjyInputDom.parent().next().html('请输入正确的验证码');
                        tpjyInputDom.parent().next().css("display","");
                    }
                }

                /* if(!$(".layx3 input[type=checkbox]")[0].checked){
                    tools.showAlert("请阅读车贷服务条款，并勾选");
                } */

                if((fg && fg2 && !ishasImgCode) || (fg && fg2 && ishasImgCode)){
                    var btn = $(this);
                    var btnText = btn.text();
                    btn.addClass('disable').text("提交中..");
                    $.ajax({
                        url:id_checking_url,
                        type: 'post',
                        dataType: 'json',
                        data: {
                            name: $(".layx22-left2-zsxm input").val(),
                            idNumber: $(".layx22-left2-sfzh input").val(),
                            userId: orderInfo.UserId,
                            imageCode: $('#imgValidateCodeBox').hasClass('hide')?'':$('#imgValidateCode').val()
                            // phone: orderInfo.Mobile
                        },
                        beforeSend: function () {
                        },
                        success: function (res) {
                            if(res.Result) {
                                // 进入第二步：运营商验证
                                $.ajax({
                                    url: order_updating_url,
                                    type: 'post',
                                    data: {
                                        orderId: orderInfo.OrderId,
                                        childOrderId: orderInfo.ChildOrderId,
                                        name: $('.layx22-left2-zsxm input').val(),
                                        identityNumber: $('.layx22-left2-sfzh input').val()
                                    },
                                    success: function(res) {
                                        if (res.Result) {
                                            if (res.Data.BigDataUrl) {
                                                $('#paymentIframe').attr('src', res.Data.BigDataUrl);
                                                $('.layx').hide();
                                                $('.payment').show();
                                            } else {
                                                window.nextStep();
                                            }
                                        } else {
                                            tools.showAlert(res.Message);
                                            btn.removeClass('disable').text(btnText);
                                        }
                                    }
                                });
                            }else{
                                if(res.Data === 0){
                                    //验证码错误
                                    $('#imgValidateCodeBox').removeClass('hide');
                                    if(!isfirstClickSubmit){
                                        $(".layx22-left2-tpjy input").parents('.items').next('.layx22-left2-cwxx').html('请输入正确的验证码').css("display","");
                                    }else {
                                        $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                                        tools.showAlert("请输入图片验证码");
                                    }
                                }else if(res.Data === -1){
                                    //需要验证码
                                    $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                                    $('#imgValidateCodeBox').removeClass('hide');
                                    tools.showAlert("请输入图片验证码");
                                }else {
                                    $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                                    tools.showAlert("验证不通过，请核实姓名与身份证信息是否符合");
                                }

                                btn.removeClass('disable').text(btnText);
                            }
                            isfirstClickSubmit = false;
                        }
                    });
                }else if( ishasImgCode  && fg3 && (!fg || !fg2)) {
                    $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                    fg3 = false;
                }
            }

        });

        $(".layx22-left2-cwxx2 a").click(function(){
            $(".layx22-left2-cwxx2").css("display","none");
        });

        //如何贷款？
        $("#howgetgifts").hover(function(e){
            debugger;
            $(this).parent().prev(".tip").show();
        },function(e){
            $(this).parent().prev(".tip").hide();
        });

    },

    // 吸底提交按钮
    initFixBar: function() {
        var fixBar = $('.layx3-con'),
            footer = $('#Footer'),
            scrollTop = 0;

        setFixBar();
        $(window).bind('scroll', setFixBar);
        $(window).bind('resize', setFixBar);

        function setFixBar() {
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop + document.documentElement.clientHeight >= footer.offset().top) {
               fixBar.css('position', 'absolute');
            } else {
               fixBar.css('position', 'fixed');
            }
            // console.log(`scroll: ${scrollTop}, fixBar: ${fixBar.offset().top}, footer: ${footer.offset().top}`)
        }
    },

    //ajax
    sendAjax: function (options, _callback, _errorcallback) {
        var self = this;
        var setting = {
            url: '',
            timeout: 5000,
            type: 'get',
            dataType: 'json',
            cache: true,
            async: true,
            data: {}
        };
        setting = $.extend(setting, options);
        $.ajax({
            url: setting.url,
            type: setting.type,
            dataType: setting.dataType,
            async: setting.async,
            cache: setting.cache,
            data: setting.data,
            beforeSend: function () {
            },
            success: function (res) {
                _callback(res);
            },
            complete: function (XMLHttpRequest, textStatus) {
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    _errorcallback(textStatus);
                }
            }
        })
    }
}

$(function() {
    ordera.init();
});

// 运营商验证
window.nextStep = function(){
    window.location.href = back_url;
}
