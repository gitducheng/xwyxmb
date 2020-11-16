<template>
  <div class="g-config">
    <GHeader v-model="title"></GHeader>
    <div class="g-config__content">
      <div v-for="(item,index) in data"
           :key="index"
           class="g-config__item">
        <span class="el-icon-circle-close g-config__remove"
              @click="removeItem(index)"></span>
        <el-input v-model="item.l"
                  placeholder="请输入内容"
                  maxlength="18"
                  class="g-config__item-label g-config__item-label-l"
                  @keyup.enter.native="focusR"></el-input>
        <div class="g-config__symbal"
             @mouseover="currentIndex=index"
             @mouseleave="currentIndex=null">
          <span class="g-config__symbal-text">{{item.answer||'符号'}}</span>
          <div class="g-config__symbol-list"
               v-if="currentIndex===index">
            <span v-for="s in symbol"
                  :key="s"
                  @click="selectSymbal(index,s)">{{s}}</span>
          </div>
        </div>
        <el-input v-model="item.r"
                  placeholder="请输入内容"
                  maxlength="18"
                  class="g-config__item-label"
                  @keyup.enter.native="nextOne($event,index)"></el-input>
        <!-- <span class="error-tip" v-if="getByteLength(item.l.trim())>27||getByteLength(item.r.trim())>27">最多输入27个字符</span> -->
      </div>
    </div>
    <GFooter @commit="commit"
             @addDefaultData="addDefaultData">
      <el-button @click="addItem"
                 class="g-config__addClass"
                 type="warning"
                 round
                 icon="el-icon-circle-plus-outline">添加</el-button>
    </GFooter>
  </div>
</template>

<script>
import defauleData from "~/static/defaultData"
import InitGame from "~/assets/game"

function resize () {
  var w = document.body.clientWidth
  document.querySelector("html").style.fontSize = w * 20 / 1920 + 'px'
}
export default {
  data () {
    return {
      title: '比较左右两边的大小，填入正确的符号',
      data: [
        { l: '', r: '', answer: '' },
        { l: '', r: '', answer: '' }
      ],
      symbol: ['>', '<', '≧', '≦', '=', '≈'],
      currentIndex: null,
      isWaiting: false
    }
  },
  async mounted () {
    document.body.onresize = resize
    resize()
    const data = await this.getConfigData()
    if (data && data.name === 'compareData') {
      this.title = data.title
      this.data = data.data
    }
  },
  methods: {
    async commit () {
      if (this.isWaiting) { return false }
      const datas = {
        name: 'compareData',
        title: this.title.trim(),
        data: this.data.map(item => ({ l: item.l.trim(), r: item.r.trim(), answer: item.answer }))
      }
      // 校验
      if (!datas.title) {
        this.$message({
          type: 'error',
          message: '标题还未填写哦'
        })
        return false
      }

      let overLine = ''
      const validate = this.data.filter((item, index) => {
        const lLen = this.getByteLength(item.l)
        const rLen = this.getByteLength(item.r)
        const maxLength = 18
        if (lLen > maxLength || rLen > maxLength) { overLine += overLine ? `、${index + 1}` : `${index + 1}` }
        return !item.l || !item.answer || !item.r || lLen > maxLength || rLen > maxLength
      })

      if (validate.length) {
        const message = !overLine ? '还有题目未填写哦' : `第${overLine}题超过规定字数,最多可输入9个汉字或18个字符哦`
        this.$message({
          type: 'error',
          message
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
        localStorage.setItem('compareData', JSON.stringify(datas))
        this.$router.replace('/')
      }

      this.isWaiting = false
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
    addDefaultData () {
      this.title = defauleData.title
      this.data = defauleData.data.map(item => ({ ...item }))
    },
    addItem () {
      if (this.data.length < 5) {
        this.data.push({ l: '', r: '', answer: '' })
        return false
      }
      this.$message({
        type: 'error',
        message: '最多添加5组哦'
      })
    },
    removeItem (index) {
      if (this.data.length > 2) {
        this.data.splice(index, 1)
        return false
      }
      this.$message({
        type: 'error',
        message: '最少需要2组哦'
      })
    },
    focusR (data) {
      data.target.parentNode.parentNode.lastChild.firstElementChild.focus()
    },
    nextOne (data, index) {
      if (index >= 4) {
        data.target.blur()
        return false
      }
      if (!this.data[index + 1]) {
        this.data.push({ l: '', r: '', answer: '' })
      }
      this.$nextTick(() => {
        const el = document.querySelectorAll('.g-config__item-label-l')[index + 1]
        el.firstElementChild.focus()
      })
    },
    selectSymbal (index, s) {
      this.data[index].answer = s
      this.currentIndex = null
    },
    getByteLength (str) {
      const len = str.length
      let reLen = 0
      for (let i = 0; i < len; i++) {
        if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
          // 全角
          reLen += 2
        } else {
          reLen++
        }
      }
      return reLen
    },
    async getConfigData () {
      try {
        const result = await this.$testload()
        if (typeof result === 'string') {
          return JSON.parse(result || null)
        }
      } catch (error) {
        return JSON.parse(localStorage.getItem('compareData') || null)
      }
    },
  }
}
</script>

<style lang="scss">
* {
  font-family: "微软雅黑";
  color: #152c2c;
}
.el-input__inner::placeholder {
  color: #5f6c65;
  font-size: 16px;
}
.el-textarea__inner::placeholder {
  color: #5f6c65;
  font-size: 16px;
}

input,
.el-input,
.el-input__inner,
textarea,
.el-textarea__inner {
  font-size: 16px;
  color: #5f6c65;
}
.g-config {
  height: 100%;
  padding-bottom: 40px;
  overflow: auto;
  &__content {
    width: 80%;
    height: 80%;
    margin: 40px auto 20px;
    text-align: center;
  }

  &__item {
    margin-bottom: 20px;
    position: relative;
    &:hover {
      .g-config__remove::before {
        display: inline-block;
      }
    }
  }
  &__remove {
    width: 20px;
    font-size: 16px;
    cursor: pointer;
    &::before {
      display: none;
    }
    &:hover {
      color: #5cb6ff;
    }
  }

  &__item-label {
    width: 20rem;
  }
  &__addClass {
    float: left;
    margin-left: 40px;
    // margin-top: -40px;
    color: #fff;
    span,
    i {
      color: #fff;
    }
    i {
      font-size: 20px;
      vertical-align: middle;
      line-height: 10px;
    }
  }
  &__symbal {
    display: inline-block;
    cursor: pointer;
    text-align: center;
    width: 52px;
    height: 42px;
    line-height: 42px;
    background: #e6a23c;
    color: #fff;
    border-radius: 2px;
    font-size: 16px;
    display: inline-block;
    &:hover {
      background: #ebb563;
    }
    &-text {
      color: #fff;
    }
  }

  &__symbol-list {
    position: absolute;
    top: -42px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    color: #666;
    background: #fff;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.2);
    span {
      display: inline-block;
      margin: 5px;
      width: 25px;
      height: 25px;
      line-height: 22px;
      border: 1px solid #efefef;
      &:hover {
        color: #fff;
        background: #ebb563;
        border-color: #ebb563;
      }
    }
  }
}
// .error{
//   .el-input__inner{
//      border-color: #f20505;
//   }
// }
// .error-tip{
//   font-size: 12px;
//   position: absolute;
//   left: 50%;
//   transform: translateX(-50%);
//   bottom: -18px;
//   color: #f20505;
// }
</style>