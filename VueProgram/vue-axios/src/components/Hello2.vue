<template>
  <div class="hello">
    一起学习axios
  </div>
</template>

<script>

  import axios from 'axios'

  var HTTP = axios.create({
    baseURL:'http://easy-mock.com/mock/596077559adc231f357bcdfb/axios/',
    timeout: 1000,
    responseType:'json',
    params:{
      book:"123"
    },
    headers:{
        'custome-header': 'miaov',
    }
  })

export default {
  name: 'hello',
  created(){
    HTTP.get("test-axios")
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
