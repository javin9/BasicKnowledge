<template>
  <div class="hello">
    一起学习axios
  </div>
</template>

<script>

  import axios from 'axios'
  import queryString from 'queryString'

  var HTTP = axios.create({
    baseURL:'http://easy-mock.com/mock/596077559adc231f357bcdfb/axios/',
    timeout: 1000,
    responseType:'json',
    headers:{
      'custome-header': 'miaov',
      'content-type':'application/x-www-form-urlencoded'
    }
  })

  HTTP.interceptors.request.use(function(config){
    //在发送请求之前做某事
    console.log("拦截")
    console.log(config)
    return config;
  },function(error){
    //请求错误时做些事
    return Promise.reject(error);
  });

  HTTP.interceptors.response.use(function(data){
      console.log("response")
      console.log(data)
      return data;
  })




  export default {
  name: 'hello',
  created(){

    function http1(){
      return HTTP.get("test-axios")
    }

    function http2(){
      return HTTP.post("test-post-axios")
    }


      axios.all([http1(),http2()]).then(axios.spread((res1,res2)=>{
          console.log(res1)
          console.log(res2)
      }))
      .catch((error) =>{
        if (axios.isCancel(error)) {
          console.log(error.message);
        }else{
            console.log(error)
        }
    })

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
    font-size: 30px;
  }
</style>
