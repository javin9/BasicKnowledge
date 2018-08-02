<template>
      <div class="audio-wrapper clearfix" >
            <audio :ref="audioId">
                <source :src="src" type="audio/mp3">
            </audio>
            <div class="audio-controls">
                <!-- 暂停 -->
                <i class="icon iconfont icon-zanting" @click="tapPause"  v-if="isPlay"></i>
                <!-- 播放 -->
                <i class="icon iconfont icon-bofang"  @click="tapPlay" v-else></i>
            </div>
            <div 
                 :ref="audioProgressBar"
                 class="audio-info"
                 @mousedown="onMouseDown($event)"
            >
                <span   class="progress-dot"
                         :ref="audioDot"
                        :style="progressDotStyle"
                ></span>
                <div class="progress-bar-slider" :style="progressBarStyle"></div>
            </div>
            <span style="display:none;" class="time-progress">{{showTime}}</span>
        </div>
</template>

<script>
const NUMBER_100 = 100; //hundred
const NUMBER_3600 = 3600;
const NUMBER_60 = 60;

export default {
  props: {
    audioId: {
      type: String,
      required: true
    },
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isPlay: false,
      dotLeftVaule: 0,
      barWidthValue: 100,
      currentTime: "",
      totalTime: "",
      startPostion: 0,
      minValue: 0,
      maxValue: 0,
      startMove: false
    };
  },
  computed: {
    audioSelector() {
      return this.$refs[this.audioId];
    },
    progressDotStyle() {
      var value = this.dotLeftVaule * NUMBER_100;
      let left = `${value}%`;
      return {
        left: left
      };
    },
    progressBarStyle() {
      var value = this.dotLeftVaule * NUMBER_100;
      let width = `${value}%`;
      return {
        width: width
      };
    },

    showTime() {
      return `${this.currentTime}/${this.totalTime}`;
    },
    audioProgressBar() {
      return `${this.audioId}Progress`;
    },
    audioProgressBarSelector() {
      return this.$refs[this.audioProgressBar];
    },
    audioProgressBarOffset() {
      return this.audioProgressBarSelector.getBoundingClientRect();
    },
    audioDot() {
      return `${this.audioId}Dot`;
    },
    audioDotSelector() {
      return this.$refs[this.audioDot];
    }
  },
  created() {},
  mounted() {
    // this.$refs.myaudio.play();
    this.addEventListener();
  },
  methods: {
    addEventListener() {
      //监听音频加载完毕
      this.audioSelector.addEventListener(
        "canplaythrough",
        () => {
          this.totalTime = this.transTime(this.audioSelector.duration);
        },
        false
      );
      // 监听音频播放时间并更新进度条
      this.audioSelector.addEventListener(
        "timeupdate",
        () => {
          this.updateProgress();
        },
        false
      );
      //监听播放完成事件
      this.audioSelector.addEventListener(
        "ended",
        () => {
          this.audioEnded();
        },
        false
      );
    },
    tapPlay() {
      console.log("to paly");
      this.isPlay = true;
      this.audioSelector.play();
      this.$emit("paly",this.audioSelector);
    },
    tapPause() {
      console.log("to pause");
      this.isPlay = false;
      this.audioSelector.pause();
      this.$emit("pause");
    },
    updateProgress() {
      /*更新进度条*/
      let audio = this.audioSelector;
      this.dotLeftVaule = audio.currentTime / audio.duration;
      this.currentTime = this.transTime(audio.currentTime);
    },
    onMouseDown(ev) {
      /**
       * 点击进度条跳到指定点播放
       * 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
       * */
      if (!this.audioSelector.paused || this.audioSelector.currentTime != 0) {
        var pgsWidth = this.audioProgressBarSelector.getBoundingClientRect()
          .width;
        var rate = ev.offsetX / pgsWidth;
        this.audioSelector.currentTime = this.audioSelector.duration * rate;
        this.updateProgress();
      }
    },
    transTime(value) {
      /**
       * 音频播放时间换算
       * @param {number} value - 音频当前播放时间，单位秒
       */
      //小时
      var h = parseInt(value / NUMBER_3600);
      //分钟
      value = value % NUMBER_3600;
      var m = parseInt(value / NUMBER_60);
      //毫秒
      var s = parseInt(value % NUMBER_60);

      return h > 0
        ? this.formatTime(h + ":" + m + ":" + s)
        : this.formatTime(m + ":" + s);
    },
    formatTime(value) {
      var time = "";
      var s = value.split(":");
      var i = 0;
      for (; i < s.length - 1; i++) {
        time += s[i].length == 1 ? "0" + s[i] : s[i];
        time += ":";
      }
      time += s[i].length == 1 ? "0" + s[i] : s[i];

      return time;
    },
    audioEnded() {
      //播放完成
      setTimeout(() => {
        this.dotLeftVaule = 0;
        this.barWidthValue = 0;
        this.isPlay = false;
      }, 300);
    }
  }
};
</script>

<style lang="less">
@import url("../../assets/style/base.less");
.audio-wrapper {
  box-sizing: border-box;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  padding: 0 12px;
  width: 196px;
  height: 22px;
  background: #f7f7f7;
  border-radius: 100px;
  overflow: hidden;
  .audio-controls {
    i {
      font-size: 10px;
      color: #4cc760;
      cursor: pointer;
    }
  }
  .audio-info {
    margin-left: 12px;
    position: relative;
    width: ~"calc(100% - 20px)";
    height: 6px;
    background: #e5e5e5;
    border-radius: 3px;
    .progress-dot {
      position: absolute;
      left: 0;
      margin-top: -3px;
      margin-left: -3px;
      z-index: 15;
      width: 12px;
      height: 12px;
      background: #ffffff;
      .cm-border-radius(50%);
      cursor:pointer;
      //   .cmn-transition(all 0.3s);
    }
    .progress-bar-slider {
      position: absolute;
      left: 0;
      top: 0;
      background: #4cc760;
      border-radius: 3px;
      width: 0;
      height: 6px;
      z-index: 9;
      //   .cmn-transition(all 0.3s);
    }
  }
  .time-progress {
    position: absolute;
    right: 0;
    z-index: 10;
    font-size: 10px;
    color: #e5e5e5;
  }
}
</style>


