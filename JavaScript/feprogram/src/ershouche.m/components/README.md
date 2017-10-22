#list.vue 文件上传组件

### 使用
<list v-bind:sourceidone="sourceidone" v-bind:sourceidtwo="sourceidtwo" v-bind:prosize="prosize" v-bind:cityid="cityid"></list>
### props
	* sourceidone:888888888, //同车系 source id
    * sourceidtwo:999999999, //同价位 source id
    * prosize:24,            //请求多少条
    * cityid:201,            //城市ID



#bottombtn.vue 文件上传组件

### 使用
<bottombtn v-bind:bottombtn="bottombtn" v-bind:submit="submit"></bottombtn>

### props
	bottombtn:{
            src:'http://img8.taoche.cn/1c/02170ku7xx.jpg',  // 展示车图连接
            paydown:'8400元',                               // 首付价格(此处只是展示,未做任何处理,请算好数值加上单位传过来)
            monthly:'840元',                                // 月供价格(此处只是展示,未做任何处理,请算好数值加上单位传过来)
            tel:4008008888,                                 // 顾问电话 (无贷款顾问时清传 tel:'' )
          }

    submit://等待曹齐定数据 再进行写