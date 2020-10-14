<template>
  <div class="sort-index"
       v-if="sortingData">
    <div v-if="isStartShow">
      <div ref="root">
      </div>
    </div>
    <div class="sort-index__game"
         v-else>
      <div class="sort-index__game-timer">
        <span>答题时间：</span>
        <span class="sort-index__game-timer-time">{{time.m}}</span><span>分</span>
        <span class="sort-index__game-timer-time">{{time.s}}</span><span>秒</span>
      </div>
      <GGameContent :data="data"
                    :title="sortingData.title"
                    :isSubmited="isSubmited"
                    @update="updateData"
                    class="sort-index__game-content"></GGameContent>
      <div class="sort-index__game-button">
        <span v-if="!isSubmited"
              @click="submit"
              class="sort-index__icon icon-submit sort-index__submit"></span>
        <span v-else
              @click="restart"
              class="sort-index__icon icon-restart sort-index__restart"></span>
        <span v-if="sortingData.parseText || sortingData.parseImage.length"
              @click="dialogTitle='解析'"
              class="sort-index__icon icon-parse sort-index__parse"></span>
        <span v-if="sortingData.tips  || sortingData.tipsImage.length"
              @click="dialogTitle='提示'"
              class="sort-index__icon icon-tip sort-index__tip"></span>
        <span @click="dialogTitle='答案'"
              class="sort-index__icon icon-result sort-index__result"></span>
      </div>
    </div>
    <div class="sort-index__result-tip"
         v-if="resultTip">
      <img class="sort-index__result-tip-content"
           v-if="resultTip==='wrong'"
           src="../static/img/wrong.png">
      <img class="sort-index__result-tip-content"
           v-if="resultTip==='right'"
           src="../static/img/right.png">
    </div>
    <el-dialog title=""
               class="sort-index__dialog"
               :visible="isDialogShow"
               :show-close="false">
      <div v-if="dialogTitle==='答案'"
           class="sort-index__dialog-content">
        <h5 class="sort-index__dialog-title">{{dialogTitle}}:</h5>
        <p class="sort-index__dialog-result-text"
           v-for="(item,index) in sortingData.data"
           :key="index">{{item}}</p>
      </div>
      <div v-if="dialogTitle==='解析'"
           class="sort-index__dialog-content">
        <h5 class="sort-index__dialog-title">{{dialogTitle}}:</h5>
        <pre class="sort-index__dialog-text">{{sortingData.parseText}}</pre>
        <img class="sort-index__mini-img"
             v-for="(item,index) in sortingData.parseImage"
             :key="index"
             :src="item"
             @click="getLargeImg(item)"
             width="80"
             height="80">
      </div>
      <div v-if="dialogTitle==='提示'"
           class="sort-index__dialog-content">
        <h5 class="sort-index__dialog-title">{{dialogTitle}}:</h5>
        <pre class="sort-index__dialog-text">{{sortingData.tips}}</pre>
        <img class="sort-index__mini-img"
             v-for="(item,index) in sortingData.tipsImage"
             :key="index"
             :src="item"
             @click="getLargeImg(item)"
             width="80"
             height="80">
      </div>
      <span class="sort-index__icon icon-close sort-index__close"
            @click="dialogTitle=null"></span>
    </el-dialog>
    <el-dialog class="sort-index__dialog-img"
               :show-close="false"
               :visible="!!activeImg">
      <img :src="activeImg"
           :style="{'max-height':imgHeight+'px'}">
      <span class="sort-index__icon icon-close sort-index__close"
            @click="activeImg=null"></span>
    </el-dialog>
  </div>
</template>

<script>
import InitGame from "~/assets/game"
function randomArr (arr) {
  return arr.sort(() => 0.5 - Math.random())
}

export default {
  data () {
    return {
      sortingData: null,
      isStartShow: false,
      data: [],
      INTERVAL: null,
      TIMER: null,
      time: { s: '00', m: '00' },
      timeCount: 0,
      isSubmited: false,
      resultTip: null,
      activeImg: '',
      dialogTitle: null,
      imgHeight: 0,
    }
  },
  computed: {
    isDialogShow: {
      get () {
        return !!this.dialogTitle
      },
      set (val) {
        if (!val) { this.dialogTitle = null }
      }
    }
  },
  async mounted () {
    clearTimeout(this.TIMER)
    clearInterval(this.INTERVAL)

    this.startInterval()

    window.addEventListener('resize', this.resize)
    this.resize()

    // 数据
    await this.getConfigData()
    if (!this.sortingData || this.sortingData.name !== 'sortingData') {
      this.$router.replace('/config')
      return false
    }

    new InitGame({ container: this.$refs.root, configData: this.sortingData, startGame: this.startGame })
    this.getStartData()
  },
  beforeDestroy () {
    clearInterval(this.INTERVAL)
    clearTimeout(this.TIMER)
  },
  methods: {
    resize () {
      var w = document.body.clientWidth
      var h = document.body.clientHeight
      const f1 = w * 20 / 1920
      const f2 = h * 20 / 1080
      const fontSize = f1 > f2 ? f2 : f1
      document.querySelector("html").style.fontSize = fontSize + 'px'
      this.imgHeight = h * 70 / 100
    },
    async getConfigData () {
      try {
        const result = await this.$testload()
        if (typeof result === 'string') {
          this.sortingData = JSON.parse(result || null)
        }
      } catch (error) {
        this.sortingData = JSON.parse(localStorage.getItem('sortingData') || null)
      }
    },
    startGame () {
      this.isStartShow = false
    },
    getStartData () {
      const sort = Object.assign([], this.sortingData.data)
      this.data = randomArr(sort).map((item, index) => ({ name: item, i: index + 1 }))
    },
    startInterval () {
      // 计时器
      this.INTERVAL = setInterval(() => {
        this.time = this.getTime(this.timeCount)
        this.timeCount += 1
      }, 1000)
    },
    getTime (time = 0) {
      let m = Math.floor(time / 60) + ''
      m = m.padStart(2, '0')
      let s = time % 60 + ''
      s = s.padStart(2, '0')
      return { s, m }
    },
    updateData (val) {
      this.data = [...val]
    },
    submit () {
      this.isSubmited = true
      clearInterval(this.INTERVAL)
      this.timeCount = 0
      const myAnswer = this.data.map(item => item.name)
      const result = JSON.stringify(myAnswer) === JSON.stringify(this.sortingData.data)
      this.showResultTip(result)
    },
    restart () {
      this.isSubmited = false

      this.time = { s: '00', m: '00' }
      this.startInterval()

      this.getStartData()
    },
    showResultTip (data) {
      clearTimeout(this.TIMER)
      this.resultTip = data ? 'right' : 'wrong'
      this.TIMER = setTimeout(() => {
        this.resultTip = null
      }, 2000)
    },
    getLargeImg (img) {
      this.activeImg = img
    }
  }
}
</script>

<style lang="scss">
* {
  font-family: "微软雅黑";
  // color: #152c2c;
}
html,
body,
#__nuxt,
#__layout,
#__layout > div,
.sort-index {
  width: 100%;
  height: 100%;
}

.sort-index {
  background: url("../static/img/bg.jpg") center no-repeat;
  background-size: 100% 100%;
  position: relative;
  &__game-timer {
    position: absolute;
    top: 6.5%;
    right: 11rem;
    color: #fff;
    font-size: 14px;
    & span {
      color: #fff;
      font-weight: 500;
    }
  }
  &__game-timer-time {
    display: inline-block;
    width: 22px;
  }

  &__game {
    height: 100%;
  }
  &__game-content {
    width: 78rem;
    height: 55%;
    overflow: auto;
    position: relative;
    top: 16%;
    // left: 50%;
    // transform: translateX(-50%);
    // background: yellow;
    margin: auto;
  }
  &__icon {
    display: inline-block;
    background-size: 100% 100%;
  }
  &__submit {
    position: absolute;
    bottom: 11.5%;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
  }
  &__restart {
    position: absolute;
    bottom: 11.5%;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
  }
  &__tip {
    position: absolute;
    bottom: 13%;
    left: 9rem;
    cursor: pointer;
  }
  &__parse {
    position: absolute;
    bottom: 13%;
    left: 15.5rem;
    cursor: pointer;
  }
  &__result {
    position: absolute;
    bottom: 13%;
    right: 9rem;
    cursor: pointer;
  }
  &__result-tip {
    width: 100%;
    height: 100%;
    // position: relative;
  }
  &__result-tip-content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  &__dialog {
    // position: relative;
    width: 100%;
    height: 100%;
    .el-dialog,
    .el-pager li {
      background: transparent;
      box-shadow: none;
    }
    .el-dialog {
      // width: ;
    }
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      border-radius: 10px;
      border: 12px solid #012d5f;
      background: #fff;
      // min-width: 320px;
      // max-width: 600px;
      min-height: 300px;
      position: relative;
    }
  }
  &__dialog-content {
    max-height: 26rem;
    overflow: auto;
  }
  &__dialog-title {
    color: #012d5f;
    font-size: 20px;
    font-weight: 700;
    height: 40px;
  }
  &__dialog-text {
    // color: #012d5f;
    font-size: 16px;
    margin-bottom: 5rem;
  }
  &__dialog-result-text {
    // color: #012d5f;
    font-size: 16px;
    margin-bottom: 10px;
  }

  &__close {
    position: absolute;
    bottom: -3rem;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
  }

  &__mini-img {
    margin-left: 10px;
    cursor: pointer;
  }

  &__dialog-img {
    background: rgba(0, 0, 0, 0.65);

    .el-dialog {
      width: 80%;
      background: transparent;
    }
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      text-align: center;
    }
    img {
      max-width: 100%;
      max-height: 100%;
    }
    .sort-index__close{
      bottom: -2rem;
    }
  }
}
</style>
