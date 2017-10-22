module.exports = function(orderID){
	if(window.isFromShopCGBBank){
		var _form = $("#cgbSendInfoForm");
		$("#maskLayer").css({
			"display":"block",
		});
		tools.showAlert("<div style='white-space:nowrap'>将由 广发银行 为您进行在线审批！</div>",10000);
		$("#showAlertBox").css({
			"z-index":99999
		}).find(".layout-text").css({
			"width": "9rem"
		})
		if(orderID){
			$.ajax({
				url:"/OrderApply/GetCgbSendInfo",
				data:{
					orderID:orderID
				},
				type:'POST',
				success:function(res){
					// res = JSON.parse(res);
					var _data = res.Data;
					if(res.Result){
						_form.find('input[name="applyAmt"]').val(_data.applyAmt);
						_form.find('input[name="custName"]').val(_data.custName);
						_form.find('input[name="certNo"]').val(_data.certNo);
						_form.find('input[name="carPrice"]').val(_data.carPrice);
						_form.find('input[name="itemNo"]').val(_data.itemNo);
						_form.find('input[name="mobilePhone"]').val(_data.mobilePhone);
						_form.find('input[name="mergeProvince"]').val(_data.mergeProvince);
						_form.find('input[name="mergeCity"]').val(_data.mergeCity);
						_form.find('input[name="mergeArea"]').val(_data.mergeArea);
						_form.find('input[name="orderNo"]').val(_data.orderNo);
						_form.find('input[name="signature"]').val(_data.signature);
						setTimeout(function(){
							_form.submit();
						},5000)
					}else{
						setTimeout(function(){
							location.href=cgbFormActionUrl
						},5000)
					}
				},
				error:function(){
					setTimeout(function(){
						location.href=cgbFormActionUrl
					},5000)
				}
			})
        }else{
            setTimeout(function(){
                location.href=cgbFormActionUrl
            },5000)
		}
	}
}