'use strict';

//css
import '../../common/css/common.scss';
import '../lib/css.scss';
//声明变量
import check from 'libs/check/m';
import app from '../../common/script/app';
import XTK from '../../common/script/XTK';
import Store from '../../common/script/Store';


var ViewModel = {
    loadDomView() {
          $('[action]').hide();

    },

    //初始页页面dom元素事件
    loadDomEvent() {
       

    }
};
  
//view
$(function () {
    ViewModel.loadDomEvent();
    ViewModel.loadDomView();
    XTK.Action.bind();
})