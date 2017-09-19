<template>
  <div class="hello">
    一起学习axios
  </div>
</template>

<script>
  export default {
  name: 'hello',
  created(){
      this.$http.get('http://easy-mock.com/mock/596077559adc231f357bcdfb/axios/test-axios')
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
