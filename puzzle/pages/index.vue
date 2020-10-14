<template>
  <div ref="root">
    <img :src="(configData||{}).img"
         ref="img"
         height="400"
         v-show="false">
  </div>
</template>

<script>
import InitGame from "~/assets/game"

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

export default {
  data () {
    return {
      configData: null,
    }
  },
  async mounted () {
    await this.getConfigData()
    if (!this.configData || this.configData.name !== 'puzzleData') { this.$router.replace('/config') }

    // 切图
    this.configData.list = await this.getImgArr(this.configData.img, this.configData.row, this.configData.col)

    new InitGame({
      container: this.$refs.root,
      configData: JSON.parse(JSON.stringify(this.configData)),
    })
  },
  methods: {
    drawImage (x, y, w, h) {
      ctx.drawImage(this.$refs.img, x, y, w, h, 0, 0, w, h)
      return canvas.toDataURL()
    },
    async getImgArr (imgContent, row, col) {
      const img = new Image()
      img.src = imgContent

      return new Promise((resolve, reject) => {
        img.onload = () => {
          const w = img.width / col
          const h = img.height / row
          canvas.width = w
          canvas.height = h
          const imgList = []
          for (let y = 0; y < row; y++) {
            for (let x = 0; x < col; x++) {
              imgList.push({
                id: `${y}-${x}`, row: y, col: x, src: this.drawImage(x * w, y * h, w, h)
              })
            }
          }
          resolve(imgList.sort((a, b) => (a.col - b.col) && (a.row - b.row)))
        }
      })
    },
    async getConfigData () {
      try {
        const result = await this.$testload()
        if (typeof result === 'string') {
          this.configData = JSON.parse(result || null)
        }
      } catch (error) {
        this.configData = JSON.parse(localStorage.getItem('puzzleData') || null)
      }
    },
    startInterval () {
      clearInterval(this.INTERVAL)
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
  }
}
</script>

<style lang="scss">
* {
  font-family: "微软雅黑";
  color: #fff;
}
html,
body,
#__nuxt,
#__layout,
#__layout > div,
.game-index {
  height: 100%;
}
html {
  overflow: hidden;
}
.game-index {
  * {
    font-family: "微软雅黑";
    color: #fff;
  }
  width: 100%;
  height: 100%;
  // background: url("../static/img/background.jpg") no-repeat center;
  background-size: 100% 100%;
  position: relative;

  &__title {
    font-size: 3rem;
    font-weight: bold;
    position: absolute;
    top: 12%;
    left: 26%;
    width: 26rem;
    text-align: center;
  }
  &__time {
    font-size: 1.8rem;
    font-weight: 500;
    position: absolute;
    top: 13.5%;
    left: 63%;
    &-text {
      display: inline-block;
      width: 28px;
      text-align: center;
    }
    span {
      vertical-align: middle;
    }
  }

  &__content {
    width: 75%;
    height: 50%;
    // background-color: #fff;
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateX(-51%);
    overflow: hidden;
  }

  &__answer {
    background-color: #fff;
    width: 55%;
    height: 100%;
    // overflow: auto;
    float: left;
    border: 1px solid #000;
    padding: 4px;
    // margin: 0 6px;
    text-align: center;

    & > div {
      width: 100%;
      height: 100%;
      & > span {
        width: 100%;
        height: 100%;
        display: inline-block;
      }
    }
    img {
      margin: 0;
    }
  }

  &__select {
    background-color: #fff;
    width: 40%;
    height: 100%;
    overflow: auto;
    float: right;
    border: 1px solid #000;
    padding: 4px;
    // margin: 0 6px;
    text-align: center;

    & > div {
      width: 100%;
      height: 100%;
      & > span {
        width: 100%;
        height: 100%;
        display: inline-block;
      }
    }
  }
  &__img {
    border: 1px solid #000;
    margin: 4px;
  }

  &__result-tip {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1000;
  }
  &__result-tip-content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  & &__icon {
    display: inline-block;
    background-size: 100% 100%;
    cursor: pointer;
  }
}

.icon-question {
  background: url("../static/img/question.png") center no-repeat;
  width: 9.1rem;
  height: 2.9rem;

  position: absolute;
  bottom: 14.5%;
  left: 11%;
}
.icon-result {
  background: url("../static/img/result.png") center no-repeat;
  width: 9.1rem;
  height: 2.9rem;

  position: absolute;
  bottom: 14.5%;
  left: 11%;
}
.icon-restart {
  background: url("../static/img/restart.png") center no-repeat;
  width: 15.9rem;
  height: 4.6rem;

  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
}
.icon-submit {
  background: url("../static/img/submit.png") center no-repeat;
  width: 15.9rem;
  height: 4.6rem;

  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
}
.game-index__ghost {
  width: 100px;
  height: 100px;
}
</style>
