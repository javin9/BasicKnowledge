import './refund.scss'
import 'libs/selectControl'
import 'zepto/src/touch'

var refund = {
	init: function() {
		this.domInit()
	},
	domInit: function() {
		var self = this
		//下拉
		$('.select-con').selectControl({
			CallBacks: function(obj) {
				$('.select-con').text(obj.txt).data('id', obj.id)
				if (obj.id == '0') {
					$('.refund-area').removeClass('hide')
				} else {
					$('.refund-area').addClass('hide')
				}
			}
		})

		//退款提交
		$('#refund').tap(function() {
			if ($('#refundReason').attr('data-id') == '-1') {
				tools.showAlert('请选择退款原因!')
				return
			} else if (
				$('#refundReason').attr('data-id') == '0' &&
				$.trim($('#refundRemark').val()) == ''
			) {
				tools.showAlert('请填写退款说明!')
				return
			} else {
				self.submitRefund()
			}
		})
	},
	submitRefund: function() {
		var self = this,
			refundData = {
				childOrderId: $('#childOrderId').data('id'),
				refundReason: $('#refundReason').text()
			}
		if ($('#refundReason').data('id') == '0') {
			refundData.refundReason = $('#refundRemark').val()
		}
		$.ajax({
			url: '/MyOrder/SubmitRefund',
			type: 'POST',
			dataType: 'json',
			data: refundData,
			beforeSend: function() {
				tools.showAlert('提交中', 24 * 60 * 60 * 1000)
				$('#maskLayer').css('z-index', 88890)
			},
			success: function(res) {
				if (res.Result) {
					$('#showAlertBox').hide()
					$('#maskLayer').css('z-index', 88888).hide()

					window.location.href = window.usercenter
				} else {
					tools.showAlert(res.Message)
					window.location.href = window.usercenter
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				$('#showAlertBox').hide()
				$('#maskLayer').css('z-index', 88888).hide()
				if (xhr.status == 401) {
					tools.showAlert('请先登录', 24 * 60 * 60 * 1000)
					window.location = window.usercenter
					return
				}
				tools.showAlert('服务器异常,请稍后再试')
			}
		})
	}
}

refund.init();