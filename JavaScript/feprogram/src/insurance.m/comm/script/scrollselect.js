import '../css/scrollselect.scss';
// 选项滑动 - 谢美娜
// 示例
// var sanzhe = new scroll_select({
//     Trigger: $("#sanzhediv"),
//     objLen: 2,
//     obj: { val: ["不投保","20万","30万","50万","100万","150万","200万"], attr: [0,200000, 300000, 500000, 1000000, 1500000, 2000000] },
//     CallBack: function (obj, dom) {
//         console.log(obj)
//     }
// });
import iScroll from 'iScroll';
// 示例结束
var scroll_select = function(opts){
    this.Trigger = opts.Trigger; //触发控件的dom元素
    this.objLen = opts.objLen; //选项个数
    this.obj = opts.obj;
    this.CallBack = opts.CallBack; //回调函数
    this.indexY = 1;
    this.defaultValue = opts.defaultValue ? opts.defaultValue : false;
    this.chooseCar = opts.chooseCar ? opts.chooseCar : false;
    this.init();
};
scroll_select.prototype = {
    init:function(){
        var $this = this;
        var id = $this.Trigger.attr('id');
        $this.Trigger.unbind('click');
        $('body').delegate('#'+id,'click',function(e){
            $this.text="";
            if($(this)[0].tagName == "INPUT"){
                $this.text = $(this).val();
            }else{
                $this.text = $(this)[0].innerText.replace(/\s/g, "");
            }
            $this.initDom();//初始化结构
            if($(".downmenu_box.scroll_select .li_list ul li.active").length == 1){
                $this.indexY = $(".downmenu_box.scroll_select .li_list ul li.active").index()-1;
            }
            if($this.defaultValue){ //如果传入默认值
                if($this.text == $this.defaultValue.val){ //判断dom的值是否等于默认值
                    $this.indexY = $this.indexY+1;
                }else{
                    $this.indexY = $this.indexY;
                }
            }
            $this.scroll_select.refresh();
            $this.scroll_select.scrollTo(0, $this.indexY * $this.scroll_select_height , 100, iScroll.utils.ease.elastic);
            var window_h = $(window).height();
            $("body").css({'height':window_h,'overflow':"hidden"});
            // 取消选择
            $(".downmenu_box.scroll_select .edit_box a.cancle").unbind('click').on("click",function(e){
                e.preventDefault();
                $this.cancle();
            });
            // 保存选择
            $(".downmenu_box.scroll_select .edit_box a.save").unbind('click').on("click",function(e){
                e.preventDefault();
                $this.save();
            });
            // 保存选择
            $(".downmenu_box.scroll_select .edit_box a.center").unbind('click').on("click",function(e){
                var obj = {};
                obj.val = $this.obj.val[0];
                if($this.objLen == 2){
                    obj.attr =  $this.obj.attr[0];
                }
                $this.CallBack(obj,$this.Trigger);
                $(".downmenu_box.scroll_select").remove();
                $("body").css({'height':"auto",'overflow':"auto"});
            });
            //退出选择
            $(".downmenu_box.scroll_select").delegate(".down_mark","click",function(e){
                $this.cancle();
            });
        });
        
    },
    initDom:function(){
        var $this = this;
        $this.html = '<div class="downmenu_box scroll_select" style="display:block;">'+
                '<div class="edit_box"><a href="javascript:void(0);" class="cancle fontSize_15">取消</a><a href="javascript:void(0);" class="center fontSize_15 hide">全部</a><a href="javascript:void(0);" class="save fontSize_15">完成</a></div>'+
                '<div class="downmenu_box_bg"></div>'+
                '<div class="choose_li"></div>'+
                '<div class="li_list" id="li_list">'+
                    '<ul>'+
                    '</ul>'+
                    '<div class="cui-mask" style=""></div>'+
                    '<div class="cui-lines">&nbsp;</div>'+
                '</div>'+
                '<div class="down_mark"></div>'+
            '</div>';
            if($(".downmenu_box.scroll_select").length == 0){
                $($this.html).appendTo($("body"));
            }
            var li_html = '<li>&nbsp;</li>';
            for(var m = 0; m < $this.obj.val.length;m++){
                if($this.objLen == 1){
                    if($this.obj.val[m] == $this.text){
                        li_html += ' <li class="active">'+$this.obj.val[m]+'</li>';
                    }else{
                        li_html += ' <li>'+$this.obj.val[m]+'</li>';
                    }

                }else if($this.objLen == 2){
                    if($this.obj.val[m] == $this.text){
                        li_html += ' <li data-id="'+$this.obj.attr[m]+'" class="active">'+$this.obj.val[m]+'</li>';
                    }else{
                        li_html += ' <li data-id="'+$this.obj.attr[m]+'">'+$this.obj.val[m]+'</li>';
                    }
                }
            }
            li_html += '<li>&nbsp;</li>';
            $(".downmenu_box.scroll_select .li_list ul").html(li_html);
            if($this.chooseCar){
                $('.downmenu_box.scroll_select .center').removeClass('hide');
                if($this.objLen == 2){
                    $('.downmenu_box.scroll_select .center').attr({'data-id':$this.obj.attr[0]});
                }
            }
            var liLength = $(".downmenu_box.scroll_select .li_list ul li").length;
            var liwidth = $(".downmenu_box.scroll_select .li_list ul li").eq(0).height();
            var rotateX = 360/liLength;
            var translateZ =  (liwidth/2) / Math.tan((rotateX/2) / 180 * Math.PI)+20;
            $this.scroll_select;
            $this.scroll_select_height = $(".downmenu_box.scroll_select .edit_box").height();
            // 初始化 滑动插件
            $this.scroll_select = new iScroll(".li_list", {
                snap: "li",
                click:true,
                preventDefault:true
            });
            $this.scroll_select.on('scrollEnd',function(){
                var scroll_dis = this.y /  $this.scroll_select_height;
                $this.indexY =Math.round (scroll_dis) * (-1) + 1;
                var liFontSize = Number($(".downmenu_box.scroll_select .li_list ul li").eq($this.indexY).css('font-size').replace('px',''));
                var liFontSize1 = liFontSize%15== 0?liFontSize:(Math.round(liFontSize/15)*15);
                $(".downmenu_box.scroll_select .li_list ul li").eq($this.indexY).css({'font-size':liFontSize1+'px'}).siblings().css({'font-size':(liFontSize1-2)+'px'});
                $(".downmenu_box.scroll_select .li_list ul li").eq($this.indexY).css({'transform':'rotateX(0deg) '});
                $(".downmenu_box.scroll_select .li_list ul li").eq($this.indexY).next().css({'transform':'rotateX('+(-35)+'deg) '});
                $(".downmenu_box.scroll_select .li_list ul li").eq($this.indexY).prev().css({'transform':'rotateX('+(-35)+'deg) '});
            });
    },
    save:function(e){
        var $this = scroll_select;
        if($this.defaultValue){ //如果传入默认值
            if($this.text == $this.defaultValue.val){ //判断dom的值是否等于默认值
                $this.indexY = $this.indexY+1;
            }else{
                $this.indexY = $this.indexY-1;
            }
        }
        var $this = this;
        var index = Math.round($this.indexY);
        var obj = {};
        obj.val = $(".downmenu_box.scroll_select .li_list ul li").eq(index).text();
        if($this.objLen == 2){
            obj.attr = $(".downmenu_box.scroll_select .li_list ul li").eq(index).attr('data-id');
        }
        $this.CallBack(obj,$this.Trigger);
        $(".downmenu_box.scroll_select").remove();
        $("body").css({'height':"auto",'overflow':"auto"});
    },
    cancle:function(){
        $(".downmenu_box.scroll_select").remove();
        $("body").css({'height':"auto",'overflow':"auto"});
    }
};
window.scroll_select = scroll_select;