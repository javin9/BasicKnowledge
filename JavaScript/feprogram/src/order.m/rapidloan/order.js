require("./order.scss");
require("./index.scss");
var check = require("libs/check/m");

$(function () {
    var $submit = $('#submit-btn');
    var $userName = $('#userName');
    var $CertificateNumber = $('#CertificateNumber');
    if($('.adviser').length>0){
        $('.title_box').css('padding-right','2.56667rem')
    }else{
         $('.title_box').css('padding-right','0')
    }
    $submit.click(() => {
        if($userName.val()==''){
             $('#zsxm').html('*请输入真实姓名').show();
            return;
        }else{
             $('#zsxm').hide();
        }
       
        if (!check.isName($.trim($userName.val()))) {
            $('#zsxm').html('*请输入正确真实姓名').show();
            return;
        }else{
             $('#zsxm').hide();
        }
         if($CertificateNumber.val()==''){
            $('#xfz').html('*请输入身份证号码。').show();
             return;
        }else{
            $('#xfz').hide();
        }
        if (!check.isID($.trim($CertificateNumber.val()))) {
            $('#xfz').html('*请输入正确身份证号码。').show();
            return;
        }else{
            $('#xfz').hide();
        }
        $.post(QualUrl, { 'OrderId':OrderId,'userName': $userName.val(), 'CertificateNumber': $CertificateNumber.val() }, function (res) {
            if (!res.Result) {
                tools.showAlert(res.Message);
            } else {
                location.href=ResultUrl;
            }
        });
    })
})