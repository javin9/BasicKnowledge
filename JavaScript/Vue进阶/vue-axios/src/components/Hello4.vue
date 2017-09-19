<template>
  <div class="hello">
    一起学习axios
  </div>
</template>

<script>

  import axios from 'axios'
  import queryString from 'queryString'

  var CancelToken = axios.CancelToken;
  var source = CancelToken.source();

  var HTTP = axios.create({
    baseURL:'http://easy-mock.com/mock/596077559adc231f357bcdfb/axios/',
    timeout: 1000,
    responseType:'json',
    headers:{
      'custome-header': 'miaov',
      'content-type':'application/x-www-form-urlencoded'
    },
    transformRequest:[function(data){
        console.log(data)
      data.age = 30;
      return queryString.stringify(data);
    }],
    transformResponse:[function(data){
        console.log("transformResponse")
        console.log(data)

      data.abc = 'miaov'

      return data;
    }],
    cancelToken: source.token
  })



export default {
  name: 'hello',
  created(){
    HTTP.post("test-post-axios123",{
        miaov:"ketang",  // miaov=ketang&username=leo
        username:"leo"
    })
      .then((response)=>{
          console.log(response.data)
      })
      .catch((error) =>{
        if (axios.isCancel(error)) {
          console.log(error.message);
        }else{
            console.log(error)
        }
    })

    source.cancel('操作被用户取消,因为时间太长了')

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
    font-size: 30px;
  }
</style>
