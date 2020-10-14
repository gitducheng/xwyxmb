<style scoped>
.resultDialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  color: #4bdfe8;
}
.content1 {
  width: 639px;
  height: 444px;

  margin: 0 auto;
  margin-top: 100px;
  position: relative;
}
.left {
  width: 300px;
  height: 400px;
  /* height: 360px; */
  /* background: url('~static/yundonghui/result/fail.png'); */
  background-size: cover;
  position: absolute;
  left: 0;
  /* top: 40px; */
}
.right {
  width: 300px;
  height: 400px;
  /* background: url('~static/yundonghui/result/tie.png'); */
  background-size: cover;
  position: absolute;
  right: 0;
  top: 0;
}
.head {
  width: 80px;
  height: 80px;
  position: absolute;
  top: 120px;
  left: 110px;
}
.head img {
  width: 100%;
}
.name {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 193px;
}
.huashu {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 220px;
  font-size: 24px;
}
.correct {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 280px;
  font-size: 20px;
}

.error {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 320px;
  font-size: 20px;
}

.answer,
.restart {
  width: 150px;
  position: absolute;
  top: 420px;
}
.answer {
  left: 140px;
}
.restart {
  left: 340px;
}
.answer img,
.restart img {
  width: 100%;
}
</style>
<template>
  <div class="resultDialog" v-show="visible">
    <div class="content1">
      <div
        class="left"
        :style="{
          backgroundImage: `url(${require(`~/static/yundonghui/result/result${status1}.jpg`)})`
        }"
      >
        <div class="head">
          <img src="~static/yundonghui/result/buding.png" alt="" />
        </div>
        <div class="name">布丁</div>
        <div class="huashu">{{ resultText[status1] }}</div>
        <div class="correct">
          答对题目: {{ resultData.p1result.success.length }}道
        </div>
        <div class="error">
          答错题目: {{ resultData.p1result.error.length }}道
        </div>
      </div>
      <div
        class="right"
        :style="{
          backgroundImage: `url(${require(`~/static/yundonghui/result/result${status2}.jpg`)})`
        }"
      >
        <div class="head">
          <img src="~static/yundonghui/result/doudou.png" alt="" />
        </div>
        <div class="name">豆豆</div>
        <div class="huashu">{{ resultText[status2] }}</div>
        <div class="correct">
          答对题目: {{ resultData.p2result.success.length }}道
        </div>
        <div class="error">
          答错题目: {{ resultData.p2result.error.length }}道
        </div>
      </div>
      <div class="answer" @click="handleAnswer">
        <img src="~static/yundonghui/result/answer.png" alt="" />
      </div>
      <div class="restart" @click="handleBegin">
        <img src="~static/yundonghui/result/restart.png" alt="" />
      </div>
    </div>
    <!-- <Answer ref="answerModal" /> -->
  </div>
</template>

<script>
import Answer from './Answer.vue'

export default {
  components: {
    Answer
  },

  data() {
    return {
      visible: false,
      liveFlag: false,
      status1: 1, //1,2,3种状态，1是左赢，2是平局，3是右赢
      status2: 1, //1,2,3种状态，1是右赢，2是平局，3是左赢
      resultText: ['', '全对得冠，舍我其谁', '平局平局', '一步之遥,再接再厉'],
      resultData: {
        p1result: {
          success: [],
          error: []
        },
        p2result: {
          success: [],
          error: []
        }
      },
      configData: {
        data: [
          {
            id: 0,
            text: 'aaaaa',
            isCheck: 1
          },
          {
            id: 1,
            text: 'bbbb',
            isCheck: 1
          },
          {
            id: 2,
            text: 'cccc',
            isCheck: 2
          }
        ],
        second: 7
      }
    }
  },
  mounted() {
    // this.configData = localStorage.getItem('configData')
    console.log(localStorage.getItem('configData'))
  },
  methods: {
    async init(data, show) {
      this.visible = show
      this.resultData = data
      const p1SuccessLen = data.p1result.success.length
      const p2SuccessLen = data.p2result.success.length
      if (p1SuccessLen > p2SuccessLen) {
        this.status1 = 1
        this.status2 = 3
      } else if (p1SuccessLen < p2SuccessLen) {
        this.status1 = 3
        this.status2 = 1
      } else {
        this.status1 = 2
        this.status2 = 2
      }
    },
    handleReturn() {
      this.visible = false
      this.$refs['answerModal'].init(this.configData, true)
    },
    handleBegin() {
      this.visible = false
      this.$emit('handleBegin')
    },
    handleAnswer() {
      this.visible = false

      this.$emit('handleAnswer')
    }
  }
}
</script>
