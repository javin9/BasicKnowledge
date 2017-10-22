<template>
	<component-header :title="title"></component-header>

	<ul>
		<li v-for="one in list" :class="{'current' : $index === 0, 'last' : $index === list.length-1  && allData}">
			<a href="{{one.NewsUrl}}">
				<h6>{{one.Title}}</h6>
				<p>媒体 《{{one.MediaName}}》</p>
			</a>
		</li>
	</ul>
</template>

<style>
	body{
		background: #fff;
	}
</style>
<style scoped>
@import 'sassHelper/mixin';
@import '../vars';
@import '../mixin';
ul{
	@include font(m);
	padding:px2rem(40) px2rem(60);

	li{
		padding-left: px2rem(40);
		height:px2rem(208);
		position: relative;

		a{
			text-decoration: none;
		}

		&:before{
			content:' ';
			width: px2rem(1);
			height:100%;
			background:#ddd;
			position: absolute;
			left:0;
			top:px2rem(10);
		}

		&:after{
			@include size(px2rem(20));
			border-radius:px2rem(10);
			content:' ';
			position: absolute;
			background: #ddd;
			left:px2rem(-9);
			top:px2rem(10);
		}

		&:last-child{
			&:before{
				height:80%;
			}
		}
	}

	li.current{
		h3{
			color:$font-active;
		}

		&:after{
			background: $font-active;
		}
	}

	li.last{
		&:before{
			display:none;
		}
	}

	h3{
		color: map-get($font,normal);
		font-weight: normal;
		line-height: map-get($line,m);
	}

	h6{
		color:map-get($font, black);
		padding:0 0 px2rem(8) 0;
	}

	p{
		@include font(s);
		color:map-get($font,light);
	}
}
</style>

<script>
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'

const pageSize = 10

export default {
  data () {
    return {
    	title: '媒体报道',
    	list: [],
    	page: 1,
    	allData: false,
    	loadingData: false
    }
  },

  created(){
  	this.getList(this.page)

  	$(window).on('scroll', () => {
  	  var scrollTop = $(window).scrollTop()
	　　 var scrollHeight = $(document).height()
	　　 var windowHeight = $(window).height()
			var fix = 50
	$('.test').html(scrollTop + windowHeight +':' + scrollHeight)
	　　 if(scrollTop + windowHeight >= scrollHeight - fix && !this.allData && !this.loadingData){
	　　　　 this.getList(++this.page)
	　　 }
  	})
  },

  methods: {
  	getList(page){
  		this.loadingData = true
  		this.$http.get('/home/news', {params: {pageSize, pageIndex: page}}).then((response) => {
  		response.json().then((res) => {
  			this.loadingData = false

  			if(res.Result){
  				this.list = this.list.concat(res.Data)
  			}

  			if(!res.Data.length){
  				this.allData = true
  			}

  		})
  	})
  	}
  },

  components: {
  	'component-header': Header,
  	'component-footer' : Footer
  }
}
</script>