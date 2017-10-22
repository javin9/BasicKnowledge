<template>
    <section id="popSuccessWrap" class="succ_wrap">
        <div class="succ_cont">
            <!-- <a href="javascript:void(0);" id="closeSuccess" class="btn_close" @click="close"></a> -->
            <section class="succ_top">
                <i class="i_ok"></i>
                <p>申请已提交</p>
                <p>继续在线办理贷款手续</p>
            </section>
            <section class="succ_step">
                <!-- class为succ_step_1就是当前在第一步 -->
                <ul class="succ_step_list succ_step_1">
                    <li>
                        <i>1</i>
                        <span>提交申请<br/>陪同看车</span>
                    </li>
                    <li>
                        <i>2</i>
                        <span>上传材料<br/>在线审核</span>
                    </li>
                    <li>
                        <i>3</i>
                        <span>签订合同<br/>放款提车</span>
                    </li>
                </ul>
            </section>
            <section class="succ_best">
                <ul class="succ_best_list">
                    <li>
                        <i class="i_zizhu"></i>
                        <span>自主提交<br/>不跑门店</span>
                    </li>
                    <li>
                        <i class="i_zhuanshu"></i>
                        <span>专属顾问<br/>随时应答</span>
                    </li>
                    <li>
                        <i class="jindu"></i>
                        <span>进度可查<br/>审批更快</span>
                    </li>
                </ul>
            </section>
            <section class="succ_btn">
                <a href="javascript:void(0);" class="btn_gold" @click="apply">立即在线办理</a>
                <a href="javascript:void(0);" class="btn_link" @click="close">查看订单</a>
            </section>
        </div>
    </section>
</template>

<style scoped>
@import 'sassHelper/mixin';

// flex
.uf { display: -webkit-box; display: -webkit-flex; display: flex; position:relative;}
.uf_ac{ -webkit-align-items: center; align-items: center; -webkit-box-align: center; }
.uf_f1{ position:relative; -webkit-box-flex: 1; box-flex: 1; -webkit-flex: 1; flex: 1; }

.succ_wrap {
	z-index: 99999;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.3);

	.succ_cont {
	    position: absolute;
		padding-top: px2rem(50);
		padding-bottom: px2rem(30);
		text-align: center;
		background-color: #fff;
		border-radius: 6px;
		width: px2rem(690);
		left: 50%;
		top: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);

        .btn_close {
            position: absolute;
            top: px2rem(-56);
            right: 0;
            width: px2rem(46);
            height: px2rem(46);
            background: url('./images/close_btn_img.png') no-repeat center center;
            background-size: cover;
        }

		.succ_top {

			.i_ok {
				display: block;
				width: px2rem(100);
				height: px2rem(100);
				margin: 0 auto;
				background: url('./images/icon-ok.png') no-repeat center center;
                background-size: cover;
			}

			p {
				margin: px2rem(10) 0;
				line-height: 1.5;
				@include fsize(32);
			}
		}

		.succ_step {
			margin: px2rem(30) px2rem(30) 0;
			padding-top: px2rem(20);
			padding-bottom: px2rem(20);
			background-color: #f8f8f8;
			border-radius: 6px;

			&_list {
				@extend .uf;
				margin: 0 px2rem(35);

				li {
					@extend .uf_f1;

					&:before,
					&:after {
						content: "";
						position: absolute;
						z-index: 0;
						top: px2rem(15);
						display: block;
						width: 50%;
						height: px2rem(4);
						background-color: #dfdfdf;
					}

					&:before {
						left: 0;
					}

					&:after {
						right: 0;
					}

					i {
						position: relative;
						z-index: 1;
						display: inline-block;
						width: px2rem(30);
						height: px2rem(30);
						margin: px2rem(5);
						text-align: center;
						@include fsize(24);
						line-height: px2rem(30);
						color: #fff;
						background-color: #dfdfdf;
						border-radius: 100%;
						font-style: normal;
					}

					span {
						display: block;
						margin-top: px2rem(14);
						@include fsize(28);
						color: #333;
						line-height: 1.6;
					}
				}

				&.succ_step_1 li:nth-child(1),
				&.succ_step_2 li:nth-child(2),
				&.succ_step_3 li:nth-child(3),
				&.succ_step_2 li:nth-child(1),
				&.succ_step_3 li:nth-child(1),
				&.succ_step_3 li:nth-child(2),
				&.succ_step_3 li:nth-child(3) {
					i {
						width: px2rem(40);
						height: px2rem(40);
						margin: 0;
						line-height: px2rem(40);
						background: #DBB76C;
					}
					&:before {
					    background: #DBB76C;
					}
				}

				&.succ_step_2 li:nth-child(1),
				&.succ_step_3 li:nth-child(1),
				&.succ_step_3 li:nth-child(2),
				&.succ_step_3 li:nth-child(3) {
					&:after {
					    background: #DBB76C;
					}
				}
			}

		}

		.succ_best {
			margin: 0 px2rem(30);
			padding: px2rem(40) 0;

			&_list {
				@extend .uf;

				li {
					@extend .uf_f1;

					i {
						display: inline-block;
						width: px2rem(100);
						height: px2rem(100);
						background-position: center center;
						background-repeat: no-repeat;
						background-size: 100%;

						&.i_zizhu {
							background-image: url('./images/zizhutijiao.png');
						}

						&.i_zhuanshu {
							background-image: url('./images/zhuanshuguwen.png');
						}

						&.jindu {
							background-image: url('./images/jindu.png');
						}
					}

					span {
						display: block;
						margin-top: 14px;
						@include fsize(24);
						color: #666;
						line-height: 1.5;
					}
				}
			}

		}

		.succ_btn {
			margin: 0 px2rem(30);

			.btn_gold {
				display: block;
				width: 100%;
				margin-bottom: px2rem(20);
				padding: px2rem(25) 0;
				text-align: center;
				@include fsize(32);
				color: #fff;
				background: #DBB76C;
				border-radius: 6px;
			}

			.btn_link {
			    display: block;
				padding: px2rem(10);
				@include fsize(32);
				line-height: px2rem(48);
				color: #666666;
			}
		}
	}
}
</style>

<script>
export default {
    props: [
        'applyLink'
    ],
    data: function() {
        return {
        }
    },
    computed: {},
    methods: {
        apply: function() {
            location.href = this.applyLink;
        },
        close: function() {
            this.$emit('close');
        }
    }
}
</script>