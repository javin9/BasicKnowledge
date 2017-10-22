import "./qualification.scss";
import check from 'libs/check';
import aes from "libs/aes";
class RecProduct {
    constructor() {

    }

    init() {
        let self = this;
        if (typeof username != "undefined") {
            //易鑫流程，没有这个变量
            $(".layx22-left2-zsxm input").val(username);
        }

        $('input.checked').blur(function() {
            let _val = $.trim($(this).val()),
                _id = $(this).attr('id');
            if (_val === "") {
                self.showErrorTips($(this));
            } else {
                switch (_id) {
                    case 'realName':
                        self.checkInput(check.isName(_val), $(this));
                        break;
                    case 'IdNo':
                        self.checkInput(check.isID(_val), $(this));
                        break;
                }
            }
        });

        // 点击提交按钮
        $('#submit').click(function() {

            if ($(this).hasClass('disable')) {
                return false;
            }
            if (showIdNumber && showUserName && $('#realName').val() === showUserName && $('#IdNo').val() === showIdNumber) {
                location.href = resultPage;
                return;
            }
            $('input.checked').trigger('blur');

            if ($('.yzjs.show').length <= 0) {
                let _data = {};
                $(this).addClass('disabled').html('提交中...');
                $('input.checked').each(function() {
                    $(this).attr('name') == 'IdNo' ? _data[$(this).attr('name')] = aes.encrypt($.trim($(this).val())) : _data[$(this).attr('name')] = $.trim($(this).val());
                });

                tools.$ajax({
                    url: AddQuaUrl,
                    dataType: 'json',
                    data: _data,
                    success: function(res) {
                        if (res.Result) {
                            window.location.href = res.Data;
                        } else {
                            tools.showAlert(res.Message);
                            $('#submit').removeClass('disable').html('提交');
                        }
                    }
                })
            }
        });
        //如何贷款？
        $("#howgetgifts").mouseover(function(e) {
            // debugger;
            $('.welfare-tip').show();
        }).mouseout(function() {
            $('.welfare-tip').hide();
        });

        // 赠险弹层
        $('#popInsuranceTrig').click(function() {
            var _insuranceCompanyName = $('input[name="InsuranceCompanyName"]').val();
            if (_insuranceCompanyName == 'syzx') {
                $('#popInsuranceCont2').removeClass('hide');
            } else {
                $('#popInsuranceCont1').removeClass('hide');
            }
            $('#maskLayer').show();
            var pageH = document.documentElement.clientHeight;
            if ($('.popInsuranceCont').height() > pageH - 100) {
                $('.popInsuranceCont').css({ 'top': '50px' });
                $('.popInsuranceCont .popCont_bd').css({ 'height': pageH - 154 + 'px', 'overflow-y': 'auto', 'top': '50px' });
            }
        });
        $('.popCont_close').click(function() {
            $('#maskLayer').hide();
            $('.popInsuranceCont').addClass('hide');
        });
    };

    checkInput(ischecked, dom) {
        if (ischecked) {
            dom.removeClass('show').parents('.items').next('.yzjs').removeClass('show');
        } else {
            this.showErrorTips(dom);
        }
    };

    showErrorTips(dom) {
        dom.addClass('show').parents('.items').next('.yzjs').addClass('show');
    };
}
$(function() {
    var rec = new RecProduct();
    rec.init();
})