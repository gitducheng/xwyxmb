<template>
  <div class="config-container" ref="baseBop">
    <el-container class="configBCont">
      <el-header height="10vh">
        <div class="logo">
          <el-input
            type="text"
            placeholder="请输入游戏名称"
            v-model="bannerData.gameName"
            maxlength="5"
          ></el-input>
        </div>
      </el-header>
      <el-container>
        <el-aside width="330px">
          <div class="bannerInfoBox">
            <div class="bannerInfoTop">
              <el-input
                type="textarea"
                maxlength="100"
                :autosize="{ minRows: 6}"
                show-word-limit
                placeholder="请在这里输入100字以内的标题"
                v-model="bannerData.bannerTxt">
              </el-input>
            </div>
            <div class="bannerInfoBottom">
              <img draggable="false" v-if="bannerData.bannerClass === 'image' && bannerData.bannerUrl !== ''" class="bannerImg" :src="bannerData.bannerUrl">
              <video class="bannerVideo" v-else-if="bannerData.bannerClass === 'video' && bannerData.bannerUrl !== ''" :src="bannerData.bannerUrl" preload="auto" autoplay="autoplay" loop="loop">
                您的浏览器不支持 video 标签。
              </video>
              <audio class="bannerAudio" v-else-if="bannerData.bannerClass === 'audio' && bannerData.bannerUrl !== ''" controls="controls" loop="loop" autoplay>
                <source :src="bannerData.bannerUrl"/>
                您的浏览器不支持 audio 标签。
              </audio>
              <div class="uploadBg" v-else-if="bannerData.bannerClass === 'image' && bannerData.bannerUrl === ''"></div>
              <div class="uploadBg" v-else></div>
              <i class="delbanner el-icon-delete-solid" v-if="bannerData.bannerUrl !== ''" @click="delBannerImg"></i>
              <div class="fileUploadBtnBox">
                <input class="fileUploadBtn" type="file" id="fileUploadId" @change="newUpload($event)" />
              </div>
            </div>
          </div>
        </el-aside>
        <el-main>
          <div class="mainBox">
            <div class="tableCont">
              <table class="sortTable">
                <thead>
                  <tr>
                    <th
                      v-for="(val, index) in tableData.tableHead"
                      :key="index"
                    >
                      <div v-if="index === 0" class="newaddBtnBox">
                        <el-button v-if="isRowFlag" type="primary" plain size="small" @click="addRow">新增行</el-button>
                        <el-button v-if="isColFlag" type="success" plain size="small" @click="addCol">新增列</el-button>
                      </div>
                      <span v-else>
                        <el-input
                          type="text"
                          placeholder="请输入题目"
                          v-model="tableData.tableHead[index]"
                          maxlength="10"
                        ></el-input>
                        <i class="colDelBtn el-icon-delete" @click="delCol(index)"></i>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in tableData.tableBody" :key="index">
                      <td
                        v-for="(val, k, i) in item"
                        :key="i"
                      >
                        <span v-if="!Array.isArray(val)">
                          <el-input
                            type="text"
                            placeholder="请输入题目"
                            v-model="tableData.tableBody[index].bodyTitle"
                            maxlength="10"
                          ></el-input>
                          <i class="rowDelBtn el-icon-delete" @click="delRow(index)"></i>
                        </span>
                        <span class="tdDivBox" v-else>
                          <span v-if="val.length !== 0">
                            <el-tag
                              v-for="tages in val"
                              :key="tages.id"
                              closable
                              :disable-transitions="false"
                              class="answerTag"
                              type="success"
                              @close="handleTagDel(tages, index, i)">
                              {{tages.val}}
                            </el-tag>
                          </span>
                          <span class="anTipm" v-else>请添加答案</span>
                          <i class="addTag el-icon-circle-plus" @click="addTag(index, i)"></i>
                        </span>
                      </td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-main>
      </el-container>
      <el-footer height="10vh">
        <div class="footerBox">
          <el-button class="defalutSet" type="info" @click="defaultConfig">导入范例</el-button>
          <el-button class="saveBtn" type="success" @click="saveConfig">完成</el-button>
        </div>
      </el-footer>
    </el-container>
    <div class="indexWrapBox">
      <div class="wrp" ref="imageWrapper">
        <div class="box">
          <img class="cbg" draggable="false" src="~static/sorttable/ctbg_01.png" crossorigin="anonymous">
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
                        <img draggable="false" v-if="bannerData.bannerClass === 'image' && bannerData.bannerUrl === ''" class="bannerImg" src="~static/sorttable/banner_03.png" crossorigin="anonymous">
                        <img draggable="false" v-if="bannerData.bannerClass === 'image'" class="bannerImg" :src="bannerData.bannerUrl" crossorigin="anonymous">
                        <!-- <video class="bannerVideo" id="videoshow" v-if="bannerData.bannerClass === 'video'" :src="bannerData.bannerUrl" preload="auto" autoplay="autoplay" loop="loop" crossorigin="anonymous">
                          您的浏览器不支持 video 标签。
                        </video> -->
                        <img draggable="false" v-if="bannerData.bannerClass === 'video'" class="audioTD" src="~static/sorttable/Videostd.png" crossorigin="anonymous">
                        <img draggable="false" v-if="bannerData.bannerClass === 'audio'" class="audioTD" src="~static/sorttable/musica.png" crossorigin="anonymous">
                        <!-- <audio class="bannerAudio" id="audioshow" v-if="bannerData.bannerClass === 'audio'" controls="controls" loop="loop" crossorigin="anonymous" autoplay>
                          <source :src="bannerData.bannerUrl"/>
                          您的浏览器不支持 audio 标签。
                        </audio> -->
                      </div>
                    </div>
                  </div>
                </div>
                <div class="crightBox">
                  <div class="ctableBox">
                    <!-- 查看结果渲染 -->
                    <div class="correctAnswerBox">
                      <table class="sortTable" v-if="tableData.tableHead.length === 2" id="line2">
                        <thead>
                          <tr>
                            <th
                              v-for="(val, index) in tableData.tableHead"
                              :key="index"
                            >
                              <span>{{ val }}</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in tableData.tableBody" :key="index">
                              <td
                                v-for="(val, k, i) in item"
                                :key="i"
                              >
                                <span v-if="!Array.isArray(val)">{{ val }}</span>
                                <span class="tdDivBox pBGBOX" v-else>
                                  <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                                  <span v-else></span>
                                  <img src="~static/sorttable/pbg_03.png" class="pBgImg" crossorigin="anonymous">
                                </span>
                              </td>
                            </tr>
                        </tbody>
                      </table>
                      <table class="sortTable" v-if="tableData.tableHead.length === 3" id="line3">
                        <thead>
                          <tr>
                            <th
                              v-for="(val, index) in tableData.tableHead"
                              :key="index"
                            >
                              <span>{{ val }}</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in tableData.tableBody" :key="index">
                              <td
                                v-for="(val, k, i) in item"
                                :key="i"
                              >
                                <span v-if="!Array.isArray(val)">{{ val }}</span>
                                <span class="tdDivBox pBGBOX" v-else>
                                  <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                                  <span v-else></span>
                                  <img src="~static/sorttable/pbg_03.png" class="pBgImg" crossorigin="anonymous">
                                </span>
                              </td>
                            </tr>
                        </tbody>
                      </table>
                      <table class="sortTable" v-if="tableData.tableHead.length === 4" id="line4">
                        <thead>
                          <tr>
                            <th
                              v-for="(val, index) in tableData.tableHead"
                              :key="index"
                            >
                              <span>{{ val }}</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in tableData.tableBody" :key="index">
                              <td
                                v-for="(val, k, i) in item"
                                :key="i"
                              >
                                <span v-if="!Array.isArray(val)">{{ val }}</span>
                                <span class="tdDivBox pBGBOX" v-else>
                                  <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                                  <span v-else></span>
                                  <img src="~static/sorttable/pbg_03.png" class="pBgImg" crossorigin="anonymous">
                                </span>
                              </td>
                            </tr>
                        </tbody>
                      </table>
                      <table class="sortTable" v-if="tableData.tableHead.length === 5" id="line5">
                        <thead>
                          <tr>
                            <th
                              v-for="(val, index) in tableData.tableHead"
                              :key="index"
                            >
                              <span>{{ val }}</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in tableData.tableBody" :key="index">
                              <td
                                v-for="(val, k, i) in item"
                                :key="i"
                              >
                                <span v-if="!Array.isArray(val)">{{ val }}</span>
                                <span class="tdDivBox pBGBOX" v-else>
                                  <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                                  <span v-else></span>
                                  <img src="~static/sorttable/pbg_03.png" class="pBgImg" crossorigin="anonymous">
                                </span>
                              </td>
                            </tr>
                        </tbody>
                      </table>
                      <table class="sortTable" v-if="tableData.tableHead.length === 6" id="line6">
                        <thead>
                          <tr>
                            <th
                              v-for="(val, index) in tableData.tableHead"
                              :key="index"
                            >
                              <span>{{ val }}</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in tableData.tableBody" :key="index">
                              <td
                                v-for="(val, k, i) in item"
                                :key="i"
                              >
                                <span v-if="!Array.isArray(val)">{{ val }}</span>
                                <span class="tdDivBox pBGBOX" v-else>
                                  <span v-if="i === 2 || i === 3 || i === 4 || i === 5" class="lineDiv"></span>
                                  <span v-else></span>
                                  <img src="~static/sorttable/pbg_03.png" class="pBgImg" crossorigin="anonymous">
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
                  <span>
                    <span class="answerBox ovy">
                      <span v-for="d in answerList" :key="d.id" class="answerDiv"><span>{{d.val}}</span></span>
                    </span>
                  </span>
                </div>
                <img class="sidewalkImg" src="~static/sorttable/sidewalk2_03.png" crossorigin="anonymous">
              </div>
            </div>
            <div class="bbox">
              <button class="submitBtn">
                <div>提交</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    

  </div>
</template>

<script>
import html2canvas from 'html2canvas'
// import {zip_deflate,zip_inflate} from '~/plugins/zip_yasuo'
export default {
  name: 'config',
  data() {
    return {
      timeMsg: "答题时间：0分0秒",
      answerList: [],
      htmlImgUrl: '',
      // bannerData
      bannerData: {
        gameName: '',
        bannerTxt: '',
        bannerClass: '',
        bannerUrl: ''
      },
      // tableData
      tableData: {
        tableHead: ["","",""],
        tableBody: [
          {
            bodyTitle: "",
            result1: [],
            result2: []
          },
          {
            bodyTitle: "",
            result1: [],
            result2: []
          }
        ]
      },
      isRowFlag: true,
      isColFlag: true,
      allData: {},
      isCanvas: false,
      timer: '',
      seconds: 0,
      tidaiurl: ''
    }
  },
  methods: {
    // 上传
    newUpload(event) {
      this.bannerData.bannerClass = ''
      this.bannerData.bannerUrl = ''
      var current = event.target.files[0]
      console.log(current)
      let obj = document.querySelector('#fileUploadId');
      const typeName = current.type.substring(0, current.type.indexOf('/')).toLowerCase()
      const vTypeName = current.type.substring(current.type.indexOf('/')+1).toLowerCase()
      const audioName = current.name.substring(current.name.indexOf('.')+1).toLowerCase()
      console.log(typeName, vTypeName, audioName)
      if(!current.type.substring(0, current.type.indexOf('/')).toLowerCase()) {
        this.$notify.error({
          title: '警告',
          message: '上传文件为图片（png/jpg/gif）/视频（OGG/MP4/WebM）/音频（OGG/MP3/WAV）',
            duration: 3000
        });
        obj.value = null;
      } else {
        const maxSize = event.target.files[0].size/1024/1024
        if(typeName === 'image') {
          if(vTypeName === 'png' || vTypeName=== 'jpg' || vTypeName=== 'gif' || vTypeName=== 'jpeg') {
            if(maxSize >= 1) {
              this.$notify.error({
                title: '警告',
                message: '上传图片（png/jpg/gif）大小不得超过1M',
                duration: 3000
              });
              obj.value = null;
            } else {
              this.bannerData.bannerClass = 'image'
              var fileReader = new FileReader()
              fileReader .readAsDataURL(current)
              fileReader.onload = (e) => {
                this.bannerData.bannerUrl = e.currentTarget.result
              }
              this.$forceUpdate()
            }
          } else {
            this.$notify.error({
              title: '警告',
              message: '请上传png/jpg/gif类型图片文件',
              duration: 3000
            });
            obj.value = null;
          }
        } else if(typeName === 'video') {
          if(vTypeName === 'ogg' || vTypeName === 'mp4' || vTypeName === 'webm') {
            if(maxSize >= 3) {
              this.$notify.error({
                title: '警告',
                message: '上传视频视频（OGG/MP4/WebM）大小不得超过3M',
                duration: 3000
              });
              obj.value = null;
            } else {
              this.bannerData.bannerClass = 'video'
              var fileReader = new FileReader()
              fileReader .readAsDataURL(current)
              fileReader.onload = (e) => {
                this.bannerData.bannerUrl = e.currentTarget.result
              }
              this.$forceUpdate()
            }
          } else {
            this.$notify.error({
              title: '警告',
              message: '请上传OGG/MP4/WebM类型视频文件',
              duration: 3000
            });
            obj.value = null;
          }
        } else if(typeName === 'audio') {
          let if1 = () => {
            return audioName === 'mp3' && vTypeName === 'mpeg'
          }
          if(vTypeName === 'ogg' || if1 || vTypeName === 'wav') {
            if(maxSize >= 2) {
              this.$notify.error({
                title: '警告',
                message: '上传音频（OGG/MP3/WAV）大小不得超过2M',
                duration: 3000
              });
              obj.value = null;
            } else {
              this.bannerData.bannerClass = 'audio'
              var fileReader = new FileReader()
              fileReader .readAsDataURL(current)
              fileReader.onload = (e) => {
                this.bannerData.bannerUrl = e.currentTarget.result
              }
              this.$forceUpdate()
            }
          } else {
            this.$notify.error({
              title: '警告',
              message: '请上传OGG/MP3/WAV类型音频文件',
              duration: 3000
            });
            obj.value = null;
          }
        } else {
          this.$notify.error({
            title: '警告',
            message: '上传文件为图片（png/jpg/gif）/视频（OGG/MP4/WebM）/音频（OGG/MP3/WAV）',
            duration: 3000
          });
          obj.value = null;
        }
      }
    },
    // 删除imgbanner
    delBannerImg() {
      this.bannerData.bannerUrl = ''
      this.bannerData.bannerClass = ''
      let obj = document.querySelector('#fileUploadId');
      obj.value = null;
    },
    // 新增行
    addRow() {
      this.isRowFlag = true;
      if(this.tableData.tableBody.length <= 4) {
        var newRowData = { bodyTitle: "" }
        for(let item in this.tableData.tableBody[0]) {
          if(!(item === 'bodyTitle')) {
            newRowData[item] = []
          }
        }
        this.tableData.tableBody.push(newRowData)
        if(this.tableData.tableBody.length==5) {
          this.isRowFlag = false;
        }
      } else {
        this.isRowFlag = false;
      }
      this.$forceUpdate()
    },
    // 删除行
    delRow(e) {
      if(this.tableData.tableBody.length <= 2){
        this.$message.error('表格不能少于2行！！');
      } else {
        this.$confirm('此操作将删除该表格行, 是否继续?', '删除行', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.tableBody.splice(e, 1)
          this.isRowFlag = true;
          this.$forceUpdate()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {});
      }
    },
    // 新增列
    addCol() {
      this.isColFlag = true;
      if(this.tableData.tableHead.length <= 6) {
        this.tableData.tableHead.push("")
        const obgN = 'result' + this.getrandom(5)
        for(let i = 0; i < this.tableData.tableBody.length; i++) {
          this.tableData.tableBody[i][obgN] = []
        }
        if(this.tableData.tableHead.length === 6) {
          this.isColFlag = false;
        }
      } else {
        this.isColFlag = false;
      }
      this.$forceUpdate()
    },
    // 删除列
    delCol(e) {
      if(this.tableData.tableHead.length <= 3) {
        this.$message.error('表格不能少于3列！！');
      } else {
        this.$confirm('此操作将删除该表格列, 是否继续?', '删除列', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const objChildName = Object.keys(this.tableData.tableBody[0])[e]
          for(let i = 0; i < this.tableData.tableBody.length; i++) {
            delete this.tableData.tableBody[i][objChildName]
          }
          this.tableData.tableHead.splice(e, 1)
          this.isColFlag = true;
          this.$forceUpdate()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {});
      }
    },
    // 新增答案标签
    addTag(ind, i) {
      const mmName = Object.keys(this.tableData.tableBody[ind])[i]
      const idStr = ind.toString() + i.toString() + this.getrandom(5).toString()
      const positionStr = (ind+2).toString() + (i+1).toString()
      if(this.tableData.tableBody[ind][mmName].length>= 5) {
        this.$notify.error({
          title: '警告',
          message: '每个表格限制最多设置5个答案',
          duration: 3000
        });
        return;
      } else {
        this.$prompt('请输入不超过8个字答案', '新增答案', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入不超过8个字',
          inputPattern: /^.{1,8}$/,
          inputErrorMessage: '输入内容长度不正确'
        }).then(({ value }) => {
          this.tableData.tableBody[ind][mmName].push(
            {
              id: idStr,
              position: positionStr,
              val: value
            }
          )
          this.getAnswerJson()
          this.$forceUpdate()
        }).catch(() => {});
      }
    },
    // 删除答案标签
    handleTagDel(tages, index, i) {
      const mName = Object.keys(this.tableData.tableBody[index])[i]
      this.tableData.tableBody[index][mName].splice(this.tableData.tableBody[index][mName].findIndex(item => item.id === tages.id && item.val === tages.val), 1)
      this.getAnswerJson()
      this.$forceUpdate()
    },
    // 保存配置
    saveConfig() {
      if(this.bannerData.gameName === "") {
        this.$notify.error({
          title: '警告',
          message: '请输入游戏名称',
          duration: 3000
        });
        return;
      }
      if(this.bannerData.bannerTxt === "") {
        this.$notify.error({
          title: '警告',
          message: '请先完善左侧banner信息',
          duration: 3000
        });
        return;
      }
      for(let i = 1; i < this.tableData.tableHead.length; i++) {
        if(!this.tableData.tableHead[i]) {
          this.$notify.error({
            title: '警告',
            message: '请先完善右侧表格列头部信息',
            duration: 3000
          });
          return;
        }
      }
      for(let i = 0; i < this.tableData.tableBody.length; i++) {
        if(!this.tableData.tableBody[i].bodyTitle) {
          this.$notify.error({
            title: '警告',
            message: '请先完善右侧表格行头部信息',
            duration: 3000
          });
          return;
        }
      }
      this.getAnswerJson()
      if(this.answerList.length === 0) {
        this.$notify.error({
          title: '警告',
          message: '请添加答案',
          duration: 3000
        });
        return;
      }
      this.createTimer()
      // if(this.isCanvas) {
      //   setTimeout(() => {
      //     this.allData['bannerData'] = this.bannerData
      //     this.allData['tableData'] = this.tableData
      //     try {
      //       this.$testsave(this.htmlImgUrl, JSON.stringify(this.allData))
      //     } catch (error) {
      //       localStorage.setItem('bannerData', JSON.stringify(this.bannerData))
      //       localStorage.setItem('tableData', JSON.stringify(this.tableData))
      //     }
      //     loading.close();
      //     this.$router.replace('/')
      //   },1000)
      // } else {
      //   this.$notify.error({
      //     title: '警告',
      //     message: '配置异常，请重新配置',
      //     duration: 2000
      //   });
      // }
    },
    // 预生成img
    toImage() {
      this.htmlImgUrl = ''
      this.isCanvas = false
      this.$nextTick(() => {
        html2canvas(this.$refs.imageWrapper,{
          useCORS: true,
          backgroundColor: null
        }).then((canvas) => {
          let dataURL = canvas.toDataURL("image/png");
          this.htmlImgUrl = dataURL;
          if(this.htmlImgUrl !== '') {
            this.isCanvas = true
          }
        });
      })
    },
    // 获取所有新增的答案
    getAnswerJson()  {
      this.answerList = []
      const jsonAnswerData = []
      this.tableData.tableBody.forEach((item, index) => {
        for(let p = 1; p < Object.keys(item).length; p++) {
          if(item[Object.keys(item)[p]].length !== 0) {
            for(let v = 0; v < item[Object.keys(item)[p]].length; v++) {
              jsonAnswerData.push({
                id: item[Object.keys(item)[p]][v].id,
                position: item[Object.keys(item)[p]][v].position,
                val: item[Object.keys(item)[p]][v].val
              })
            }
          }
        }
      })
      this.answerList = jsonAnswerData
      this.$nextTick(() => {
        this.toImage()
      })
    },
    // 默认配置
    defaultConfig() {
      Object.assign(this.$data, this.$options.data())
      document.querySelector('#fileUploadId').value = null
      this.bannerData = {
        gameName: '分类表格',
        bannerTxt: '请将底部数字拖放到相应的表格中。',
        bannerClass: 'image',
        bannerUrl: ''
      }
      this.tableData = {
        tableHead: ["","奇数","偶数"],
        tableBody: [
          {
            bodyTitle: "7的倍数",
            result1: [
              {
                id: 1,
                position: 22,
                val: "7"
              }
            ],
            result2: [
              {
                id: 2,
                position: 23,
                val: "14"
              }
            ]
          },
          {
            bodyTitle: "9的倍数",
            result1: [
              {
                id: 3,
                position: 32,
                val: "9"
              }
            ],
            result2: [
              {
                id: 4,
                position: 33,
                val: "18"
              }
            ]
          }
        ]
      }
    },
    // 随机数
    getrandom(nums) {
      var arr = '';
      for(let i=0; i<nums; i++) {
        arr = arr + Math.floor(Math.random() *nums);
      }
      return arr;
    },
    // 计时
    createTimer() {
      const loading = this.$loading({
        lock: true,
        text: '配置生成中~~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.seconds = 0
      var second = 0;
      this.timer = setInterval(
        () => {
          second = second + 200;
          this.seconds = second
          if(this.isCanvas) {
            clearInterval(this.timer)
            // console.log('是否已生成缩略图时间：' + this.seconds)
            // console.log(this.htmlImgUrl)
            setTimeout(() => {
              this.allData['bannerData'] = this.bannerData
              this.allData['tableData'] = this.tableData
              try {
                localStorage.setItem('bannerData', JSON.stringify(this.bannerData))
                localStorage.setItem('tableData', JSON.stringify(this.tableData))
                this.$testsave(this.htmlImgUrl, JSON.stringify(this.allData))
              } catch (error) {
                // console.log(this.bannerData)
                localStorage.setItem('bannerData', JSON.stringify(this.bannerData))
                localStorage.setItem('tableData', JSON.stringify(this.tableData))
              }
              loading.close();
              this.$router.replace('/')
            },this.seconds)
          }
        }
      , 200);
    }
  },
  async created() {
    let bannerCData, tableCData;
    try {
      let allData = await this.$testload()
      bannerCData = allData.bannerData
      tableCData = allData.tableData
      if (typeof allData === 'string') {
        bannerCData = JSON.parse(allData).bannerData
        tableCData = JSON.parse(allData).tableData
      }
    } catch (error) {
      bannerCData = JSON.parse(localStorage.getItem('bannerData') || null)
      tableCData = JSON.parse(localStorage.getItem('tableData') || null)
    }
    if(bannerCData) {
      this.bannerData = bannerCData
    }
    if(tableCData) {
      this.tableData = tableCData
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.config-container {
  width: 100%;
  min-width: 1180px;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  background: #ffffff;
}
.configBCont{
  background: rgba(102,102,102,0.8);
}
.configBCont .el-header{
  height: 10vh;
  background: #ffffff;
  -moz-box-shadow:0px 3px 6px #CCCCCC;
  -webkit-box-shadow:0px 3px 6px #CCCCCC;
  box-shadow:0px 3px 6px #CCCCCC;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
}
.configBCont .logo{
  text-align: center;
  line-height: 10vh;
  color: #555;
  font-weight: 500;
  font-size: 22px;
}
.configBCont .el-footer{
  height: 10vh;
  background: #ffffff;
  -moz-box-shadow:0px -3px 6px #CCCCCC;
  -webkit-box-shadow:0px -3px 6px #CCCCCC;
  box-shadow:0px -3px 6px #CCCCCC;
  box-sizing: border-box;
  padding: 15px;
  position: relative;
}
.configBCont .footerBox{
  width: 100%;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
}
.configBCont .addAnswer{
  width: 40px;
  height: 40px;
  line-height: 40px;
  position: absolute;
  top: 50%;
  margin-top: -20px;
  right: 50px;
  text-align: center;
  cursor: pointer;
  font-size: 36px;
  font-weight: bold;
  color: #666;
}
.configBCont .el-aside {
  color: #333;
  text-align: center;
  height: 80vh;
  padding: 20px 10px 20px 15px;
  box-sizing: border-box;
}
.configBCont .el-main {
  height: 80vh;
  padding: 20px 15px 20px 10px;
  box-sizing: border-box;
}
.configBCont .bannerInfoBox,.configBCont  .mainBox{
  height: 100%;
  width: 100%;
  background: #ffffff;
  border-radius: 10px;
  -webkit-box-shadow: 0 0 8px #ccc;
  -moz-box-shadow: 0 0 8px #ccc;
  box-shadow: 0 0 8px #ccc;
  box-sizing: border-box;
  padding: 15px;
}
.configBCont .bannerInfoTop{
  height: 31%;
  max-height: 31%;
  margin-bottom: 5%;
  overflow: hidden;
  overflow-y: auto;
}
.configBCont .tableCont{
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
}
.configBCont .bannerInfoTop::-webkit-scrollbar, .configBCont .tableCont::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 7px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.configBCont .bannerInfoTop::-webkit-scrollbar-thumb, .configBCont .tableCont::-webkit-scrollbar-thumb{
  /*滚动条里面小方块*/
  border-radius: 7px;
  box-shadow   : inset 0 0 3px rgba(230, 230, 230, 0.5);
  background   : #666666;
}
.configBCont .bannerInfoTop::-webkit-scrollbar-track, .configBCont .tableCont::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 3px rgba(230, 230, 230, 0.5);
  border-radius: 7px;
  background   : #ededed;
}
.configBCont .bannerInfoBottom{
  height: 64%;
  position: relative;
  display: flex;
  display: -webkit-flex;
  justify-items: center;
  align-items: center;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
}
.configBCont .bannerInfoBottom img, .configBCont .bannerInfoBottom video, .configBCont .bannerInfoBottom audio{
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
}
.configBCont .uploadBg{
  width: 100%;
  height: 100%;
  background: rgba(161,217,250,0.8) url('~static/sorttable/banner_03.png') center no-repeat;
  border-radius: 4px;
}
.configBCont .fileUploadBtnBox {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.configBCont .fileUploadBtn{
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.configBCont .sortTable{
  width: 100%;
  height: 100%;
  border-collapse:collapse;
  table-layout: fixed;
  border: 1px solid #DCDFE6;
  border-radius: 10px;
}
.configBCont .sortTable .el-button--small{
  padding: 5px 7px;
  margin-left: 8px;
}
.configBCont .sortTable .el-button--small:first-child{
  margin-left: 3px;
}
.configBCont .sortTable thead tr th{
  border-left: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  height: 47px;
  line-height: 23px;
  color: #909399;
  font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu;
  font-size: 14px;
  font-weight: bold;
  padding: 12px 27px 12px 10px;
  min-width: 0;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
.configBCont .sortTable tbody td{
  border: 1px solid #DCDFE6;
  min-height: 47px;
  line-height: 23px;
  color: #666;
  font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu;
  font-size: 14px;
  padding: 12px 10px;
  min-width: 0;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
.configBCont .sortTable thead th:first-child{
  border-left: 0;
  border-bottom: 0;
  padding: 12px 5px;
}
.configBCont .sortTable tbody td:first-child{
  border-top: 0;
}
.configBCont .colDelBtn{
  position: absolute;
  top: 2px;
  right: 1px;
  width: 24px;
  height: 24px;
  font-size: 22px;
  cursor: pointer;
  display: none;
  color: #67C23A;
}
.configBCont .sortTable thead th:hover .colDelBtn{
  display: block;
}
.configBCont .rowDelBtn{
  position: absolute;
  bottom: 2px;
  left: 1px;
  width: 24px;
  height: 24px;
  font-size: 22px;
  cursor: pointer;
  display: none;
  color: #409EFF;
}
.configBCont .sortTable tbody td:hover .rowDelBtn{
  display: block;
}
.configBCont .addTag {
  position: absolute;
  top: 2px;
  right: 1px;
  width: 30px;
  height: 30px;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  color: #409EFF;
}
.configBCont .answerTag{
  margin: 5px;
}
.configBCont .tdDivBox {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
}
.configBCont .anTipm{
  margin: 0 auto;
  color: #999;
}
.configBCont .configBCont{
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 900;
}
.configBCont .saveBtn {
  background-color: #0ED04B;
  border-color: #0ED04B;
}
.configBCont .defalutSet{
  color: #5F6C65;
  background-color: #cccccc;
  border-color: #cccccc;
}
/* index.css */
.indexWrapBox {
  position:fixed;top:0;bottom:0;left:0;right:0;z-index:-100;
}
.indexWrapBox .wrp {
  width: 100%;
  height: 100%;
  max-width: 1920px;
  min-width: 1080px;
  margin: 0 auto;
  background: url('~static/sorttable/greenBg.png');
  background-repeat:no-repeat;  
  background-size: 100% 100%;
}
.indexWrapBox .box{
  width: 91.979167%;
  box-sizing: border-box;
  position: relative;
  margin: 0 auto;
  height: 100vh;
}
.indexWrapBox .allbox{
  position: absolute;
  z-index: 6;
  width: 100%;
  height: 100vh;
}
.indexWrapBox .tbox{
  height: 16vh;
  line-height: 11.5vh;
  text-align: center;
  color: #ffffff;
  padding: 0 37.37%;
  box-sizing: border-box;
  font-size: 6.48vh;
  font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu;
  font-weight: bold;
  position: relative;
}
.indexWrapBox .timeBox{
  line-height: 11.5vh;
  color: #ffffff;
  font-size: 2.593vh;
  font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu;
  font-weight: bold;
  position: absolute;
  right: 5%;
  top: 0;
}
.indexWrapBox .cbox{
  height: 70.67vh;
  position: relative;
}
.indexWrapBox .bbox{
  height: 13.33vh;
  position: relative;
}
.indexWrapBox .cbg{
  width: 104.36%;
  height: 86.666vh;
  position: absolute;
  z-index: 5;
  right: 0;
  top: 0;
}
.indexWrapBox .ctbox{
  height: 54.67vh;
  width: 100%;
  box-sizing: border-box;
  padding: 0 2.152% 0 3.1145%;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
}
.indexWrapBox .cleftbox{
  width: 27.293%;
  height: 54.67vh;
  padding-top: 1.574vh;
}
.indexWrapBox .cbluebox{
  height: 51.574vh;
  padding: 1.296vh;
  border-radius: 3vh;
  background: #004e8b;
}
.indexWrapBox .blueCont{
  width: 100%;
  height: 100%;
  border: 2px solid #ffffff;
  border-radius: 3vh;
  padding: 1.85vh;
  box-sizing: border-box;
}
.indexWrapBox .bctopBox{
  padding: 3.2vh 2vh 1.85vh;
  border-bottom: 2px solid #ffffff;
  line-height: 4.44vh;
  min-height: 15.9vh;
  max-height: 15.9vh;
  font-size: 2.59vh;
  color: #ffffff;
  font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: auto;
}
.indexWrapBox .bannerBox{
  padding-top: 1.85vh;
  height: 29.382vh;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.video-Img{
  display: block;
  width: 100%;
  max-height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
}
.indexWrapBox .bannerImg{
  max-width: 100%;
  max-height: 100%;
}
.indexWrapBox .bannerVideo{
  width: 100%;
  height: auto;
}
.indexWrapBox .bannerAudio{
  width: 100%;
}
.indexWrapBox .crightBox{
  width: 65.459%;
  height: 54.67vh;
  background: url('~static/sorttable/tableBg_03.png') no-repeat;
  background-size: 100% 100%;
  padding: 1.01852vh;
}
.indexWrapBox .ctableBox{
  width: 100%;
  height: 52.63296vh;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
}
.indexWrapBox .ctableBox::-webkit-scrollbar, .indexWrapBox .ovy::-webkit-scrollbar, .indexWrapBox .bctopBox::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 7px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.indexWrapBox .ctableBox::-webkit-scrollbar-thumb, .indexWrapBox .ovy::-webkit-scrollbar-thumb, .indexWrapBox .bctopBox::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 7px;
  box-shadow   : inset 0 0 3px rgba(4, 145, 71, 0.5);
  background   : #004e8b;
}
.indexWrapBox .ctableBox::-webkit-scrollbar-track, .indexWrapBox .ovy::-webkit-scrollbar-track, .indexWrapBox .bctopBox::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 3px rgba(4, 145, 71, 0.5);
  border-radius: 7px;
  background   : #ededed;
}
.indexWrapBox .sortTable{
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
.indexWrapBox .sortTable thead th{
  border-left: 1.01852vh solid #b3b2b2;
  border-bottom: 1.01852vh solid #b3b2b2;
  line-height: 7vh;
  color: #ffffff;
  font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu;
  font-size: 3.148vh;
  font-weight: bold;
}
.indexWrapBox #line2 thead th {
  width: 70%;
}
.indexWrapBox #line2 thead th:first-child {
  width: 25%;
}
.indexWrapBox #line3 thead th {
  width: 40%;
}
.indexWrapBox #line3 thead th:first-child {
  width: 20%;
}
.indexWrapBox #line4 thead th {
  width: 26.666%;
}
.indexWrapBox #line4 thead th:first-child {
  width: 20%;
}
.indexWrapBox #line5 thead th {
  width: 21%;
}
.indexWrapBox #line5 thead th:first-child {
  width: 16%;
}
.indexWrapBox #line6 thead th {
  width: 17%;
}
.indexWrapBox #line6 thead th:first-child {
  width: 15%;
}
.indexWrapBox .sortTable tbody tr{
  border-bottom: 1.01852vh solid #b3b2b2;
}
.indexWrapBox .sortTable tbody tr:last-child{
  border-bottom: 0;
}
.indexWrapBox .sortTable tbody tr td{
  border-left: 1.01852vh solid #b3b2b2;
  position: relative;
  text-align: center;
}
.pBgImg{
  width: 16%;;
}
.indexWrapBox .sortTable tbody tr td:first-child{
  border-left: 0;
  background: none;
  color: #ffffff;
  font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu;
  font-size: 3.148vh;
  font-weight: bold;
}
.indexWrapBox .sortTable thead th:first-child{
  border-left: 0;
  border-bottom: 0;
}
.indexWrapBox .cbbox{
  height: 16vh;
  position: relative;
  padding-top: 4.254vh;
  box-sizing: border-box;
}
.indexWrapBox .sidewalkImg{
  position: absolute;
  top: -1.2205vh;
  right: 5.9456%;
  height: 6.2963vh;
}
.indexWrapBox .lineDiv:before{
  content: '';
  width: 2.22vh;
  height: 3.2vh;
  background: #fdc978;
  position: absolute;
  top: -1.01852vh;
  left: -1.71074vh;
}
.indexWrapBox .lineDiv:after{
  content: '';
  width: 1.5vh;
  height: 2.22vh;
  background: #666666;
  position: absolute;
  bottom: 0;
  left: -1.2vh;
}
.indexWrapBox .answerBtn{
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
.indexWrapBox .answerBtn div{
  line-height: 4.44vh;
  border: 1px solid #ffffff;
  border-radius: 6px;
  color: #fa2f00;
  font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu;
  font-size: 2.59vh;
  font-weight: 500;
}
.indexWrapBox .submitBtn, .indexWrapBox .restartBtn{
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
.indexWrapBox .submitBtn div, .indexWrapBox .restartBtn div{
  line-height: 7.963vh;
  border: 2px solid #ffffff;
  border-radius: 6px;
  color: #fa2f00;
  font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu;
  font-size: 5.56vh;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.indexWrapBox .answerBox{
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
.indexWrapBox .answerDiv{
  display: block;
  width: 12.666vh;
  height: 7.888vh;
  line-height: 2.6vh;
  overflow: hidden;
  background: url('~static/sorttable/answerBg_default.png') no-repeat;
  background-size: 100% 100%;
  background-position: 0 0;
  text-align: center;
  color: #ffffff;
  font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu;
  font-size: 2.3vh;
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
.indexWrapBox .tdDivBox{
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
}
.indexWrapBox .pBGBOX{
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
}
.indexWrapBox .dragwrapBox{
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
}
.indexWrapBox .dragBigBox{
  display: inline-flex;
  display: -webkit-inline-flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 12px;
}
.indexWrapBox .tdDivBox .answerDiv{
  color: transparent;
  background: none;
  margin: 8px;
}
.indexWrapBox .dragBigBox .Wllsd{
  padding: 0;
}
.indexWrapBox .tdDivBox .answerDiv .defaultAnswerImg{
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url('~static/sorttable/answerBg_default.png') no-repeat;
  background-size: 100% 100%;
  color: #ffffff;
  padding: 4px 2.5vh 4px 1px;
  text-align: center;
}
.indexWrapBox .tdDivBox .answerDiv .correctAnswerImg{
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url('~static/sorttable/answerBg_correct.png') no-repeat;
  background-size: 100% 100%;
  color: #ffffff;
  padding: 4px 2.5vh 4px 1px;
  text-align: center;
}
.indexWrapBox .tdDivBox .answerDiv .errorAnswerImg{
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url('~static/sorttable/answerBg_err.png') no-repeat;
  background-size: 100% 100%;
  color: #ffffff;
  padding: 4px 2.5vh 4px 1px;
  text-align: center;
}
.indexWrapBox .ovy{
  padding: 10px 12.96vh 10px 0.9vh;
}
.audioTD{
  display: block;
  width: 90px;
  height: 90px;
  color: #ffffff;
  margin: 0 auto;
}
</style>
<style>
.el-tag{
  padding: 0 6px;
}
.el-tag .el-icon-close{
  right: -3px;
}
.configBCont .sortTable .el-input__inner{
  color: #5F6C65!important;
  font-size: 16px!important;
  font-family:'Microsoft YaHei',微软雅黑,'MicrosoftJhengHei',华文细黑,STHeiti,MingLiu;
  padding: 0 7px;
}
.configBCont .el-textarea__inner{
  color: #152C2C!important;
  font-size: 16px!important;
  font-family:'Microsoft YaHei',微软雅黑,'MicrosoftJhengHei',华文细黑,STHeiti,MingLiu;
}
.configBCont .delbanner{
  width: 30px;
  height: 30px;
  position: absolute;
  right: 2px;
  top: 2px;
  font-size: 24px;
  color: #F56C6C;
  z-index: 12;
  cursor: pointer;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
}
</style>
