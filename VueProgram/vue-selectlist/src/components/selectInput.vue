<!-- <template>
    <div class="clearFix">
      <input
        readonly='readonly'
        class="keyWord"
        @click="showListHandle"
        :value="title"
      />
      <input type="button" value="GO">
      <span></span>
    </div>
</template>

<script>

export default {
  props:['isShow',"title"],
  computed:{
    initShow(){
        return this.isShow
    }
  },
  methods: {
    showListHandle(){
        this.$emit("update:isShow", !this.initShow)
    }
  }
}
</script>
 -->
 <template>
    <div class="clearFix">
      <input type="text" 
      placeholder="请输入" 
      :value="title"
      class="keyWord" 
      @click="clickInput" 
      readonly="readonly"  />
      <input type="button" value="GO">
      <span></span>
    </div>
 </template>

<script>

export default {
  props:["title"],
  data:function(){
    return {
      showList:false
    }
  },
  methods:{
       clickInput:function () {
         /* body... */
         console.log(this);
         this.showList=!this.showList;
         this.$emit("updateShowList",this.showList);
       }
  }
}
</script>
