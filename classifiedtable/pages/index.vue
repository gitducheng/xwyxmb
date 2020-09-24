<template>
  <div class="wrp">
    <div class="box">
      <img class="cbg" draggable="false" src="~static/sorttable/ctbg_01.png">
      <div class="allbox">
        <div class="tbox">
          {{bannerData.gameName}}
          <div class="timeBox">
            {{timeMsg}}
          </div>
        </div>
        <div class="cbox">
          <div class="ctbox">
            <div class="cleftbox">
              <div class="cbluebox">
                <div class="blueCont">
                  <div class="bctopBox">
                    {{bannerData.bannerTxt}}
                  </div>
                  <div class="bannerBox">
                    <img draggable="false" v-if="bannerData.bannerClass === 'image' && bannerData.bannerUrl === ''" class="bannerImg" src="~static/sorttable/banner_03.png">
                    <img draggable="false" v-if="bannerData.bannerClass === 'image'" class="bannerImg" :src="bannerData.bannerUrl">
                    <video class="bannerVideo" v-if="bannerData.bannerClass === 'video'" :src="bannerData.bannerUrl" preload="auto" autoplay="autoplay" loop="loop">
                      您的浏览器不支持 video 标签。
                    </video>
                    <audio class="bannerAudio" v-if="bannerData.bannerClass === 'audio'" controls="controls" loop="loop" autoplay>
                      <source :src="bannerData.bannerUrl"/>
                      您的浏览器不支持 audio 标签。
                    </audio>
                  </div>
                </div>
              </div>
            </div>
            <div class="crightBox">
              <div class="ctableBox" v-if="!tableListDataFlag">
                <!-- 查看结果渲染 -->
                <div v-if="isToShowCorrectFlag" class="correctAnswerBox">
                  <table class="sortTable" v-if="newCorrectAnswerList.tableHead.length === 2" id="line2">
                    <thead>
                      <tr>
                        <th
                          v-for="(val, index) in newCorrectAnswerList.tableHead"
                          :key="index"
                        >
                          <span>{{ val }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in newCorrectAnswerList.tableBody" :key="index">
                          <td
                            v-for="(val, k, i) in item"
                            :key="i"
                          >
                            <span v-if="!Array.isArray(val)">{{ val }}</span>
                            <span class="tdDivBox" v-else>
                              <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                              <span v-else></span>
                              <div class="dragwrapBox">
                                <div class="dragBigBox">
                                  <div v-for="d in val" :key="d.id" class="answerDiv Wllsd">
                                    <span v-if="d.correctFlag === 0" class="errorAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-if="d.correctFlag === 1" class="correctAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-if="d.correctFlag === 2" class="defaultAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                  </div>
                                </div>
                              </div>
                            </span>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                  <table class="sortTable" v-if="newCorrectAnswerList.tableHead.length === 3" id="line3">
                    <thead>
                      <tr>
                        <th
                          v-for="(val, index) in newCorrectAnswerList.tableHead"
                          :key="index"
                        >
                          <span>{{ val }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in newCorrectAnswerList.tableBody" :key="index">
                          <td
                            v-for="(val, k, i) in item"
                            :key="i"
                          >
                            <span v-if="!Array.isArray(val)">{{ val }}</span>
                            <span class="tdDivBox" v-else>
                              <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                              <span v-else></span>
                              <div class="dragwrapBox">
                                <div class="dragBigBox">
                                  <div v-for="d in val" :key="d.id" class="answerDiv  Wllsd">
                                    <span v-if="d.correctFlag === 0" class="errorAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-if="d.correctFlag === 1" class="correctAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-if="d.correctFlag === 2" class="defaultAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                  </div>
                                </div>
                              </div>
                            </span>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                  <table class="sortTable" v-if="newCorrectAnswerList.tableHead.length === 4" id="line4">
                    <thead>
                      <tr>
                        <th
                          v-for="(val, index) in newCorrectAnswerList.tableHead"
                          :key="index"
                        >
                          <span>{{ val }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in newCorrectAnswerList.tableBody" :key="index">
                          <td
                            v-for="(val, k, i) in item"
                            :key="i"
                          >
                            <span v-if="!Array.isArray(val)">{{ val }}</span>
                            <span class="tdDivBox" v-else>
                              <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                              <span v-else></span>
                              <div class="dragwrapBox">
                                <div class="dragBigBox">
                                  <div v-for="d in val" :key="d.id" class="answerDiv  Wllsd">
                                    <span v-if="d.correctFlag === 0" class="errorAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-if="d.correctFlag === 1" class="correctAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-if="d.correctFlag === 2" class="defaultAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                  </div>
                                </div>
                              </div>
                            </span>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                  <table class="sortTable" v-if="newCorrectAnswerList.tableHead.length === 5" id="line5">
                    <thead>
                      <tr>
                        <th
                          v-for="(val, index) in newCorrectAnswerList.tableHead"
                          :key="index"
                        >
                          <span>{{ val }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in newCorrectAnswerList.tableBody" :key="index">
                          <td
                            v-for="(val, k, i) in item"
                            :key="i"
                          >
                            <span v-if="!Array.isArray(val)">{{ val }}</span>
                            <span class="tdDivBox" v-else>
                              <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                              <span v-else></span>
                              <div class="dragwrapBox">
                                <div class="dragBigBox">
                                  <div v-for="d in val" :key="d.id" class="answerDiv Wllsd">
                                    <span v-if="d.correctFlag === 0" class="errorAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-if="d.correctFlag === 1" class="correctAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-if="d.correctFlag === 2" class="defaultAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                  </div>
                                </div>
                              </div>
                            </span>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                  <table class="sortTable" v-if="newCorrectAnswerList.tableHead.length === 6" id="line6">
                    <thead>
                      <tr>
                        <th
                          v-for="(val, index) in newCorrectAnswerList.tableHead"
                          :key="index"
                        >
                          <span>{{ val }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in newCorrectAnswerList.tableBody" :key="index">
                          <td
                            v-for="(val, k, i) in item"
                            :key="i"
                          >
                            <span v-if="!Array.isArray(val)">{{ val }}</span>
                            <span class="tdDivBox" v-else>
                              <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                              <span v-else></span>
                              <div class="dragwrapBox">
                                <div class="dragBigBox">
                                  <div v-for="d in val" :key="d.id" class="answerDiv Wllsd">
                                    <span v-if="d.correctFlag === 0" class="errorAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-if="d.correctFlag === 1" class="correctAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-if="d.correctFlag === 2" class="defaultAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                  </div>
                                </div>
                              </div>
                            </span>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                </div>
                <!-- 拖拽渲染 -->
                <div v-else class="tableGameBox">
                  <table class="sortTable" v-if="tableList.tableHead.length === 2" id="line2">
                    <thead>
                      <tr>
                        <th
                          v-for="(val, index) in tableList.tableHead"
                          :key="index"
                        >
                          <span>{{ val }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tableList.tableBody" :key="index">
                          <td
                            v-for="(val, k, i) in item"
                            :key="i"
                          >
                            <span v-if="!Array.isArray(val)">{{ val }}</span>
                            <span class="tdDivBox" v-else>
                              <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                              <span v-else></span>
                              <draggable :disabled="disabledFlag" v-bind="dragOptions" class="dragwrapBox" :list="tableAnswerList[(index+2).toString()+(i+1).toString()]"  @change="toChange">
                                <transition-group name="fieldChildBox" class="dragBigBox">
                                  <div v-for="d in tableAnswerList[(index+2).toString()+(i+1).toString()]" :key="d.id" class="answerDiv  Wllsd">
                                    <span v-if="!isSubmited" class="defaultAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-else :class="val.some(item=>{if(item.val===d.val&&item.id===d.id&&item.position===d.position){return true}})?'correctAnswerImg':'errorAnswerImg'"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                  </div>
                                </transition-group>
                              </draggable>
                            </span>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                  <table class="sortTable" v-if="tableList.tableHead.length === 3" id="line3">
                    <thead>
                      <tr>
                        <th
                          v-for="(val, index) in tableList.tableHead"
                          :key="index"
                        >
                          <span>{{ val }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tableList.tableBody" :key="index">
                          <td
                            v-for="(val, k, i) in item"
                            :key="i"
                          >
                            <span v-if="!Array.isArray(val)">{{ val }}</span>
                            <span class="tdDivBox" v-else>
                              <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                              <span v-else></span>
                              <draggable :disabled="disabledFlag" v-bind="dragOptions" class="dragwrapBox" :list="tableAnswerList[(index+2).toString()+(i+1).toString()]"  @change="toChange">
                                <transition-group name="fieldChildBox" class="dragBigBox">
                                  <div v-for="d in tableAnswerList[(index+2).toString()+(i+1).toString()]" :key="d.id" class="answerDiv  Wllsd">
                                    <span v-if="!isSubmited" class="defaultAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-else :class="val.some(item=>{if(item.val===d.val&&item.id===d.id&&item.position===d.position){return true}})?'correctAnswerImg':'errorAnswerImg'"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                  </div>
                                </transition-group>
                              </draggable>
                            </span>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                  <table class="sortTable" v-if="tableList.tableHead.length === 4" id="line4">
                    <thead>
                      <tr>
                        <th
                          v-for="(val, index) in tableList.tableHead"
                          :key="index"
                        >
                          <span>{{ val }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tableList.tableBody" :key="index">
                          <td
                            v-for="(val, k, i) in item"
                            :key="i"
                          >
                            <span v-if="!Array.isArray(val)">{{ val }}</span>
                            <span class="tdDivBox" v-else>
                              <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                              <span v-else></span>
                              <draggable :disabled="disabledFlag" v-bind="dragOptions" class="dragwrapBox" :list="tableAnswerList[(index+2).toString()+(i+1).toString()]"  @change="toChange">
                                <transition-group name="fieldChildBox" class="dragBigBox">
                                  <div v-for="d in tableAnswerList[(index+2).toString()+(i+1).toString()]" :key="d.id" class="answerDiv  Wllsd">
                                    <span v-if="!isSubmited" class="defaultAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-else :class="val.some(item=>{if(item.val===d.val&&item.id===d.id&&item.position===d.position){return true}})?'correctAnswerImg':'errorAnswerImg'"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                  </div>
                                </transition-group>
                              </draggable>
                            </span>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                  <table class="sortTable" v-if="tableList.tableHead.length === 5" id="line5">
                    <thead>
                      <tr>
                        <th
                          v-for="(val, index) in tableList.tableHead"
                          :key="index"
                        >
                          <span>{{ val }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tableList.tableBody" :key="index">
                          <td
                            v-for="(val, k, i) in item"
                            :key="i"
                          >
                            <span v-if="!Array.isArray(val)">{{ val }}</span>
                            <span class="tdDivBox" v-else>
                              <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                              <span v-else></span>
                              <draggable :disabled="disabledFlag" v-bind="dragOptions" class="dragwrapBox" :list="tableAnswerList[(index+2).toString()+(i+1).toString()]"  @change="toChange">
                                <transition-group name="fieldChildBox" class="dragBigBox">
                                  <div v-for="d in tableAnswerList[(index+2).toString()+(i+1).toString()]" :key="d.id" class="answerDiv  Wllsd">
                                    <span v-if="!isSubmited" class="defaultAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-else :class="val.some(item=>{if(item.val===d.val&&item.id===d.id&&item.position===d.position){return true}})?'correctAnswerImg':'errorAnswerImg'"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                  </div>
                                </transition-group>
                              </draggable>
                            </span>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                  <table class="sortTable" v-if="tableList.tableHead.length === 6" id="line6">
                    <thead>
                      <tr>
                        <th
                          v-for="(val, index) in tableList.tableHead"
                          :key="index"
                        >
                          <span>{{ val }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tableList.tableBody" :key="index">
                          <td
                            v-for="(val, k, i) in item"
                            :key="i"
                          >
                            <span v-if="!Array.isArray(val)">{{ val }}</span>
                            <span class="tdDivBox" v-else>
                              <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                              <span v-else></span>
                              <draggable :disabled="disabledFlag" v-bind="dragOptions" class="dragwrapBox" :list="tableAnswerList[(index+2).toString()+(i+1).toString()]"  @change="toChange">
                                <transition-group name="fieldChildBox" class="dragBigBox">
                                  <div v-for="d in tableAnswerList[(index+2).toString()+(i+1).toString()]" :key="d.id" class="answerDiv  Wllsd">
                                    <span v-if="!isSubmited" class="defaultAnswerImg"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                    <span v-else :class="val.some(item=>{if(item.val===d.val&&item.id===d.id&&item.position===d.position){return true}})?'correctAnswerImg':'errorAnswerImg'"><span :class="d.val.length < 4 ? 'tlineone' : 'tlinetwo'">{{d.val}}</span></span>
                                  </div>
                                </transition-group>
                              </draggable>
                            </span>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="cbbox">
            <div>
              <draggable
                v-if="!tableListDataFlag"
                v-model="answerList"
                v-bind="dragOptions"
                :disabled="disabledFlag"
                element="span"
              >
                <transition-group type="transition" :name="'field-list'" class="answerBox ovy">
                  <span v-for="d in answerList" :key="d.id" class="answerDiv"><span :class="d.val.length < 4 ? 'lineone' : 'linetwo'">{{d.val}}</span></span>
                </transition-group>
              </draggable>
            </div>
            <img class="sidewalkImg" src="~static/sorttable/sidewalk2_03.png">
          </div>
        </div>
        <div class="bbox">
          <button class="answerBtn" v-if="isSubmited" @click="getAnswer">
            <div>查看答案</div>
          </button>
          <button class="submitBtn" v-if="!isSubmited" @click="submitBtn">
            <div>提交</div>
          </button>
          <button class="restartBtn" v-if="isSubmited" @click="restartBtn">
            <div>重新开始</div>
          </button>
        </div>
      </div>
    </div>
    <!-- 对错弹窗 -->
    <div class="modalWrap" v-if="aFlag" @click="aFlag=!aFlag">
      <img draggable="false" class="maskImg" src="~static/sorttable/rightTip_03.png">
    </div>
    <div class="modalWrap" v-if="errFlag" @click="errFlag=!errFlag">
      <img draggable="false" class="maskImg" src="~static/sorttable/errorTip_03.png">
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'sortgame',
  components: {
    draggable
  },
  data () {
    return {
      bannerData: {
        gameName: '',
        bannerTxt: '',
        bannerClass: 'image',
        bannerUrl: ''
      },
      tableList: {},
      tableListDataFlag: false,
      isSubmited: false,
      dragOptions: { 
        animation: 250,
        group: "description"
      },
      // 道路上答案数据
      answerList: [],
      // 每个表格里的拖拽进入的答案数据总容器
      tableAnswerList: {},
      // 处理好的从接口得到的正确答案数据容器
      correctAnswerData: {},
      // 倒计时
      timeMsg: "答题时间：0分0秒",
      timer: '',
      // 全局拖动标志，是否禁止拖拽
      disabledFlag: false,
      answerFlag: [],
      answerDataNum: [],
      aFlag: false,
      errFlag: false,
      // 查看答案
      newCorrectAnswerList: {},
      dragCorrectAnswerArr: [],
      dragErrorAnswerArr: [],
      isToShowCorrectFlag: false
    }
  },
  methods: {
    submitBtn() {
      this.isSubmited = true
      this.answerFlag = []
      this.disabledFlag = false
      this.objCompare(this.tableAnswerList,this.correctAnswerData)
      if(this.answerDataNum.length !== this.answerFlag.length) {
        this.errFlag = true
        setTimeout(()=>{this.errFlag = false},2000)
      } else {
        this.aFlag = true
        setTimeout(()=>{this.aFlag = false},2000)
      }
      this.disabledFlag = true
      clearInterval(this.timer)
    },
    restartBtn() {
      Object.assign(this.$data, this.$options.data())
      this.getAnswerData()
    },
    getAnswer() {
      for(let i = 0; i < this.newCorrectAnswerList.tableBody.length; i++) {
        const rowData = this.newCorrectAnswerList.tableBody[i]
        for(let t in rowData) {
          if(Array.isArray(rowData[t])) {
            for(let q = 0; q < rowData[t].length; q++) {
              const Vitem = rowData[t][q]
              let isright = this.dragCorrectAnswerArr.some((ite) => {
                return Vitem['val'] === ite['val'] && Vitem['position'] === ite['position'] && Vitem['id'] === ite['id']
              })
              let iserror = this.dragErrorAnswerArr.some((ite) => {
                return Vitem['val'] === ite['val'] && Vitem['position'] === ite['position'] && Vitem['id'] === ite['id']
              })
              if(isright) {
                Vitem['correctFlag'] = 1
              } else {
                if(iserror) {
                  Vitem['correctFlag'] = 0
                } else {
                  Vitem['correctFlag'] = 2
                }
              }
            }
          }
        }
      }
      this.isToShowCorrectFlag = true
      this.answerList = []
    },
    toChange(e) {
      if (e.added) {
        // console.log(e)
      }
    },
    async getAnswerData() {
      this.tableListDataFlag = true
      this.tableList = {}
      this.tableAnswerList = {}
      let bannerCData, tableCData;
      try {
        let allData = await this.$testload()
        if (typeof allData === 'string') {
          bannerCData = JSON.parse(allData).bannerData
          tableCData = JSON.parse(allData).tableData
        } else {
          bannerCData = allData.bannerData
          tableCData = allData.tableData
        }
      } catch (error) {
        bannerCData = JSON.parse(localStorage.getItem('bannerData') || null)
        tableCData = JSON.parse(localStorage.getItem('tableData') || null)
      }
      // console.log(localStorage.getItem('tableData'), tableCData)
      if (!bannerCData || !tableCData) return this.$router.replace('/config')
      // 处理拿到的数据
      this.bannerData = bannerCData
      this.tableList = tableCData
      this.newCorrectAnswerList = tableCData
      for(let i of this.tableList.tableBody) {
        const keys = Object.keys(i);
        const vals = []
        for(let p= 0, len = keys.length; p < len; p++) {
          let key = keys[p]
          vals[p] = i[key]
          if(Array.isArray(vals[p])) {
            this.answerList = this.answerList.concat(vals[p])
            this.answerDataNum = this.answerDataNum.concat(vals[p])
          }
        }
      }
      const dragNextBoxList = {}
      const jsonAnswerData = {}
      this.tableList.tableBody.forEach((item, index) => {
        for(let p = 1; p < Object.keys(item).length; p++) {
          const pid = (index+2).toString() + (p+1).toString()
          dragNextBoxList[pid] = []
        }
      })
      this.tableList.tableBody.forEach((item, index) => {
        for(let p = 1; p < Object.keys(item).length; p++) {
          const pid = (index+2).toString() + (p+1).toString()
          jsonAnswerData[pid] = []
          let itpd = item[Object.keys(item)[p]]
          if(itpd.length !== 0) {
            for(let v = 0; v < itpd.length; v++) {
              jsonAnswerData[pid].push({
                id: itpd[v].id,
                position: itpd[v].position,
                val: itpd[v].val
              })
            }
          }
        }
      })
      this.tableAnswerList = dragNextBoxList
      this.correctAnswerData = jsonAnswerData
      this.tableListDataFlag = false
      this.createTimer()
    },
    // 计时
    createTimer() {
      var hour,minute,second;
      hour = minute = second = 0;
      this.timer = setInterval(
        () => {
          second++;
          if(second>=60){
            second=0;
            minute=minute+1;
          }
          this.timeMsg = "答题时间：" + minute + "分" + second + "秒";
          if(minute>=60){
            minute=0;
            hour=hour+1;
            this.timeMsg = "答题时间：" + hour+ '时' + minute + "分" + second + "秒";
          }
        }
      , 1000);
    },
    // object比较
    objCompare(a,b) {
      //获取a和b的属性数组
      const propsA = Object.getOwnPropertyNames(a),
      propsB = Object.getOwnPropertyNames(b);
      // 正确错误答案分类
      for(let itms in a){
        for(let v = 0; v < a[itms].length; v++) {
          const childItem = a[itms][v]
          let isright = b[itms].some((ite) => {
            return childItem['val'] === ite['val'] && childItem['position'] === ite['position'] && childItem['id'] === ite['id']
          })
          if(isright) {
            this.dragCorrectAnswerArr.push(childItem)
          } else {
            this.dragErrorAnswerArr.push(childItem)
          }
        }
      }
      // 判断是否全对
      for(let i=0;i<propsA.length-1;i++){
        const propName=propsA[i];
        if (a[propName].length === b[propName].length) {
          for (let k = 0; k < a[propName].length; k++) {
            const item = a[propName][k];
            for(let j = 0; j < b[propName].length; j++) {
              const item1 = b[propName][j];
              if (item['val'] === item1['val'] && item['position'] === item1['position'] && item['id'] === item1['id']) {
                this.answerFlag.push(true)
              }
            }
          }
        } else {
          return false
        }
      }
    }
  },
  async created () {
    this.getAnswerData()
  },
  mounted () {

  }
}
</script>
<style scoped>
.wrp {
  width: 100%;
  height: 100%;
  max-width: 1920px;
  min-width: 1180px;
  margin: 0 auto;
  background: url('~static/sorttable/greenBg.png');
  background-repeat:no-repeat;  
  background-size: 100% 100%;
}
.box{
  width: 91.979167%;
  box-sizing: border-box;
  position: relative;
  margin: 0 auto;
  height: 100vh;
}
.allbox{
  position: absolute;
  z-index: 6;
  width: 100%;
  height: 100vh;
}
.tbox{
  height: 16vh;
  line-height: 11.5vh;
  text-align: center;
  color: #ffffff;
  padding: 0 37.37%;
  box-sizing: border-box;
  font-size: 6.48vh;
  font-family: 'SourceHanSansCN', arial, sans-serif;
  font-weight: bold;
  position: relative;
}
.timeBox{
  line-height: 11.5vh;
  color: #ffffff;
  font-size: 2.593vh;
  font-family: 'SourceHanSansCN', arial, sans-serif;
  font-weight: bold;
  position: absolute;
  right: 5%;
  top: 0;
}
.cbox{
  height: 70.67vh;
  position: relative;
}
.bbox{
  height: 13.33vh;
  position: relative;
}
.cbg{
  width: 104.36%;
  height: 86.666vh;
  position: absolute;
  z-index: 5;
  right: 0;
  top: 0;
}
.ctbox{
  height: 54.67vh;
  width: 100%;
  box-sizing: border-box;
  padding: 0 2.152% 0 3.1145%;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
}
.cleftbox{
  width: 27.293%;
  height: 54.67vh;
  padding-top: 1.574vh;
}
.cbluebox{
  height: 51.574vh;
  padding: 1.296vh;
  border-radius: 3vh;
  background: #004e8b;
}
.blueCont{
  width: 100%;
  height: 100%;
  border: 2px solid #ffffff;
  border-radius: 3vh;
  padding: 1.85vh;
  box-sizing: border-box;
}
.bctopBox{
  padding: 3.2vh 2vh 1.85vh;
  border-bottom: 2px solid #ffffff;
  line-height: 4.44vh;
  min-height: 15.9vh;
  max-height: 15.9vh;
  font-size: 2.59vh;
  color: #ffffff;
  font-family: 'SourceHanSansCN', arial, sans-serif;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: auto;
}
.bannerBox{
  padding-top: 1.85vh;
  height: 29.382vh;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
}
.bannerImg{
  max-width: 100%;
  max-height: 100%;
}
.bannerVideo{
  width: 100%;
  height: 100%;
}
.bannerAudio{
  width: 100%;
}
.crightBox{
  width: 65.459%;
  height: 54.67vh;
  background: url('~static/sorttable/tableBg_03.png') no-repeat;
  background-size: 100% 100%;
  padding: 1.01852vh;
}
.ctableBox{
  width: 100%;
  height: 52.63296vh;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
}
.ctableBox::-webkit-scrollbar, .ovy::-webkit-scrollbar, .bctopBox::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 7px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.ctableBox::-webkit-scrollbar-thumb, .ovy::-webkit-scrollbar-thumb, .bctopBox::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 7px;
  box-shadow   : inset 0 0 3px rgba(4, 145, 71, 0.5);
  background   : #004e8b;
}
.ctableBox::-webkit-scrollbar-track, .ovy::-webkit-scrollbar-track, .bctopBox::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 3px rgba(4, 145, 71, 0.5);
  border-radius: 7px;
  background   : #ededed;
}
.sortTable{
  width: 100%;
  height: 52.63296vh;
  border-collapse:collapse;
  table-layout: fixed;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.sortTable thead th{
  border-left: 1.01852vh solid #b3b2b2;
  border-bottom: 1.01852vh solid #b3b2b2;
  min-height: 7vh;
  padding: 1.5vh 0.2vh;
  color: #ffffff;
  font-family: 'SourceHanSansCN', arial, sans-serif;
  font-size: 3.148vh;
  font-weight: bold;
}
#line2 thead th {
  width: 70%;
}
#line2 thead th:first-child {
  width: 25%;
}
#line3 thead th {
  width: 40%;
}
#line3 thead th:first-child {
  width: 20%;
}
#line4 thead th {
  width: 26.666%;
}
#line4 thead th:first-child {
  width: 20%;
}
#line5 thead th {
  width: 21%;
}
#line5 thead th:first-child {
  width: 16%;
}
#line6 thead th {
  width: 17%;
}
#line6 thead th:first-child {
  width: 15%;
}
.sortTable tbody tr{
  border-bottom: 1.01852vh solid #b3b2b2;
}
.sortTable tbody tr:last-child{
  border-bottom: 0;
}
.sortTable tbody tr td{
  border-left: 1.01852vh solid #b3b2b2;
  position: relative;
  background: url('~static/sorttable/pbg_03.png') center center no-repeat;
  background-size: 16%;
  text-align: center;
}
.sortTable tbody tr td:first-child{
  border-left: 0;
  background: none;
  color: #ffffff;
  font-family: 'SourceHanSansCN', arial, sans-serif;
  font-size: 3.148vh;
  font-weight: bold;
}
.sortTable thead th:first-child{
  border-left: 0;
  border-bottom: 0;
}
.cbbox{
  height: 16vh;
  position: relative;
  padding-top: 4.254vh;
  box-sizing: border-box;
}
.sidewalkImg{
  position: absolute;
  top: -1.2205vh;
  right: 5.9456%;
  height: 6.2963vh;
}
.lineDiv:before{
  content: '';
  width: 2.22vh;
  height: 3.2vh;
  background: #fdc978;
  position: absolute;
  top: -1.01852vh;
  left: -1.71074vh;
}
.lineDiv:after{
  content: '';
  width: 1.5vh;
  height: 2.22vh;
  background: #666666;
  position: absolute;
  bottom: 0;
  left: -1.2vh;
}
.answerBtn{
  height: 5.56vh;
  width: 14.44vh;
  border-radius: 6px;
  background: #ffe506;
  border: 0;
  cursor: pointer;
  padding: 0.37vh;
  position: absolute;
  top: 3.89vh;
  left: 7.96vh;
  outline: none;
}
.answerBtn div{
  line-height: 4.44vh;
  border: 1px solid #ffffff;
  border-radius: 6px;
  color: #fa2f00;
  font-family: 'SourceHanSansCN', arial, sans-serif;
  font-size: 2.59vh;
  font-weight: 500;
}
.submitBtn, .restartBtn{
  height: 9.815vh;
  width: 34.26vh;
  border-radius: 6px;
  background: #ffe506;
  border: 0;
  cursor: pointer;
  padding: 0.74vh;
  position: absolute;
  top: 1.111vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  outline: none;
}
.submitBtn div, .restartBtn div{
  line-height: 7.963vh;
  border: 2px solid #ffffff;
  border-radius: 6px;
  color: #fa2f00;
  font-family: 'SourceHanSansCN', arial, sans-serif;
  font-size: 5.56vh;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.answerBox{
  padding: 0 12.96vh 0 0.9vh;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-start;
  align-items: center;
  height: 10.64vh;
  flex-wrap: wrap;
  overflow: hidden;
  overflow-y: auto;
}
.answerDiv{
  display: block;
  width: 12.666vh;
  height: 7.888vh;
  line-height: 2.6vh;
  overflow: hidden;
  background: url('~static/sorttable/answerBg_default.png') no-repeat;
  background-size: 100% 100%;
  background-position: 0 0;
  text-align: center;
  color: #000;
  font-family: 'SourceHanSansCN', arial, sans-serif;
  font-size: 30px;
  font-weight: bold;
  margin-right: 4.074vh;
  cursor: pointer;
  box-sizing: border-box;
  padding: 4px 2.5vh 4px 1px;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
}
.tdDivBox{
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
}
.dragwrapBox{
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
}
.dragBigBox{
  display: inline-flex;
  display: -webkit-inline-flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 6px 4px;
}
.tdDivBox .answerDiv{
  color: transparent;
  background: none;
  margin: 4px;
}
.dragBigBox .Wllsd{
  padding: 0;
  min-width: 83px;
  min-height: 51.68px;
}
.tdDivBox .answerDiv .defaultAnswerImg{
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url('~static/sorttable/answerBg_default.png') no-repeat;
  background-size: 100% 100%;
  color: #000;
  padding: 4px 2.5vh 4px 1px;
  text-align: center;
}
.tdDivBox .answerDiv .correctAnswerImg{
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url('~static/sorttable/answerBg_correct.png') no-repeat;
  background-size: 100% 100%;
  color: #000;
  padding: 4px 2.5vh 4px 1px;
  text-align: center;
}
.tdDivBox .answerDiv .errorAnswerImg{
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url('~static/sorttable/answerBg_err.png') no-repeat;
  background-size: 100% 100%;
  color: #000;
  padding: 4px 2.5vh 4px 1px;
  text-align: center;
}
.modalWrap{
  position: fixed;
  z-index: 99;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
}
.maskImg{
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 100;
  width: 32.9%;
  min-width: 350px;
  transform: translate(-50%,-50%);
}
.ovy{
  padding: 10px 12.96vh 10px 0.9vh;
}
.lineone{
  font-size: 24px;
}
.linetwo{
  font-size: 17px;
}
.tlineone{
  font-size: 20px;
}
.tlinetwo{
  font-size: 14px;
}
</style>
