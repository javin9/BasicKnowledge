# 音乐播放器

### 使用方式
<custom-audio @play="onPlay" @pause="onPause"   :audio-id="`audio_${index}`" :src="url" />

### props
	* audio-id : String, 播放器的id，必填
	* src: String, 音频地址，必填

### events
	* play:Function,播放
    * pause:Function, 暂停
###  end