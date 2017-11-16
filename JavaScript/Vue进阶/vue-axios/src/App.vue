<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'app',
  created(){
    axios({
      method:'get',
      url:'http://easy-mock.com/mock/59bf2621e0dc663341ad67cc/example/getcars',
      params:{
        a:1,
        b:3,
        c:"er"
      }
    }).then((response)=>{
       console.log(response.data);//
    });
    
    axios.get('http://easy-mock.com/mock/59bf2621e0dc663341ad67cc/example/getcars',{
       params:{
        a:1,
        b:3,
        c:"er"
      }
    }).then((response)=>{
       console.log(response.data);//
    });
    axios.post('http://easy-mock.com/mock/59bf2621e0dc663341ad67cc/example/postgetcars',{
         a:1,
        b:3,
        c:"er"
      }
    ).then((response)=>{
         console.log(response)
    });
    
      /*axios({
        method: 'post',
        url:'http://easy-mock.com/mock/596077559adc231f357bcdfb/axios/test-post-axios'
      })
        .then((response)=>{
            console.log(response.data)
        })
        .catch((error)=>{
            console.log(error)
        })*/

      /*axios.delete('http://easy-mock.com/mock/596077559adc231f357bcdfb/axios/test-delete')
        .then((response)=>{
          console.log(response.data)
        })
        .catch((error)=>{
          console.log(error)
        })*/
    /*axios.post('http://easy-mock.com/mock/596077559adc231f357bcdfb/axios/test-post-axios',{
      miaov:"课堂"
    })
      .then((response)=>{
        console.log(response.data)
      })
      .catch((error)=>{
        console.log(error)
      })*/
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
