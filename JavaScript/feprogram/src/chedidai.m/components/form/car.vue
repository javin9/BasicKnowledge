<template>
  <div class="component-car" :class="{'select': !readonly, 'border': border, 'disabled':disabled}">
    <label><span>{{label}}</span></label>
    <div @click="selectCar" v-if="!readonly">
      <span v-if="value.name">{{value.name}}</span>
      <em class="holder" v-else>{{placeholder}}</em>
    </div>
    <div v-else>
      <span>{{value.name}}</span>
    </div>
  </div>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  @import './mixin';

  .component-car{
    @include form-element(car);
    &.disabled{
      @include form-element(car_disabled);
      color:$disabled-color;
      &.select{
        &>div:after{
             border-top: 2px solid $disabled-color !important;
             border-right: 2px solid $disabled-color !important;
        }
      }
    }
    >div >span{
      display: inline-block;
      max-width:px2rem(360);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &.select{
      @include form-select;
    }
  }
</style>

<script>
    import car from 'libs/carSelect'

    export default {
        props: {
            border: {
                type: Boolean,
                default: false
            },
            initialValue: Object,
            name: {
                type: String,
                default: 'car'
            },
            event: {
                type: String,
                default: 'updateForm'
            },
            readonly: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            label: {
                type: String,
                default: '品牌车型'
            },
            placeholder: {
                type: String,
                default: '请选择车型'
            }
        },

        data () {
            return {
                value: this.initialValue || {},
            }
        },

        watch: {
            value(value){
                this.$dispatch(this.event, this.name, value)
            },

            initialValue(value, oldValue){
                if (value.name !== oldValue.name) {
                    this.value.name = value.name
                    this.value.id = value.id
                }
            }
        },

      methods: {
          selectCar(){
              if (!this.disabled) {
                  car.carSelect({
                      onlyOnSale: false,
                      showLevel: 3,
                      showAllBrand: false,
                      hide: true,
                      showAllBrand: true,
                      showSearch: false,
                      type: 'chezhudai'
                  }, result => {
                      const brandName = result.brand.name.indexOf(result.masterBrand.name) >= 0 ? result.brand.name : `${result.masterBrand.name} ${result.brand.name}`
                      this.value = {
                          name: `${brandName} ${result.year}款 ${result.carType.name}`,
                          id: result.carType.id
                      }
                      this.$dispatch('setDatePicker', result.year)
                  })
              }
          }
      }
  }
</script>