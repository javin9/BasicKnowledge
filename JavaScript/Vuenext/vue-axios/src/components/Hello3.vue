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
    /*validateStatus(status){
        console.log(status)
      return status < 400;
    }*/
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
        console.log(error)
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
