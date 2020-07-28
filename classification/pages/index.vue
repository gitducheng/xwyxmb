<template>
  <div class="container">
    <div ref="root"></div>
    <el-dialog :visible="isResultShow"
               class="g-index__result"
               :center="true"
               width="70%"
               :style="{'margin-top':'-8vh'}"
               :show-close="false">
      <div class="g-index__main"
           v-if="configData">
        <div v-for="(item,index) in configData.data"
             :key="index"
             class="g-index__class-container">
          <h5 class="g-index__class-name">{{item.className}}</h5>
          <div class="g-index__sub-class-container">
            <p v-for="(s,i) in item.sub"
               :key="i"
               class="g-index__sub-class">
              <span>{{s}}</span>
            </p>
          </div>
        </div>
      </div>
      <p slot="footer"
         class="g-index__footer">
        <img src="../static/img/img-back.png"
             class="g-index__back"
             @click="again">
      </p>
    </el-dialog>
  </div>
</template>

<script>
import InitGame from "~/assets/game"
function resize () {
  var w = document.body.clientWidth
  document.querySelector("html").style.fontSize = w * 20 / 1920 + 'px'
}
export default {
  data () {
    return {
      configData: null,
      isResultShow: false
    }
  },
  created () {

  },
  async mounted () {
    window.addEventListener("resize", resize)
    // document.body.onresize=resize
    resize()

    await this.getConfigData()
    if (!this.configData) { this.$router.replace('/config') }
    new InitGame({
      container: this.$refs.root,
      configData: this.configData,
      callback: (game, isComplete) => {
        if (isComplete) {
          this.isResultShow = true
        }
      }
    })
  },
  methods: {
    async getConfigData () {
      try {
        const result = await this.$testload()
        if (typeof result === 'string') {
          this.configData = JSON.parse(result || null)
        }
      } catch (error) {
        this.configData = JSON.parse(localStorage.getItem('classificationData') || null)
      }
    },
    again () {
      this.$refs.root.removeChild(document.querySelector('canvas'))
      new InitGame({
        container: this.$refs.root,
        configData: this.configData,
        callback: (game, isComplete) => {
          if (isComplete) {
            this.isResultShow = true
          }
        }
      })
      this.isResultShow = false
    }
  }
}
</script>

<style lang="scss">
.g-index {
  &__result {
    .el-dialog__body {
      text-align: center;
      padding: 0;
    }
    .el-dialog {
      background: none;
      box-shadow: none;
    }
    .el-dialog__header {
      display: none;
    }
  }
  &__main {
    display: inline-block;
    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }
  &__class-container {
    float: left;
    // width:392px;
    // height: 614px;
    margin: 0 2rem 20px;
    width: 12rem;
    height: 18.5rem;
    background: url("../static/img/img-result.png") center no-repeat;
    background-size: cover;
  }
  &__footer {
    text-align: center;
  }
  &__back {
    position: fixed;
    width: 16rem;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    // display: inline-block;
    // width: 319px;
    // height: 82px;
    // background: url("../static/img/img-back.png") center no-repeat;
  }
  &__class-name {
    color: #fff;
    font-weight: 700;
    font-size: 1.6rem;
    line-height: 3.2rem;
    height: 3.2rem;
  }
  &__sub-class-container {
    height: 14.5rem;
    overflow-y: auto;
    padding-top: 10px;
  }
  &__sub-class {
    text-align: center;
    margin-bottom: 8px;
    & span {
      display: inline-block;
      font-size: 1.2rem;
      width: 9rem;
      line-height: 2.4rem;
      height: 2.4rem;
      background: #d4eaef;
      border-radius: 3px;
    }
  }
}
</style>
