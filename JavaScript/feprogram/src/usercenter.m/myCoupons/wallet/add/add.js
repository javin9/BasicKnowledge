'use strict';

//css
import '../../common/css/common.scss';
import '../lib/wallet.scss';
//声明变量
import app from '../../common/script/app';
import XTK from '../../common/script/XTK';
import Store from '../../common/script/Store';
Store.userAPI = api_url;
var  $add_btn=$('.add-btn');
var $card_input=$('#card-input');
var ViewModel = {
      loadDomView() {
    },

   //初始页页面dom元素事件
    loadDomEvent() {
        $add_btn.on('click',()=>{
            if($card_input.val()==''){
                Tools.showAlert('请输入兑换码');
                return;
            }
            var params={
                cardNo:$card_input.val(),
            };
            $add_btn.css({background:'#ccc'});
           Store.add_card(params).then((res)=>{
               if(res.Result){
                   Tools.showAlert('兑换成功');
                   setTimeout(()=>{
                       location.href=returnUrl;
                   },500)
               }else{
                   Tools.showAlert(res.Message);
                    setTimeout(()=>{
                    $add_btn.css({background:'#E9474D'});
                      },1000)
                
               }
           })
        })
    }
}
//view
$(function(){
    XTK.Action.bind();
    ViewModel.loadDomEvent();
})