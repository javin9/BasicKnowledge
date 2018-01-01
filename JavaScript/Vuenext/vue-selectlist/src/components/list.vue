<!-- <template>
    <ul class="list">
      <li v-for="item in data" @click="getTitleHandle(item.title)">{{item.title}}</li>
    </ul>
</template>

<script>
export default {
    props:["data"],
  methods:{
    getTitleHandle(title){
      this.$emit('changeTitle', title)
    }
  }
}
</script>
 -->
 <template>
    <ul class="list">
      <li v-for="item in dataList"  @click="selectItem(item.title)">{{item.title}}</li>
    </ul>
</template>

<script>
export default {
 props:["dataList"],
 methods:{
 	selectItem(title){
 		this.$emit("selectItem",title);
 	}
 }
}
</script>
