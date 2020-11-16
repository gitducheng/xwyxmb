<template>
  <div class="config-container">
    <p class="gameTitle">判断对错</p>
    <el-row class="configTitle">
      <el-col :span="12">
        题目：<span>{{ this.configData.data.length }}</span> / 8
      </el-col>
      <el-col :span="12"
              style="text-align: right;">选择答案</el-col>
    </el-row>
    <el-divider></el-divider>
    <div>
      <el-row @mouseover.native="selectStyle(index)"
              @mouseout.native="outStyle(index)"
              v-for="(item, index) in configData.data"
              :key="index">
        <el-input class="subject"
                  maxlength="90"
                  v-model="item.text"
                  placeholder="请输入题目"></el-input>
        <div @click="handleDel(index)"
             v-if="configData.data.length > 1"
             :class="activeDel === index ? 'rowDel' : 'none'">
          <img src="~static/yundonghui/config/rowDel.png"
               style="margin-top:10px;"
               alt="" />
        </div>
        <div class="check">
          <span class="right"
                @click="handleCheck(index, 1)"><img :src="
                item.isCheck == '1'
                  ? require('~/static/yundonghui/config/right1.png')
                  : require('~/static/yundonghui/config/right.png')
              "
                 alt="" /></span>
          <span class="line"></span>
          <span class="error"
                @click="handleCheck(index, 2)"><img :src="
                item.isCheck == '2'
                  ? require('~/static/yundonghui/config/error1.png')
                  : require('~/static/yundonghui/config/error.png')
              "
                 alt="" /></span>
        </div>
      </el-row>
    </div>
    <div class="newAddBox">
      <div class="newAdd">
        <span class="newAddBtn"
              @click="handleAdd">
          <img class="newAddImg"
               src="~static/yundonghui/config/add.png"
               alt="" />
          <span>增加题目</span>
        </span>
        <span class="stTip">每题时间（1~15秒）：</span>
        <el-input class="stime"
                  maxlength="2"
                  min="1"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  @change="handleInput"
                  v-model="configData.second"></el-input>
      </div>
      <div class="compleBtn">
        <span class="tips">{{ tips }}</span>
        <!-- <el-button @click="handleResult">结果</el-button>
        <el-button @click="handleAnswer">答案</el-button> -->
        <el-button type="info"
                   @click="handleDefault">导入范例</el-button>
        <el-button type="success"
                   style="width:98px;"
                   @click="handleSubmit">完成</el-button>
      </div>
    </div>
    <Answer ref="answerModal"
            @handleBegin="handleBegin" />
    <Result ref="resultModal"
            @handleAnswer="handleAnswer" />
  </div>
</template>

<script>
import initQuestion from '~/static/yundonghui/question.json'
import Answer from './components/Answer.vue'
import Result from './components/result.vue'
import save from '~/components/game/save'
export default {
  data () {
    return {
      configData: {
        data: [
          {
            id: 0,
            text: '',
            isCheck: null
          },
          {
            id: 1,
            text: '',
            isCheck: null
          },
          {
            id: 2,
            text: '',
            isCheck: null
          }
        ],
        second: 7
      },
      resultData: {
        p1result: {
          success: [1, 2, 3, 4, 5],
          error: [1, 2, 3, 3]
        },
        p2result: {
          success: [1, 2, 3, 1],
          error: [1, 2]
        }
      },
      imgsrc: 'static/yundonghui/config/right.png',
      activeDel: -1,
      submitFlg: false, // 提交状态
      tips: '', // 提交提示信息
      data: '',
      test: 111
    }
  },
  components: {
    Answer,
    Result
  },
  async mounted () {
    // console.log(initQuestion)
    // console.log(localStorage.getItem('configData'))
    let configData2
    try {
      configData2 = await this.$testload()
      if (typeof configData2 === 'string') {
        configData2 = JSON.parse(configData2 || null)
      }
    } catch (error) {
      configData2 = JSON.parse(localStorage.getItem('configData') || null)
    }
    if (configData2) this.configData = configData2
  },
  methods: {
    handleInput (val) {
      if (val > 15) {
        this.configData.second = 15
      } else if (val < 1) {
        this.configData.second = 1
      }
    },
    handleDefault () {
      this.configData = initQuestion
    },
    selectStyle (index) {
      this.activeDel = index
    },
    outStyle () {
      this.activeDel = -1
    },
    handleCheck (index, flg) {
      this.configData.data[index].isCheck = flg
    },
    handleDel (index) {
      this.configData.data.splice(index, 1)
    },
    handleAdd () {
      if (this.configData.data.length < 8) {
        const id =
          this.configData.data[this.configData.data.length - 1].id - 0 + 1
        this.configData.data.push({ id: id, text: '', isCheck: null })
      }
    },
    async handleSubmit () {
      //提交
      let problemArr = []
      let answerArr = []
      this.configData.data.forEach((item) => {
        if (item.text) {
          problemArr.push(true)
        }
        if (item.isCheck) {
          answerArr.push(true)
        }
      })
      if (this.configData.data.length != problemArr.length) {
        this.tips = '题目不能为空'
      } else if (this.configData.data.length != answerArr.length) {
        this.tips = '答案不能为空'
      } else {
        try {
          const thumbnail = await save(this.configData.second)
          const saveResponse = await this.$testsave(thumbnail, JSON.stringify(this.configData))
          if (saveResponse === "success") {
            this.$router.replace("/");
          }
        } catch (error) {
          console.log(error)
          localStorage.setItem('configData', JSON.stringify(this.configData))
          this.$router.replace('/')
        }
      }
    },

    // =======================重新开始
    handleBegin () {
      console.log(11112222)
    },
    handleResult () {
      console.log(this.resultData)
      this.$refs['resultModal'].init(this.resultData, true)
    },
    handleAnswer () {
      this.$refs['answerModal'].init(this.configData, true)
    }
  }
}
</script>

<style scoped>
.gameTitle {
  text-align: center;
  font-size: 24px;
  color: #152c2c;
}
.configTitle {
  font-size: 16px;
  color: #152c2c;
}
.el-button--success {
  background-color: #0ed04b;
  border-color: #0ed04b;
}
.el-button--info {
  color: #5f6c65;
  background-color: #fff;
  border-color: #cccccc;
}
</style>
<style>
.subject .el-input__inner {
  height: 50px;
  padding-right: 100px;
}
input:-ms-input-placeholder {
  color: #5f6c65;
  font-size: 16px;
} /* Internet Explorer 10+ */

input::-webkit-input-placeholder {
  color: #5f6c65;
  font-size: 16px;
} /* WebKit browsers */

input::-moz-placeholder {
  color: #5f6c65;
  font-size: 16px;
} /* Mozilla Firefox 4 to 18 */

input:-moz-placeholder {
  color: #5f6c65;
  font-size: 16px;
} /* Mozilla Firefox 19+ */
.config-container {
  width: 80%;
  height: 60px;
  margin: 0 auto;
  margin-top: 60px;
  /* background: red; */
}

.el-divider--horizontal {
  margin: 12px 0 0 0;
}

.el-input__inner {
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  /*outline: medium;*/
}

.subject {
  position: relative;
  font-size: 16px;
}
.none {
  display: none;
}
.check {
  position: absolute;
  right: 0;
  top: 10px;
  height: 30px;
}
.line {
  display: inline-block;
  width: 1px;
  height: 20px;
  margin-bottom: 5px !important;
  margin: 0 10px;
  border: 0.5px solid #e4e4e4;
  opacity: 0.4;
}
.rowDel {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 0;
  left: -30px;
}
.rowDel img {
  width: 100%;
}
.right,
.error {
  display: inline-block;
  width: 30px;
  height: 30px;
}
.right img,
.error img {
  width: 100%;
}

.bottom {
  width: 100%;
}

.newAddBox {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  width: 80%;
  margin: 0 auto;
}
.newAdd {
  line-height: 0;
}
.newAddBtn {
  overflow: hidden;
  line-height: 30px;
  margin-right: 30px;
  display: flex;
  float: left;
}
.newAddImg {
  width: 30px;
  height: 30px;
  margin-right: 8px;
}
.stime {
  display: inline-block;
  width: 80px;
}
.stime .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.stTip {
  line-height: 30px;
}
.compleBtn {
  margin-top: 15px;
  text-align: right;
}
.tips {
  color: red;
}
</style>
