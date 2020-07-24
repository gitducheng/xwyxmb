<style scoped>
.answerDialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}
.content {
  width: 639px;
  height: 444px;
  background: url('~static/yundonghui/answer/bg1.png');
  background-size: cover;
  margin: 0 auto;
  margin-top: 100px;
  position: relative;
}
.answer {
  width: 80%;
  height: 200px;
  height: 26px;
  /* background:red; */
  display: block;
  position: absolute;
  list-style: none;
  left: 40px;
  top: 120px;
}
.li {
  width: 100;
  height: 28px;
  position: relative;
  /* background: red; */
}
.li span {
  display: block;
  position: absolute;
  color: #4ae0e9;
}
.li .qs {
  width: 70%;
  line-height: 28px;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.li .qsFlg {
  width: 24px;
  top: 4px;
  right: 20px;
}
.li .errorbg{
  width: 20px;
  top: 4px;
  right: 23px;
}
.li .qsFlg img,.li .errorbg img {
  width: 100%;
}
/* 结果 */
.li .rightMan{
  width: 100px;
  height: 100%;
  position:absolute;
  left: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.li .errorMan{
  width: 100px;
  height: 100%;
  position:absolute;
  left: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.li .rightMan div,.li .errorMan div{
  width: 24px;
  height: 24px;
}

.li .rightMan div img,.li .errorMan div img{
  width: 100%;
}


.li .line {
  width: 100%;
  height: 4px;
  background: url('~static/yundonghui/answer/line.png');
  background-size: cover;
  bottom: 0;
  left: 0;
}

.tabAnswer {
  width: 200px;
  height: 40px;
  position: absolute;
  left: 200px;
  bottom: 50px;
  font-size: 0;
  /* background: url('~static/yundonghui/answer/answer1.png'); */
  background-size: cover;
}
.tableft{
  display: inline-block;
  width: 48%;
  height: 100%;;
}
.tabright{
  display: inline-block;
  width: 48%;
  height: 100%;
}
.tabAnswer img {
  width: 100%;
}

.returnd,
.begin {
  width: 150px;
  position: absolute;
  left: 700px;
}
.returnd {
  top: 120px;
}
.begin {
  top: 200px;
}
.returnd img,
.begin img {
  width: 100%;
}
</style>
<template>
  <div class="answerDialog" v-show="visible1">
    <div class="content" :style="{
          backgroundImage: `url(${require(`~/static/yundonghui/answer/bg${tagActive}.png`)})`
        }">
      <ul class="answer">
        <li class="li" v-for="(item, index) in configData.data" :key="index">
          <span class="qs">{{ item.text }}</span>
          <span v-show="tagActive===1" :class="{'qsFlg':item.isCheck===1,'errorbg':item.isCheck===2}">
            <img
              v-if="item.isCheck != 2"
              src="~static/yundonghui/answer/right.png"
              alt=""
            />
            <img v-else src="~static/yundonghui/answer/error.png" alt="" />
          </span>
          <span class="rightMan" v-show="tagActive===2">
            <!-- {{(resultData.p1result.success.filter(item1 => item1.id === item.id)[0])}} -->
            <div v-show="item.p1IsGood"><img src="~static/yundonghui/result/buding.png" alt=""></div>
            <div v-show="item.p2IsGood"><img src="~static/yundonghui/result/doudou.png" alt=""></div>
          </span>

          <span class="errorMan" v-show="tagActive===2">
            <div v-show="!item.p1IsGood"><img src="~static/yundonghui/result/buding.png" alt=""></div>
            <div v-show="!item.p2IsGood"><img src="~static/yundonghui/result/doudou.png" alt=""></div>
          </span>

          <span class="line"></span>
        </li>
      </ul>
      <div class="tabAnswer" :style="{
          backgroundImage: `url(${require(`~/static/yundonghui/answer/answer${tagActive}.png`)})`
        }">
        <div class="tableft" @click="tagActive=1"></div>
        <div class="tabright" @click="tagActive=2"></div>
        <!-- <img src="~static/yundonghui/answer/answer.png" alt="" /> -->
      </div>
      <div class="returnd" @click="handleReturn">
        <img src="~static/yundonghui/answer/return.png" alt="" />
      </div>
      <div class="begin" @click="handleBegin">
        <img src="~static/yundonghui/answer/restart.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      visible1: false,
      liveFlag: false,

      tagActive:1,
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
          },
          {
            id: 1,
            text: 'bbbb',
            isCheck: 1
          }
        ],
        second: 7
      },
      resultData:{
        p1result:{
          success:[
            {id:0,text: 'aaaa',isGood: true},
            {id:2,text: 'bbbb',isGood: true},
          ],
          error:[

          ]
        },
        p2result:{
          success:[
            {id:3,text: 'aaaa',isGood: true},
            {id:2,text: 'bbbb',isGood: true},
          ],
          error:[]
        }
      }
    }
  },
  mounted() {
    // this.configData = localStorage.getItem('configData')
    console.log(localStorage.getItem('configData'))
    this.configData.data = this.configData.data.map(item => {
      return {
        ...item,
        p1IsGood: this.resultData.p1result.success.filter(item1 => item1.id === item.id)[0]?true:false,
        p2IsGood: this.resultData.p2result.success.filter(item2 => item2.id === item.id)[0]?true:false,
      }
    })
    console.log(this.configData)

  },
  methods: {
    async init(data, show,resultData) {
      console.log(resultData)
      this.visible1 = show
      this.configData = data

      this.tagActive = 1 // 默认是题目答案页
      // this.resultData = resultData || {}
      this.configData.data = data.data.map(item => {
        return {
          ...item,
          p1IsGood: resultData.p1result.success.filter(item1 => item1.id === item.id)[0]?true:false,
          p2IsGood: resultData.p2result.success.filter(item2 => item2.id === item.id)[0]?true:false,
        }
      })
      console.log(this.configData)
    },
    handleReturn() {
      this.visible1 = false
      this.$emit('handleBack')
    },
    handleBegin() {
      this.visible1 = false
      this.$emit('handleBegin')
    }
  }
}
</script>
