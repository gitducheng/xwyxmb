<template>
  <div class="g-config">
    <div class="g-config__content">
      <GHeader v-model="title"></GHeader>
      <div class="g-config__img">
        <img class="g-config__img-big"
             ref="img"
             height="400"
             :src="img">
        <table class="g-config__line"
               v-show="isTableLineShow"
               ref="table"
               border="1"
               height="400"
               cellpadding="0"
               cellspacing="0">
          <tr class="g-config__col"
              v-for="(item,index) in countInfo.colArr"
              :key="index">
            <td class="g-config__row"
                v-for="(item,index) in countInfo.rowArr"
                :key="index"></td>
          </tr>
        </table>
      </div>
      <div class="g-config__select">
        <VueUploadComponent v-model="file"
                            name="file"
                            class="g-config__upload">上传图片</VueUploadComponent>
        <el-select v-model="row"
                   label="行"
                   placeholder="请选择行">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label+'行'"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="col"
                   label="列"
                   placeholder="请选择列">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label+'列'"
                     :value="item.value">
          </el-option>
        </el-select>
        <!-- <el-button @click="getImgArr">切图</el-button> -->
      </div>
      <GFooter @commit="commit"
               @addDefaultData="addDefaultData">
      </GFooter>
    </div>
  </div>

</template>

<script>
import VueUploadComponent from 'vue-upload-component'
import options from '@/static/options.json'
import defaultData from '@/static/defaultData'
import InitGame from "~/assets/game"

function resize () {
  var w = document.body.clientWidth
  document.querySelector("html").style.fontSize = w * 20 / 1920 + 'px'
}

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

export default {
  components: {
    VueUploadComponent
  },
  data () {
    return {
      title: '拼拼乐',
      file: [],
      img: '',
      // imgList: [],
      col: null,
      row: null,
      isTableLineShow: false,
      options,
      isWaiting: false
    }
  },
  computed: {
    countInfo () {
      const rowArr = new Array(this.col || 0).fill('col')
      const colArr = new Array(this.row || 0).fill('row')
      return { colArr, rowArr }
    },
  },
  watch: {
    countInfo () {
      this.setTableWidth()
    },
    file (val) {
      if (!val.length || !val[0].file) { return false }
      if (['image/jpg', 'image/png', 'image/jpeg'].indexOf(val[0].type) < 0) {
        this.$message({
          message: `只支持.png和.jpg格式的图片哦`,
          type: 'warning'
        })
        return false
      }
      if (val[0].file.size > 1024 * 1024) {
        this.$message({
          message: `图片大小不能超过1M哦`,
          type: 'warning'
        })
        return false
      }
      const reader = new FileReader()
      reader.readAsDataURL(val[0].file)
      reader.onload = (e) => {
        // e.target.result
        this.img = e.target.result

        this.setTableWidth()
      }

    },
  },
  async mounted () {
    document.body.onresize = resize
    resize()

    const data = await this.getConfigData()
    if (data && data.name === 'puzzleData') {
      this.title = data.title
      this.img = data.img
      this.col = data.col
      this.row = data.row

      this.setTableWidth()
    }
  },
  methods: {
    drawImage (x, y, w, h) {
      ctx.drawImage(this.$refs.img, x, y, w, h, 0, 0, w, h)
      return canvas.toDataURL()
    },
    getImgArr () {
      const img = new Image()
      img.src = this.img
      const w = img.width / this.col
      const h = img.height / this.row
      canvas.width = w
      canvas.height = h
      const imgList = []
      for (let y = 0; y < this.row; y++) {
        for (let x = 0; x < this.col; x++) {
          imgList.push({
            id: `${y}-${x}`, row: y, col: x, src: this.drawImage(x * w, y * h, w, h)
          })
        }
      }
      return imgList.sort((a, b) => (a.col - b.col) && (a.row - b.row))
    },
    async commit () {
      if (this.isWaiting) { return false }
      // 校验
      if (!this.title) {
        this.$message({
          type: "error",
          message: "标题还未填写哦"
        })
        return false
      }
      if (!this.row) {
        this.$message({
          type: "error",
          message: "请选择行"
        })
        return false
      }
      if (!this.col) {
        this.$message({
          type: "error",
          message: "请选择列"
        })
        return false
      }
      if (!this.img) {
        this.$message({
          type: "error",
          message: "请上传图片"
        })
        return false
      }

      const imgList = this.getImgArr()
      if (!imgList.length) {
        this.$message({
          type: "error",
          message: "图片发生错误，请重新点击完成"
        })
        return false
      }

      const datas = {
        name: 'puzzleData',
        title: this.title,
        // list: this.imgList,
        img: this.img,
        col: this.col,
        row: this.row,
      }
      // 接口
      try {
        this.isWaiting = true
        const thumbnail = await this.getGameImg({...datas,list:imgList})
        await this.$testsave(thumbnail, JSON.stringify(datas))
      } catch (error) {
        console.log(error)
        const localData = { ...datas, img: this.img }
        localStorage.setItem('puzzleData', JSON.stringify(localData))
      }
      this.isWaiting = false
      this.$router.replace('/')
    },
    async getGameImg (datas) {
      const configData = JSON.parse(JSON.stringify(datas))
      const container = document.createElement('div')
      return new Promise((resolve, reject) => {
        new InitGame({
          container,
          configData,
          callback: game => {
            const { stage, ticker } = game
            if (stage.canvas && ticker) {
              const img = stage.canvas.toDataURL("image/png")
              if (img) { return resolve(img) }
            }
          }
        })

        setTimeout(() => {
          reject()
        }, 4000)
      })
    },
    addDefaultData () {
      this.title = defaultData.title
      this.row = defaultData.row
      this.col = defaultData.col
      this.img = defaultData.img

      this.setTableWidth()
    },
    setTableWidth () {
      // 计算table位置
      const { table, img } = this.$refs
      const interval = setInterval(() => {
        if (img.width) {
          clearInterval(interval)
          table.width = img.width
          this.isTableLineShow = true
        }
      }, 200)
    },
    async getConfigData () {
      try {
        const result = await this.$testload()
        if (typeof result === 'string') {
          return JSON.parse(result || null)
        }
      } catch (error) {
        return JSON.parse(localStorage.getItem('puzzleData') || null)
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
textarea::placeholder {
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

.el-button {
  font-weight: 400;
  vertical-align: middle;
  span {
    color: #5f6c65;
  }
}
.el-select {
  vertical-align: middle;
}

ul,
li {
  list-style: none;
}

html,
body,
#__nuxt,
#__layout,
#__layout > div,
.g-config {
  height: 100%;
}
html {
  overflow: hidden;
}

.g-config {
  overflow: auto;
  width: 100%;
  padding: 0 15px 90px;
  &__content {
    margin: 0 auto;
    width: 80%;
    height: 100%;
  }

  &__img {
    margin-top: 10px;
    width: 100%;
    min-height: 410px;
    border: 1px solid #ccc;
    position: relative;
    text-align: center;
    overflow: auto;
    padding: 10px;
  }

  &__line {
    border: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &__col {
    border-color: #fff;
  }
  &__row {
    border: 2px solid #fff;
  }

  &__img-big {
    // max-width: 450rem;
    // max-height: 25rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__select {
    margin: 10px 0;

    input,span {
      color: #5f6c65;
    }
  }

  &__upload {
    cursor: pointer;
    border: 1px solid #ccc;
    color: #5f6c65;
    border-radius: 2px;
    padding: 9px 20px;
    font-size: 14px;
    // font-weight: 500;
    background: #fff;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    vertical-align: middle;
    &:hover {
      // color: #409eff;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }

    & label {
      cursor: pointer;
    }
  }
}
</style>