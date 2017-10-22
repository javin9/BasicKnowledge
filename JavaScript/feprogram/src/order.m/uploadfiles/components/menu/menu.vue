<template>
    <section class="app-menu" v-show="show" @click.self="close" transition="fademenu">
        <ul>
            <li class="menu-item" v-for="(index, item) in items" v-text="item.text" :class="item.className" @click="itemclick(item.todo, index, $event)"></li>
            <li class="menu-item cancel" v-text="'取消'" @click="close"></li>
        </ul>
    </section>
</template>

<style>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    $red: map-get($colors, red);
    .app-menu {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 12000;

        ul {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;

            li {
                border-bottom: 1px solid #cdced2;
                background: #ffffff;
                @include fsize(32);
                line-height: px2rem(108);
                color: #000000;
                text-align: center;

                &:nth-last-child(1) {
                    border-bottom: 0;
                }

                &.active {
                    color: $red;
                }
            }
        }
    }

    /* always present */
    .fademenu-transition {
      transition: all .3s ease;

      ul {
        transition: all .3s ease .1s;
      }
    }
    /* .expand-enter defines the starting state for entering */
    /* .expand-leave defines the ending state for leaving */
    .fademenu-enter, .fademenu-leave {
      opacity: 0;

      ul {
        transform: translate(0, 100%);
      }
    }

    .fademenu-leave {
      transition: all .3s ease .1s;

      ul {
        transition: all .3s ease;
      }
    }
</style>
<script>
    export default{
        props: ['items', 'show'],
        data() {
            return {}
        },
        computed: {
        },
        components:{},
        methods: {
            close() {
                this.$dispatch('menu.close');
            },
            itemclick(fn, index, event) {
                if (typeof fn === 'function') {
                    fn.call();
                }
                this.$dispatch('menu.itemclick', index, event);
            }
        }
    }
</script>
