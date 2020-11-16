<template>
  <div class="g-config">
    <h4 class="g-config__header">猜词游戏</h4>
    <div class="g-config__top">
      <Question class="g-config__question"
                @update="update"
                @clear="clear"
                :current="current"></Question>
      <div class="g-config__answer">
        <p class="g-config__label-container">
          <label class="g-config__label">请输入答案</label>
          <el-input type="textarea"
                    maxlength="14"
                    placeholder="请输入答案"
                    v-model="current.answer"></el-input>
        </p>
        <p class="g-config__label-container">
          <label class="g-config__label">请输入提示</label>
          <el-input type="textarea"
                    maxlength="83"
                    placeholder="请输入提示"
                    v-model="current.tip"></el-input>
        </p>
        <p class="g-config__label-container">
          <label class="g-config__label">请填写干扰项</label>
          <el-input type="textarea"
                    maxlength="14"
                    placeholder="请填写干扰项"
                    v-model="current.similar"></el-input>
        </p>
      </div>
    </div>
    <QuestionList class="g-config__preveiew"
                  :data="data"
                  :activeIndex="activeIndex"
                  @remove="remove"
                  @select="select"
                  @add="add"></QuestionList>
    <div class="g-config__btns">
      <el-button type="info"
                 @click="addDefaultData">导入范例</el-button>
      <el-button type="success"
                 @click="commit">完成</el-button>
    </div>
  </div>
</template>

<script>
import defaultData from '~/static/defaultData'
import InitGame from "@/assets/game"

function resize () {
  var w = document.body.clientWidth;
  document.querySelector("html").style.fontSize = w * 20 / 1920 + 'px';
}

export default {
  data () {
    return {
      data: [{ tip: '', answer: '', similar: '' }],
      activeIndex: 0,
      isWaiting: false,
    }
  },
  computed: {
    current () {
      return this.data[this.activeIndex] || {}
    },
  },
  async mounted () {
    resize()
    document.body.onresize = resize

    const data = await this.getConfigData()
    if (data) { this.data = data }
  },
  methods: {
    update (fileData) {
      const old = this.data[this.activeIndex]
      this.$set(this.data, this.activeIndex, Object.assign({}, old, fileData))
    },
    clear () {
      const old = this.data[this.activeIndex]
      this.$set(this.data, this.activeIndex, Object.assign({}, old, { tag: '', content: '', name: '', size: '' }))
    },
    remove (index) {
      this.data.splice(index, 1)
      if (index === this.activeIndex && index !== 0) { this.activeIndex -= 1 }
    },
    select (index) {
      this.activeIndex = index
    },
    add () {
      // 校验
      this.data.push({
        tip: '',
        answer: '',
        similar: ''
      })
    },
    addDefaultData () {
      this.data = JSON.parse(JSON.stringify(defaultData))
      this.activeIndex = this.data.length - 1
    },
    async commit () {
      if (this.isWaiting) { return false }
      const datas = this.data.map((item, index) => ({
        ...item, answer: item.answer.replace(' ', ''), similar: item.similar.replace(' ', '')
      }))
      // 校验
      let countLimitIndex = ''
      let requireIndex = ''
      let languageIndex = ''
      let size = 0
      datas.filter((item, index) => {
        const requirement = item.answer && item.content
        // 要么全中文，要么全英文小写
        const allCihnese = /^[\u4e00-\u9fa5]{1,14}$/.test(item.answer) && (!item.similar || /^[\u4e00-\u9fa5]{1,14}$/.test(item.similar))
        const allEnglish = /^[a-z]{1,14}$/.test(item.answer) && (!item.similar || /^[a-z]{1,14}$/.test(item.similar))
        const isSamelanguage = allCihnese || allEnglish

        if (item.answer.length + item.similar.length > 14) { countLimitIndex += index + 1 }
        if (!requirement) { requireIndex += index + 1 }
        if (!isSamelanguage) { languageIndex += index + 1 }

        size += item.size
        return !requirement || !isSamelanguage
      })
      if (countLimitIndex.length) {
        this.$message({
          message: `请将${requireIndex.split('').join('、')}题答案和干扰项总数控制在14个以内哦`,
          type: 'error'
        })
        return false
      }
      if (requireIndex.length) {
        this.$message({
          message: `第${requireIndex.split('').join('、')}题还没有填写完成哦`,
          type: 'error'
        })
        return false
      }
      if (languageIndex.length) {
        this.$message({
          message: `第${languageIndex.split('').join('、')}题答案和干扰项要保持语言一致哦,仅可输入中文或者英文小写字母`,
          type: 'error'
        })
        return false
      }
      // 不能超过4M 1024*1024*4
      if (size > 1024 * 1024 * 4) {
        this.$message({
          message: '文件大小超过限制哦',
          type: 'error'
        })
        return false
      }

      // 接口
      try {
        this.isWaiting = true
        const thumbnail = await this.getGameImg(datas)
        const saveResponse = await this.$testsave(thumbnail, JSON.stringify(datas))
        if (saveResponse === "success") {
          this.$router.replace("/");
        }
      } catch (error) {
        console.log(error)
        localStorage.setItem('guessWordData', JSON.stringify(datas))
        this.$router.replace('/')
      }
      this.isWaiting = true
    },
    async getGameImg (datas) {
      const container = document.createElement('div')
      return new Promise((resolve, reject) => {
        new InitGame({
          container,
          configData: datas,
          callback: game => {
            const { stage, ticker } = game
            if (stage.canvas && ticker) {
              const img = stage.canvas.toDataURL("image/png")
              if (img) { return resolve(img) }
            }
          }
        })
      })
    },
    async getConfigData () {
      try {
        const result = await this.$testload()
        if (typeof result === 'string') {
          return JSON.parse(result || null)
        }
      } catch (error) {
        return JSON.parse(localStorage.getItem('guessWordData') || null)
      }
    }
  }
}
</script>

<style lang="scss">
* {
  font-family: "微软雅黑";
}
.g-config {
  text-align: center;
  overflow-x: hidden;
  padding: 20px 40px 60px;
  &__header {
    text-align: center;
    font-size: 16px;
    height: 60px;
    color: #152c2c;
  }
  &__top {
    width: 100%;
    height: 50%;
    min-width: 526px;
    &:after {
      content: ".";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
  }
  &__btns {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    background: #fff;
    text-align: right;
    z-index: 100;
    padding: 10px 150px 10px 0;
  }
  &__question {
    float: left;
    width: 48%;
    height: 27rem;
  }
  &__answer {
    float: right;
    width: 48%;
    margin-left: 20px;
    text-align: left;
  }

  &__label-container {
    margin-top: 10px;
  }
  &__label {
    font-size: 16px;
    color: #5f6c65;
  }
  textarea {
    resize: none;
  }
  // .el-textarea__inner::placeholder {
  //   font-size: 16px;
  //   color: #5f6c65;
  // }
  .el-button--info {
    color: #5f6c65;
    background: #ccc;
    border-color: #ccc;
  }
  .el-button--success {
    background: #0ed04b;
    border-color: #0ed04b;
  }
}
</style>