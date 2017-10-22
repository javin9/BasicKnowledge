<template>
    <div class="page">
        page
        <msg :love="message"></msg>
    </div>
</template>

<script>
import msg from './msg.vue'
 
export default {
 name: 'page',
 components: { msg },
 data () {
  return {
   message: 'page-msg'
  }
 }
}
</script>