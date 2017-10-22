<template>
    <section class="game-car" v-show="isShow" transition="fade">
        <div class="logo"></div>
        <div class="swiper-container" id="car-swiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="car in cars"><img :src="car.image" alt=""></div>
            </div>
        </div>
        <div class="feature-wrapper">
            <div class="feature-center">
                <div class="feature">
                    <div class="name">颜值</div>
                    <div class="value">{{selectedCar.appearance}}分</div>
                    <div class="bar"><div :style="{ width: (selectedCar.appearance - 20) / 80 * 100 + '%' }"></div></div>
                </div>
                <div class="feature">
                    <div class="name">爆发力</div>
                    <div class="value">{{selectedCar.boost}}分</div>
                    <div class="bar"><div :style="{ width: (selectedCar.boost - 20) / 80 * 100 + '%' }"></div></div>
                </div>
                <div class="feature">
                    <div class="name">操控力</div>
                    <div class="value">{{selectedCar.control}}分</div>
                    <div class="bar"><div :style="{ width: (selectedCar.control - 20) / 80 * 100 + '%' }"></div></div>
                </div>
                <div class="ok-btn" @click="select"></div>
            </div>
        </div>
        <div class="sound-btn" :class="{ 'sound-off': !sound }" @click="toggleSound"></div>
    </section>
</template>
<script type="text/ecmascript-6">
    import 'libs/swiper';

    export default{
        props:{
            isShow:{
                type:Boolean,
                default:false
            },
            cars: {
                type: Array,
                default: []
            },
            loader: {
                type: Object,
                default: null
            },
            sound:{
                type:Boolean,
                default:true
            },
            orientation: {
                type:String,
                default: ''
            }
        },
        data() {
            return {
                selectedIndex: 0,
                swiper: null
            }
        },
        computed: {
            selectedCar() {
                return this.cars[this.selectedIndex];
            }
        },
        methods:{
            select() {
                this.$dispatch('gameStart', this.selectedCar);
            },
            toggleSound() {
                if (this.sound) {
                    this.$dispatch('soundOff');
                } else {
                    this.$dispatch('soundOn');
                }
            },
            createSwiper(initNum) {
                if (!this.swiper) {
                    this.swiper = new Swiper ('.swiper-container', {
                        initialSlide: initNum || 0,
                        loop: true,
                        spaceBetween: Math.round(80 * document.documentElement.clientWidth / 750),
                        effect: 'coverflow',
                        grabCursor: true,
                        centeredSlides: true,
                        slidesPerView: 'auto',
                        coverflow: {
                            rotate: 0,
                            stretch: 0,
                            depth: 250,
                            modifier: 1,
                            slideShadows : false
                        },
                        onTouchEnd: (swiper) => {
                            // setTimeout是为了解决swiper.activeIndex不正确的问题，可能会是旧的index
                            setTimeout(() => {
                                this.selectedIndex = swiper.activeIndex % this.cars.length; //切换结束时，告诉我现在是第几个slide
                            });
                        }
                    });
                }
            },
            distroySwiper() {
                if (this.swiper) {
                    this.swiper.destroy(true, true);
                    this.swiper = null;
                }
            },
            setRem() {
                !function (N, M) {
                    function L() {
                        var a = I.getBoundingClientRect().width;
                        a / F > 540 && (a = 540 * F);
                        var d = a / 10;
                        I.style.fontSize = d + "px", D.rem = N.rem = d
                    }

                    var K, J = N.document, I = J.documentElement, H = J.querySelector('meta[name="viewport"]'), G = J.querySelector('meta[name="flexible"]'), F = 0, E = 0, D = M.flexible || (M.flexible = {});
                    if (H) {
                        console.warn("将根据已有的meta标签来设置缩放比例");
                        var C = H.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
                        C && (E = parseFloat(C[1]), F = parseInt(1 / E))
                    } else {
                        if (G) {
                            var B = G.getAttribute("content");
                            if (B) {
                                var A = B.match(/initial\-dpr=([\d\.]+)/), z = B.match(/maximum\-dpr=([\d\.]+)/);
                                A && (F = parseFloat(A[1]), E = parseFloat((1 / F).toFixed(2))), z && (F = parseFloat(z[1]), E = parseFloat((1 / F).toFixed(2)))
                            }
                        }
                    }
                    if (!F && !E) {
                        var y = N.navigator.userAgent, x = (!!y.match(/android/gi), !!y.match(/iphone/gi)), w = x && !!y.match(/OS 9_3/), v = N.devicePixelRatio;
                        F = x && !w ? v >= 3 && (!F || F >= 3) ? 3 : v >= 2 && (!F || F >= 2) ? 2 : 1 : 1, E = 1 / F
                    }


                    L();
                }(window, window.lib || (window.lib = {}));
            }
        },
        watch: {
            isShow(value) {
                if (value) {
                    // 选车swiper
                    setTimeout(() => {
                        this.createSwiper(this.selectedIndex);
                    });

                    // 高度自适应
                    if ($('.feature-wrapper').height() < $('.feature-center').height()) {
                        $('.feature-wrapper').addClass('thin');
                    } else {
                        $('.feature-wrapper').removeClass('thin');
                    }
                } else {
                    setTimeout(() => {
                        this.distroySwiper();
                    }, 300);
                }
            }
        },
        ready() {
            var mql = window.matchMedia('(orientation: portrait)');
            mql.addListener((mql) => {
                if (this.isShow) {
                    this.setRem();
                    if(mql.matches) {
                        // 竖屏
                        this.createSwiper(this.selectedIndex);
                    }else {
                        // 横屏
                        this.distroySwiper();
                    }
                }
            });
        }
    };


</script>
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    .game-car {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: url(../images/car-bg.html.jpg) no-repeat center bottom;
        background-size: cover;

        .logo {
            position: absolute;
            top: px2rem(30);
            left: px2rem(30);
            width: px2rem(214);
            height: px2rem(43);
            background: url(../images/logo.html.png) no-repeat center center;
            background-size: cover;
        }

        #car-swiper {
            position: relative;
            margin-top: px2rem(25);

            .swiper-slide {
                position: relative;
                width: px2rem(560);
                height: px2rem(520);

                img {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                }

                &:after {
                    content: '';
                    position: absolute;
                    right: px2rem(35);
                    bottom: px2rem(60);
                    width: px2rem(190);
                    height: px2rem(29);
                    background: url(../images/taoche.html.png) no-repeat center center;
                    background-size: cover;
                }
            }
        }

        .feature-wrapper {
            position: absolute;
            top: px2rem(550);
            bottom: px2rem(100);
            left: 0;
            right: 0;

            .feature-center {
                position: absolute;
                left: 0;
                right: 0;
                top: 50%;
                transform: translate(0, -50%);
            }

            &.thin {
                bottom: px2rem(45);

                .feature {
                    margin-bottom: px2rem(12);
                }

                .ok-btn {
                    margin-top: px2rem(12);
                }
            }
        }

        .feature {
            position: relative;
            width: px2rem(562);
            height: px2rem(125);
            background: url(../images/car-attr-bg.html.png) no-repeat left top;
            background-size: 100% auto;
            margin: 0 auto px2rem(22) ;
            color: #ffffff;
            text-shadow: px2rem(2) px2rem(2) 0 rgba(6,54,172,0.47);

            .name {
                font-size: px2rem(46);
                line-height: px2rem(52);
                width: px2rem(195);
                text-align: center;
                padding-top: px2rem(15);
                font-weight: bold;
            }

            .value {
                font-size: px2rem(36);
                line-height: px2rem(40);
                width: px2rem(195);
                text-align: center;
            }

            .bar {
                position: absolute;
                left: px2rem(194);
                top: px2rem(60);
                width: px2rem(340);
                height: px2rem(53);

                div {
                    height: 100%;
                    background: url(../images/car-attr.html.png) repeat-x right top;
                    background-size: auto 100%;
                    animation-name: bar;
                    animation-duration: 0.6s;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    transition: all 0.3s ease 0s;
                    border-radius: 0 px2rem(20) px2rem(20) 0;
                    overflow: hidden;
                }
            }

            @keyframes bar {
                0%   { background-position: 0 0; }
                100% { background-position: px2rem(-26) 0; }
            }
        }

        .ok-btn {
            width: px2rem(554);
            height: px2rem(134);
            background: url(../images/ok-btn.html.png) no-repeat center center;
            background-size: contain;
            margin: px2rem(40) auto 0;
        }

        .sound-btn {
            position: absolute;
            top: px2rem(30);
            right: px2rem(30);
            z-index: 200;
            width: px2rem(88);
            height: px2rem(88);
            background: url(../images/sound-on.html.png) no-repeat center center;
            background-size: contain;

            &.sound-off {
                background-image: url(../images/sound-off.html.png);
            }
        }
    }
</style>