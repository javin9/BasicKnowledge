<template>
    <div class="wheel wheel-hook" v-el:wheel>
        <ul class="wheel-scroll wheel-scroll-hook" >
            <li v-for="item in items" class="wheel-item" data-val="{{item.value}}">{{item.text}}</li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    export default{
        props:{
            items:{
                type:Array,
                default:[]
            },
            isShow:{
                type:Boolean,
                default:false
            },
            defaultIndexItem:{
                type:Number,
                default:0
            },
            index:{
                type:Number
            }
        },
        data(){
          return {
              scrollItem:null
          }
        },
        methods:{
          updateScroll(){
              if(!this.scrollItem){
                  this.scrollItem = new BScroll(this.$els.wheel, {
                      wheel: true,
                      selectedIndex:this.curIndex
                  });
                  //滚动相关事件
                  this.scrollItem.on("scrollStart",()=>{
                      this.$dispatch('scrollStart',this.index,this.scrollItem.getSelectedIndex());
                  })
                  this.scrollItem.on("scrollEnd",()=>{
                      this.$dispatch('scrollEnd',this.index,this.scrollItem.getSelectedIndex());
                  })
              }else{
                  this.scrollItem.enable();
                  this.scrollItem.refresh();
              }
          }
        },
        computed:{
            curIndex(){
               return this.defaultIndexItem > this.items.length-1?this.items.length-1:this.defaultIndexItem;
            }
        },
        watch:{

            isShow(){
                if(this.isShow){
                    this.updateScroll();
                }else{
                    if(this.scrollItem){
                        this.scrollItem.disable();
                    }
                }
            },
            items(){
                this.updateScroll();
            },
            defaultIndexItem(){
                this.updateScroll();
            }
        },
        events:{
            deselect(){
                this.scrollItem.wheelTo(this.curIndex);
            }
        },
        ready(){
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/mixin';
    @import 'sassHelper/vars';
    .wheel{
        flex:1;
        height:px2rem(346);
        overflow: hidden;
        @include fsize(42);
        .wheel-scroll{
            margin-top:px2rem(136);
            line-height:px2rem(72);
            .wheel-item{
                height:px2rem(72);
                overflow: hidden;
                white-space: nowrap;
                color: #333;
            }
        }
    }
</style>
