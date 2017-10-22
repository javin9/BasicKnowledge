require("./qualification.scss");

require("libs/selectControl");
var check = require('libs/check');
var tools = require('libs/tools.m.js');

class swiftLoanQualification {
    constructor(){
    	this.bindEvent();
    }
    // 事件
    bindEvent(){
    	let self = this;
    	// 下拉选择
        $('.triggerEvent').selectControl({
            CallBacks: function (obj) {
                // console.log(obj.item)
                $(obj.item).attr('data-id', obj.id);
                $(obj.item).find('em').html(obj.txt).addClass('active');
                let _iptId = $(obj.item).attr('id').replace('Trigger', '');
                $('#' + _iptId).val(obj.id);
                $(obj.item).parents('li').next('.xqtis').removeClass('show').hide();
            }
        });
    	// 失焦验证
        $('#form input').on('blur', function(){
            self.chkIpt($(this).attr('id'));
        })
        // 提交
        $('#submit').on('click', function(){
        	$('#form input').each(function(){
        		if($(this).val() == ''){
        			$(this).parents('li').next('.xqtis').addClass('show').show();
        		}
        	})

        	if ( $('.xqtis.show').length > 0 ){
	            return false;
	        } else {
	            self.submitForm();
	        }
        })
    }
    // 验证
    submitForm(){
    	let self = this;
        
        let data = {};

    	$('#form input').each(function(){
            data[$(this).attr('id')] = $.trim($(this).val());
        });

        $('.loadingCtn').css('display', 'block');

        tools.$ajax({
            url: addQualificationUrl,
            data: data,
            success: function (res) {                
            	$('.loadingCtn').hide();
            	
                if (!res.Result) {
                    tools.showAlert(res.Data);
                } else {
                    window.location.href = ResultUrl;
                }

            }
        });
    }

    // 验证
	chkIpt(id){
        let _curid = id,
            $curdom = $('#' + id),
            _curval = $curdom.val(),
            $xqtis = $curdom.parents('li').next('.xqtis');

        switch(_curid){
            case 'CertificateNumber':
                if ( _curval == '' ){
                    $xqtis.text('请输入证件号').addClass('show').show();
                } else if ( !check.isID(_curval) ){
                    $xqtis.text('请输入正确的证件号').addClass('show').show();
                } else {
                    $xqtis.removeClass('show').hide();
                }
                break;
        }
    }

}


new swiftLoanQualification();