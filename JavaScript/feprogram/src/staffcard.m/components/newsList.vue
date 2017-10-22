<template>
	<div class="component-newslist">
		<section v-show="isShow">
			<h2 class="component-newslist-title">近期活动</h2>
			<ul class="component-newslist-list">
				<li class="component-newslist-list-item" v-for="newslist in newslists" :key="newslist.id">
					<a :href="newslist.link">
						<div>
							<h3>{{newslist.title}}</h3>
							<p v-html="newslist.description"></p>
						</div>
						<em></em>
					</a>
				</li>
			</ul>
		</section>
		<section v-show="isEmpty" class="component-newslist-empty">暂无数据，敬请期待</section>
		<div class="component-newslist-tip" id="bottomTip" v-show="isEnd">更多活动，敬请期待</div>
	</div>
</template>

<style scoped>
  @import './_newslist.scss';
</style>

<script>
	export default {
		props:  {
			isShow: {
                type: Boolean,
                default: false
            },
            isEnd: {
            	type: Boolean,
            	default: false // true:加载完所有列表
            },
            isEmpty: {
            	type: Boolean,
            	default: false // true:列表为空
            }
		},
		data(){
			return {
				api_url: '', // 开发和测试的路径都没有portal
				staffNum: EmployeeNumber, // 工号
				newslists: [], // 列表
				pageIndex: 1, // 当前页码
				pageSize: 5, // 每页条数
				totalNum: 0, // 总条数
				loadingFlag: false // true:正在加载
			}
		},
		ready(){
			this.domInit()
		},
		methods: {
			domInit(){
			    // 区分开发测试还是线上，接口地址不一样
				if( typeof(dev)!== 'undefined' ){
				    // 开发和测试环境，无portal
				    this.api_url = '/QRCode/GetActivityByEmployeeNum'
				} else {
				    // 线上环境，有portal
                    this.api_url = '/portal/QRCode/GetActivityByEmployeeNum'
				}
				// 滚动加载
				let screenHeight = window.screen.height;
				const baseX = parseInt($("html").css("font-size").replace("px", "")),
					dpr = $('html').attr('data-dpr');

				this.getList();
				// 不足一屏
				setTimeout(()=>{
					if( !this.loadingFlag ){
					    if( $(document).height() <= $(window).height() ){
					    	this.getList()
					    }
				    }
				}, 300)
			    // 超出一屏
				$(window).scroll( ()=> {
				    let scrollHeight = document.body.scrollTop || document.documentElement.scrollTop,
				    	documentHeight = document.body.scrollHeight;
				    if( !this.loadingFlag ){
					    if ( screenHeight + scrollHeight >= documentHeight / dpr) {
				    		this.getList()
					    }
				    }
				});

			},
			getList(){
				if( this.isEnd || this.isEmpty || this.loadingFlag ){
					return;
				}
				tools.$ajax({
					url: `${this.api_url}?employerNumber=${this.staffNum}&pagecount=${this.pageSize}&pageindex=${this.pageIndex}`,
	            	type: 'GET',
	            	success: (res) => {
	            		this.loadingFlag = true

	            		if(res.Result){

	            			this.totalNum += res.RowCount

	            			if( this.totalNum > 0 ){
	            				// 有数据
	            				this.isEmpty = false
	            				this.isShow = true
	            			} else {
	            				// 无数据
	            				this.isEmpty = true
		            			this.isShow = false
	            				return
	            			}

	            			let data = res.Data,
	            				newData = [];
	            			for( let i in data ){
	            				let obj = {};

	            				obj.id = data[i].ID
	            				obj.title = data[i].Title
	            				obj.description = data[i].Description.replace(/\r|\n/g, '<br/>')
	            				obj.link = data[i].Link

	            				newData.push(obj)
	            			}
	            			this.newslists = this.newslists.concat(newData)

	            			if( this.totalNum > 0 && ( res.RowCount == 0 || res.Data.length == 0 ) ){
								this.isEnd = true
	            			} else {
	            				this.isEnd = false
	            			}
	            				this.pageIndex ++

	            		} else {
	            			this.isEmpty = true
	            			this.isShow = false
	            			this.isEnd = false
	            		}
	            		this.loadingFlag = false
	            	},
	            	complete(){
	            		this.loadingFlag = false
	            	}
	            })
			}
		},
	}
</script>