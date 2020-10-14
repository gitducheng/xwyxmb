<template>
  <div class="g-config">
    <GHeader v-model="title"></GHeader>
    <div class="g-config__main">
      <span>题目</span>
      <div class="g-config__content">
        <el-input type="textarea"
                  v-model="wordText"
                  @blur="spaceBlur"
                  placeholder="点击输入题目内容"
                  ref="gTextarea"
                  class="g-config__textarea"></el-input>
        <div class="g-config__add"
             onselectstart="return false"
             @click="addSpaceItem"
             :class="{'g-config__add-disable':space.length>=10}">
          <span class="el-icon-circle-plus-outline g-config__add-icon"></span>
          <span>增加填空</span>
          <span>{{space.length}}/10</span>
        </div>
      </div>

      <div class="g-config__similar">
        干扰项
        <span>{{similar.length}}/5</span>
        <div class="g-config__similar-mian">
          <GInput v-for="(item,index) in similar"
                  :key="index+item"
                  :index="index"
                  class="g-config__input"
                  placeholder="输入干扰项"
                  @onFocus="addSimilarItem"
                  @removeItem="removeSimilarItem"
                  v-model="item.value">
          </GInput>
        </div>
      </div>
    </div>
    <GFooter @addDefaultData="addDefaultData"
             @commit="commit"></GFooter>
  </div>
</template>

<script>

function resize () {
  var w = document.body.clientWidth
  document.querySelector("html").style.fontSize = w * 20 / 1920 + 'px'
}
import GInputSimple from '~/components/GInputSimple'
import Vue from 'vue'
import defaultData from '@/static/defaultData'
import InitGame from "~/assets/game"
export default {
  components: {
    GInputSimple
  },
  data () {
    return {
      title: '选词填空',
      word: '',
      similar: [{ value: '' }],
      selectionStart: 0,
      isWaiting: false
    }
  },
  computed: {
    space () {
      const space = this.word.match(/【[^\】]*】/g) || []
      return space.map(item => item.replace(/【|】/g, ''))
    },
    wordText: {
      get () {
        return this.word
      },
      set (val) {
        // if (val.length < this.word.length) {
        //   this.word = val
        //   return false
        // }
        // const matchV = val.match(/【[^\】]*】/g) || []
        // if (matchV.filter(item => /【[^\】]*】/g.test(item)).length  > 10) {
        //   this.$message({
        //     message: '填空不能超过10',
        //     type: 'error'
        //   })
        //   return false
        // }
        this.word = val
      }
    }
  },
  async mounted () {
    document.body.onresize = resize
    resize()

    const data = await this.getConfigData()
    if (data) {
      this.title = data.title
      this.similar = data.similar.map(item => ({ value: item }))
      this.addSimilarItem(this.similar.length - 1)
      this.word = data.originalWord
    }
  },
  methods: {
    async getConfigData () {
      try {
        const result = await this.$testload()
        if (typeof result === 'string') {
          return JSON.parse(result || null)
        }
      } catch (error) {
        return JSON.parse(localStorage.getItem('chooseWordData') || null)
      }
    },
    addSimilarItem (index) {
      const length = this.similar.length
      if (index === length - 1 && length < 5) {
        this.similar.push({ value: '' })
      }
    },
    removeSimilarItem (index) {
      if (this.similar.length <= 1) {
        this.$set(this.similar, index, { value: '' })
        return false
      }
      this.similar.splice(index, 1)
    },
    addSpaceItem () {
      const length = this.space.length
      if (length >= 10) { return false }

      const word = this.word
      this.word = word.slice(0, this.selectionStart) + '【】' + word.slice(this.selectionStart)
      this.$refs.gTextarea.focus()
    },
    spaceBlur (e) {
      this.selectionStart = e.target.selectionStart
    },
    addDefaultData () {
      this.title = defaultData.title
      this.similar = defaultData.similar.map(item => ({ value: item }))
      this.addSimilarItem(this.similar.length - 1)
      this.word = defaultData.word
    },
    async commit () {
      if (this.isWaiting) { return false }
      // 校验
      if (!this.title.length) {
        this.$message({
          message: '请先填写标题',
          type: 'error'
        })
        return false
      }
      if (!this.space.length) {
        this.$message({
          message: '至少有一个填空哦',
          type: 'error'
        })
        return false
      }

      if (this.space.length > 10) {
        this.$message({
          message: '填空最多有10个哦',
          type: 'error'
        })
        return false
      }

      if (!this.space.every(item => item && item.length < 8)) {
        this.$message({
          message: '填空中必须要输入正确答案且字数不能超过7个哦',
          type: 'error'
        })
        return false
      }

      // 相同项校验
      const similar = this.similar.map(item => item.value).filter(item => item)
      const allOptionsLength = similar.length + this.space.length
      const newLength = Array.from(new Set([...similar, ...this.space])).length
      if (newLength !== allOptionsLength) {
        this.$message({
          message: '答案/干扰项不能填一样的词哦',
          type: 'error'
        })
        return false
      }


      const count = 44
      if (this.word.length>count*5) {
         this.$message({
          message: '字数/行数太多哦，最多支持五行',
          type: 'error'
        })
        return false
      }
      // 只有一段文字长度处理
      let word = this.word.split('\n').filter(item => item)
      word = word.map(item => {
        const arr = item.replace(/【[^】]+】/g, '__&__').replace(/__&__/g,'%&_%__&__%&_%').split('%&_%')
        return arr.filter(item=>item).map(item=>item==='__&__'?'':item)
      })

      const newWord = []
      let wordIndex = 0
      let firstIndex = 0
      let length = 0
      const lineFontCount = 8 //300/38=7.8~~8
     
      word.forEach((item, index) => {
        item.forEach((v, i) => {
          if (!newWord[wordIndex]) { newWord[wordIndex] = [] }
          if (v) {
            length += v.length
          } else {
            length += lineFontCount
          }
          if (index > firstIndex) {
            if (i === 0) {
              if (v) {
                length = count + v.length
              } else {
                length += count
              }
            }
          }
          if (length <= count) {
            newWord[wordIndex].push(v)
          }
          while (length > count) {
            newWord[wordIndex + 1] = []
            if (v) {
              const j = v.length - (length - count)
              let l1
              if (j>count) {
                l1=v.slice(0, count)
              }else{
                l1=v.slice(0, j)
              }  
              if (l1&& (!newWord[wordIndex][0] || newWord[wordIndex][0].length<count)) { newWord[wordIndex].push(l1) }
              let l2
              if ((v.length-j)>count) {
                l2= v.slice(j,j+count)
              }else{
                l2= v.slice(j) 
              }
              if (l2) { newWord[wordIndex + 1].push(l2) }
            } else {
              newWord[wordIndex + 1].push(v)
            }
            wordIndex += 1
            length = newWord[wordIndex][0] ? (newWord[wordIndex][0].length===count? 
                      (length-count):newWord[wordIndex][0].length): lineFontCount
          }
        })
        firstIndex = index;
      })
      // 校验行数
      if (newWord.length > 5) {
        this.$message({
          message: '字数/行数太多哦，最多支持五行',
          type: 'error'
        })
        return false
      }


      const datas = {
        title: this.title,
        word: newWord,
        originalWord: this.word,
        answer: this.space,
        similar
      }
      // 接口
      try {
        this.isWaiting = true
        const thumbnail = await this.getGameImg(datas)
        await this.$testsave(thumbnail, JSON.stringify(datas))
      } catch (error) {
        console.log(error)
        localStorage.setItem('chooseWordData', JSON.stringify(datas))
      }
      this.isWaiting = false
      this.$router.replace('/')
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
    }

  }
}
</script>

<style lang="scss">
* {
  font-family: " 微软雅黑";
  color: #152c2c;
}
.el-textarea__inner::placeholder {
  color: #5f6c65;
  font-size: 16px;
}
.el-input__inner::placeholder {
  color: #5f6c65;
  font-size: 16px;
}
input::placeholder {
  color: #5f6c65;
  font-size: 16px;
}
input,
.el-input,
.el-input__inner,
textarea,
.el-textarea__inner {
  font-size: 16px;
  color: #152c2c;
}
html {
  overflow: hidden;
}
html,
body,
#__nuxt,
#__layout,
#__layout > div,
.g-config {
  height: 100%;
}
.g-config__main {
  width: 80%;
  height: 65%;
  margin: 20px auto 0;
  font-size: 14px;
  overflow-y: auto;
}
.g-config__content {
  width: 100%;
  height: 70%;
  margin-top: 10px;
  /* border: 1px solid #cecece; */
  position: relative;
  overflow: auto;
}
.g-config__add {
  width: 172px;
  height: 30px;
  font-size: 16px;
  text-align: center;
  color: #5f6c65;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  z-index: 3;
  left: 50%;
  transform: translateX(-50%);
}
.g-config__add:hover span {
  color: #086fdc;
}
.g-config__add-icon {
  font-size: 20px;
  vertical-align: middle;
}
.g-config__textarea,
.g-config__textarea textarea {
  width: 100%;
  height: 100%;
  resize: none;
}
.g-config__similar {
  margin-top: 15px;
}
.g-config__input {
  /* width: 150px; */
}
.g-config__input {
  float: left;
  margin-right: 10px;
  margin-top: 10px;
}
.g-config__add-disable {
  cursor: no-drop;
  color: #999;
}
.g-config__add-disable span {
  color: #999;
}
.g-config__add-disable:hover span {
  color: #999;
}
.g-config__space {
  /* position: absolute;
  top: 0; */
  margin-left: 10px;
}

.g-space {
  &-container {
    // margin-right: 10px;
    min-width: 200px;
  }
  &-content {
    margin-right: 10px;
    margin-bottom: 10px;
    display: inline-block;
    position: relative;
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    font-size: inherit;
    outline: 0;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    height: 30px;
    line-height: 30px;
    min-width: 100px;
    padding: 0 10px;
    text-align: center;
    &:hover {
      border-color: #c0c4cc;
    }
    &:focus {
      border-color: #409eff !important;
      outline: 0;
    }
    // &:{
    //   // background: chartreuse;
    // }
  }
}
</style>