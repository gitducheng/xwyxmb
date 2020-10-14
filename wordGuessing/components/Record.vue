<template>
  <div class="g-record">
    <h3 class="g-record__time">{{time}}</h3>
    <el-button type="danger"
               @click="onClick"
               round>{{text}}</el-button>
    <el-button type="danger"
               @click="stopRecord"
               round>结束</el-button>
  </div>
</template>

<script>
import Recorder from 'js-audio-recorder'
export default {
  data () {
    return {
      INTERVAL: null,
      time: '00 : 00',
      isPlay: false,
      count: 0,
      recorder: new Recorder(),
      text: '开始'
    }
  },
  mounted () {
    this.timeStop()
  },
  beforeDestroy () {
    this.timeStop()
    this.recorder.destroy()
  },
  methods: {
    onClick () {
      if (!this.isPlay) {
        // 未开始或暂定状态，点击开始或继续录音
        this.text = '暂停'
        this.startRecord()
      }
      if (this.count > 0 && this.isPlay) {
        // 录音状态，点击暂定录音
        this.text = '继续'
        this.pauseRecord()
      }
      this.isPlay = !this.isPlay
    },
    getTime (time = 0) {
      let m = Math.floor(time / 60) + ''
      m = m.padStart(2, '0')
      let s = time % 60 + ''
      s = s.padStart(2, '0')
      return `${m} : ${s}`
    },
    timeStop () { clearInterval(this.INTERVAL) },
    timeStart () {
      this.INTERVAL = setInterval(() => {
        this.count = Math.ceil(this.recorder.duration)
        this.time = this.getTime(this.count)
      }, 1000)
    },
    pauseRecord () {
      this.timeStop()
      this.recorder.pause()
    },
    stopRecord () {
      if(!this.count){
        this.$emit('stopRecord', {
          content: '',
          size: '',
          name: '',
          tag: '',
        })
        return false
      }
      this.timeStop()
      this.recorder.pause()

      // 传输数据
      function blobToDataURL (blob, callback) {
        var a = new FileReader();
        a.onload = function (e) { callback(e) }
        a.readAsDataURL(blob);
      }

      blobToDataURL(this.recorder.getWAVBlob(), (e) => {
        this.$emit('stopRecord', {
          content: e.target.result,
          size: e.total,
          name: new Date().toLocaleDateString() + '录音',
          tag: 'audio',
        })
      })
    },
    startRecord () {
      this.timeStart()
      this.count > 0 ? this.recorder.resume() : this.recorder.start()
    }
  }
}
</script>

<style lang="scss">
.g-record {
  margin: 50px;
  &__time {
    height: 70px;
    font-size: 25px;
    color: #666;
  }
}
</style>