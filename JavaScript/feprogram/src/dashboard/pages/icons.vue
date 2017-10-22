<template>
	<ul>
		<li v-for="one in list" :class="one" data-clipboard-text="@include icons({{one}});" class="icons-item"></li>
	</ul>
</template>



<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    ul{
    	list-style-type: none;

    	li{
    		border:1px solid #f2f2f2 !important;
    		width: 100px;
    		height: 100px;
    		background-position: center center !important;
    		float: left;
    		margin-right: 20px;
    		margin-bottom: 20px;
    		cursor:pointer;
        text-shadow: 0 1px 0 #fff;
        opacity: 1 !important;

        &:hover{
          border-color:#6f5499 !important;
        }

				@each $icon in weixin,qq,jd,baidu,weibo,close,close-2, clear,search,setting,eye-open,eye-closed,location,more,more-cur,pencil,unselected,selected,name,xinche,xinche-cur,car, telephone,authcode,id,man,my,my-cur,ershouche,ershouche-cur,error,mail,loan,loan-cur,triangle,choose,history,back,arrow-down,arrow-right,arrow-right-cur,star,star-cur,triangle-down,triangle-up,call,favo,favo-cur,phone,location-point,down,add,feedback,money-bag,paper,paper-2, paper-3, waiting,success-spe,success,no-car,picture,placeholder,checkbox, checkbox-select, global, help, camera, menu{
					&.#{$icon}{
						@include icons($icon, false);

						@if $icon == no-car or $icon == success or $icon == placeholder or $icon == camera{
							background-size:contain !important;
						}
						@if $icon == picture or $icon == menu or $icon == close-2{
							background-color: #f0f0f0 !important;
						}
					}
				}
    	}
    }
</style>

<script>
  import Clipboard from 'clipboard'
  export default{
      data(){
          return {
          	list: ['weixin', 'qq', 'jd', 'baidu', 'weibo', 'close', 'close-2', 'clear','search','setting','eye-open','eye-closed','location','more','more-cur','pencil','unselected','selected','name','xinche','xinche-cur','car','telephone','authcode','id','man','my','my-cur','ershouche','ershouche-cur','error','mail','loan','loan-cur','triangle','choose','history','back','arrow-down','arrow-right','arrow-right-cur','star','star-cur','triangle-down','triangle-up','call','favo','favo-cur','phone','location-point','down','add','feedback','money-bag','paper','paper-2','paper-3','waiting','success-spe','success','no-car','picture','placeholder', 'checkbox', 'checkbox-select', 'global', 'help', 'camera', 'menu']
          }
      },
      ready(){
        new Clipboard('.icons-item')
      }
  }
</script>
