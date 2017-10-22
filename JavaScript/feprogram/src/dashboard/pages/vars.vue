<template>
	<article>
		<h3>主色，辅色</h3>
		<ul>
			<li  v-for="one in listMain" :class="one.key"  class="vars-item" data-clipboard-text="${{one.key}}">{{one.text}}</li>
		</ul>
		<h3>文本色</h3>
		<ul>
			<li  v-for="one in listText" :class="one.key"  class="vars-item" data-clipboard-text="${{one.key}}">{{one.text}}</li>
		</ul>
		<h3>功能色</h3>
		<ul>
			<li  v-for="one in listFunc" :class="one.key"  class="vars-item" data-clipboard-text="${{one.key}}">{{one.text}}</li>
		</ul>
		<h3>布局</h3>
		<a v-for="one in layout" href="javascript:void(0)" class="vars-item layout-item" data-clipboard-text="${{one.key}}">{{one.text}}</a>
	</article>
</template>

<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    article{
    	padding:0 20px;
    }

    h3{
    	color:#6f5499;
    }

    .layout-item{
    	@include border(#6f5499);
    	border-radius:3px;
    	color:#6f5499;
    	text-decoration: none;
    	font-size:18px;
    	margin-right: 10px;
    	padding:3px 10px;
    	display: inline-block;
    	margin-bottom: 50px;

    	&:hover{
    		color:#fff;
    		background: #6f5499;
    	}
    }

		ul{
			list-style-type: none;
			overflow: hidden;
			margin:0;
			padding:0;

			li{
				width: 80px;
				height: 80px;
				float: left;
				margin-right: 20px;
				font-size:14px;
				text-align: center;
				color:#fff;
				line-height: 80px;
				cursor:pointer;
				&:hover{
					font-size:18px;
				}

				&.main-color{
					background: $main-color;
				}
				&.sub-color{
					background: $sub-color;
				}
				&.black-color{
					background: $black-color;
				}
				&.dark-color{
					background: $dark-color;
				}
				&.normal-color{
					background: $normal-color;
				}
				&.light-color{
					background: $light-color;
				}
				&.lighter-color{
					background: $lighter-color;
				}
				&.lightest-color{
					background: $lightest-color;
				}
				&.white-color{
					background: $white-color;
				}
				&.success-color{
					background: $success-color;
				}
				&.warn-color{
					background: $warn-color;
				}
				&.error-color{
					background: $error-color;
				}
				&.background-color{
					background: $background-color;
					color:$dark-color;
				}
				&.disabled-color{
					background: $disabled-color;
				}
				&.placeholder-color{
					background: $placeholder-color;
				}
				&.warn-background-color{
					background: $warn-background-color;
					color:$dark-color;
				}
				&.icon-color{
					background: $icon-color;
				}
				&.mask-background-color{
					background: $mask-background-color;
				}
			}
		}
</style>

<script>
	import Clipboard from 'clipboard'
  export default{
      data(){
          return {
          	listMain: [
          		{key: 'main-color', text: '主色'},
          		{key: 'sub-color', text: '辅色'}
          	],
          	listText: [
          		{key: 'black-color', text: '黑'},
          		{key: 'dark-color', text: '深色'},
          		{key: 'normal-color', text: '正常'},
          		{key: 'light-color', text: '浅'},
          		{key: 'lighter-color', text: '较浅'},
          		{key: 'lightest-color', text: '极浅'},
          		{key: 'white-color', text: '白'}
          	],
          	listFunc: [
          		{key: 'success-color', text: '成功'},
          		{key: 'warn-color', text: '警告'},
          		{key: 'error-color', text: '错误'},
          		{key: 'background-color', text: '主背景'},
          		{key: 'disabled-color', text: '禁用'},
          		{key: 'placeholder-color', text: 'placeholder'},
          		{key: 'warn-background-color', text: '警告框背景'},
          		{key: 'icon-color', text: 'icon'},
          		{key: 'mask-background-color', text: '遮罩层背景色'}
          	],
          	layout: [
          		{key: 'main-line-height', text: '行高1.5'},
          		{key: 'main-border-radius', text: '圆角5px'},
          		{key: 'sub-border-radius', text: '圆角3px'},
          		{key: 'mask-opacity', text: '遮罩层透明度'},
          	]
          }
      },
      ready(){
        new Clipboard('.vars-item')
      }
  }
</script>
