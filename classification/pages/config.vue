<template>
  <div class="g-config">
    <GHeader v-model="title"></GHeader>
    <div class="g-config__main">
      <el-table :data="tableData"
                height="100%"
                style="width: 100%">
        <el-table-column prop="className"
                         :label="nameLabel"
                         width="150">
          <template slot-scope="scope">
            <i class="el-icon-circle-close g-config__remove"
               @click="removeClass(scope.$index)"></i>
            <el-input @keyup.enter.native="focusSubClassName(scope.$index)"
                      class="g-config__class-name"
                       maxlength="4"
                      v-model="scope.row.className"
                      placeholder="点击输入类别" />
          </template>
        </el-table-column>
        <el-table-column prop="subClass"
                         :label="subClassLabel">
          <template slot-scope="scope">
            <el-input class="g-config__sub-class"
                      v-for="(sub,i) in scope.row.sub"
                      :key="i"
                      maxlength="4"
                      @blur="subBlur($event,scope.$index,i)"
                      v-model="tableData[scope.$index].sub[i]"></el-input>
            <el-input class="g-config__sub-class-input"
                      maxlength="4"
                      @keyup.enter.native="addSubClassName(scope)"
                      @keydown.8.native="removeSubClass($event,scope.$index)"
                      v-model="scope.row.subClass"
                      placeholder="单击输入，按【回车】添加" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <GFooter @commit="commit"
             @addDefaultData="addDefaultData">
      <el-button @click="addClass"
                 class="g-config__addClass"
                 type="warning"
                 round
                 icon="el-icon-circle-plus-outline">添加分类</el-button>
    </GFooter>
  </div>
</template>

<script>
import defaultData from '@/static/defaultData'
import InitGame from "~/assets/game"

function resize () {
  var w = document.body.clientWidth
  document.querySelector("html").style.fontSize = w * 20 / 1920 + 'px'
}
export default {
  data () {
    return {
      isWaiting: false,
      title: '超级分类',
      tableData: [
        { className: '', subClass: '', sub: [] },
        { className: '', subClass: '', sub: [] }
      ]
    }
  },
  computed: {
    nameLabel () {
      return `类别 ${this.tableData.length}/8`
    },
    subClassCount () {
      return this.tableData.reduce((t, c) => {
        t = t + c.sub.length
        return t
      }, 0)
    },
    subClassLabel () {
      return `子类别 ${this.subClassCount}/30`
    },
  },
  async mounted () {
    document.body.onresize = resize
    resize()

    const data = await this.getConfigData()
    if (data) {
      this.title = data.title
      this.tableData = data.data
     }
  },
  methods: {
    focusName (data) {
      console.log(data)
    },
    focusSubClassName (index) {
      const inputEl = document.querySelectorAll('.g-config__sub-class-input input')
      inputEl[index].focus()
    },
    addSubClassName (data) {
      const index = data.$index
      const value = data.row.subClass
      if (!value) { return false }
      if (this.subClassCount >= 30) {
        this.$message({
          message: '子类别最多添加30个哦',
          type: 'error'
        })
        return false
      }
      this.tableData[index].sub.push(value)
      this.tableData[index].subClass = ''
    },
    removeClass (index) {
      if (this.tableData.length <= 2) {
        this.$message({
          message: '至少需要两种分类哦',
          type: 'error'
        })
        return false
      }
      this.tableData.splice(index, 1)
    },
    async commit () {
      if (this.isWaiting) { return false }
      // 校验
      const valify = this.tableData.every((item, index) => item.className && item.sub.length)
      if (!this.title) {
        this.$message({
          type: "error",
          message: "标题还未填写哦"
        })
        return false
      }
      if (!valify) {
        this.$message({
          type: "error",
          message: "还有分类未填写哦"
        })
        return false
      }


      const datas = {
        title: this.title,
        data: this.tableData
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
        localStorage.setItem('classificationData', JSON.stringify(datas))
        this.$router.replace("/");
      }
      this.isWaiting = false
    },
    addDefaultData () {
      this.title = defaultData.title
      const dataJson = JSON.stringify(defaultData.data)
      this.tableData = JSON.parse(dataJson)
    },
    addClass () {
      if (this.tableData.length >= 8) {
        this.$message({
          message: '最多添加8个分类',
          type: 'error'
        })
        return false
      }
      this.tableData.push({ className: '', subClass: '', sub: [] })
    },
    subBlur (data, dataIndex, subIndex) {
      if (!data.target.value) {
        this.tableData[dataIndex].sub.splice(subIndex, 1)
      }
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
    removeSubClass (e, dataIndex) {
      const value = e.target.value
      if (!value) {
        const sub = this.tableData[dataIndex].sub
        if (!sub.length) { return false }
        this.tableData[dataIndex].sub.splice(sub.length - 1, 1)
      }
    },
    async getConfigData () {
      try {
        const result = await this.$testload()
        if (typeof result === 'string') {
          return JSON.parse(result || null)
        }
      } catch (error) {
        return JSON.parse(localStorage.getItem('classificationData') || null)
      }
    },
  }
}
</script>

<style lang="scss">
* {
  font-family: " 微软雅黑";
  color: #152c2c;
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
  width: 90%;
  height: 80%;
  margin: 20px auto 0;

  &__main {
    margin-top: 20px;
    width: 100%;
    height: 90%;

    .el-table td,
    .el-table th {
      padding: 0;
    }
    .el-input__inner {
      border: none;
      background-color: transparent;
    }
    .el-table .cell,
    .el-table--border td:first-child .cell,
    .el-table--border th:first-child .cell {
      // padding-left: 20px;
      // padding-right: 5px;
      padding: 0;
    }
    .el-table__header-wrapper .el-table__header th :nth-child(1) {
      padding-left: 30px;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      .g-config__remove {
        display: inline-block;
      }
    }

    .el-table_1_column_1   .el-input {
      width: 150px;
    }
    .el-table_1_column_2   .el-input {
      width: 200px;
    }
  }

  &__class-name {
    .el-input__inner {
      padding-left: 26px;
    }
  }

  &__remove {
    position: absolute;
    font-size: 16px;
    top: 50%;
    left: 1px;
    display: none;
    cursor: pointer;
    transform: translateY(-50%);
    z-index: 5;
    &:hover {
      color: #5cb6ff;
    }
  }
  &__addClass {
    float: left;
    margin-left: 40px;
    margin-top: -40px;
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

  &__sub-class-input {
    display: inline-block;
    .el-input__inner {
      padding: 0;
    }
  }

  &__sub-class {
    margin-left: 4px;
    background: #dffff4;
    width: 68px !important;
    .el-input__inner {
      padding: 0;
      text-align: center;
    }
  }
}
</style>