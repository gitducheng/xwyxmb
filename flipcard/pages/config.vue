<template>
  <div class="config-container">
    <div class="input-title">
      <el-input class="input-title__el-input" 
      maxlength="6"
      v-model="titleVal" placeholder="请输入标题"></el-input>
    </div>
    <div class="main">
      <div class="config-card">
        <config-card v-for="(item, index) in configData"
        :length="configData.length"
                     :key="index"
                     :index="index"
                     :selected="currentSelected === index"
                     @currentIndex="getCurrentClickIndex"
                     @deleteCard="deleteCard"
                     v-model="configData[index]"
        />
      </div>
    </div>
    <div class="add-card">
      <div class="add-card__btn" @click="addCard">{{addCardText}}</div>
      <div class="compleBtn">
        <span class="tips">{{ tips }}</span>
        <el-button type="info" @click="handleDefault">导入范例</el-button>
        <el-button type="success" @click="handleSubmit">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ConfigCard from './components/configCard/index.vue'
import save from '~/components/game/save'
import initQuestion from '~/static/fanfanka/question.json'
import _ from 'lodash'

export default{
  name: "Config",
  components: {
    ConfigCard
  },
  data() {
    return {
      titleVal: '',
      currentSelected: 0,
      configData: [
        {
          zhengText: '',
          zhengImg: '',
          fanText: '',
          fanImg: ''
        },
        {
          zhengText: '',
          zhengImg: '',
          fanText: '',
          fanImg: ''
        },
      ],
      tips: '',
      switch: false,
    }
  },
  computed: {
    addCardText() {
      return `+添加卡片(${this.configData.length}/8)`
    }
  },
  async mounted() {
    let configData
    try {
      configData = await this.$testload()
      if (typeof configData === 'string') {
        configData = JSON.parse(configData || null)
      }
    } catch (error) {
      configData = JSON.parse(localStorage.getItem('configData') || null)
    }
    if(configData) {
      this.titleVal = configData.title
      this.configData = configData.data
    }
    
  },
  methods: {
    getCurrentClickIndex(data) {
      this.currentSelected = data
    },
    addCard() {
      if (this.configData.length === 8) {
        this.$message({
          message: '卡片不能超过8个',
          type: 'warning'
        })
        return
      }
      this.configData.push({
        zhengText: '',
        zhengImg: '',
        fanText: '',
        fanImg: ''
      })
      this.currentSelected = this.configData.length - 1
    },
    deleteCard(data) {
      if (this.configData.length === 2) return
      this.configData.splice(data, 1)
      if (this.configData.length === data) {
        this.currentSelected = this.configData.length - 1
      }
    },
    handleDefault() {
      this.titleVal = initQuestion.title
      this.configData = JSON.parse(JSON.stringify(initQuestion.data))
    },
    handleSubmit: _.debounce(async function() {
      //提交
      if (!this.titleVal) {
        this.$message({
          message: '题目不能为空',
          type: 'error'
        })
        return
      }

      try {
        this.configData && this.configData.forEach(itemObj => {
          if (((!itemObj['zhengText']) && (!itemObj['zhengImg'])) || ((!itemObj['fanText']) && (!itemObj['fanImg']))) {
            throw new Error('卡片内容不能为空')
          }
        })
      } catch (error) {
        this.$message({
          message: '卡片内容不能为空',
          type: 'error'
        })
        return
      }
      const configData = {
        title: this.titleVal,
        data: this.configData,
        name: 'flipcard'
      }
      try {
        const thumbnail = await save(configData)
        await this.$testsave(thumbnail, JSON.stringify(configData))
      } catch (error) {
        localStorage.setItem('configData', JSON.stringify(configData))
      }
      this.$router.replace('/')
    }, 800),
  },
}
</script>

<style lang="less">
.config-container {
  width: 100%;
  height: 100%;
  min-width: 510px;
  margin: 0 auto;
  // padding: 60px 0;
  box-sizing: border-box;
  font-family: 'Microsoft YaHei';
  .input-title {
    position: fixed;
    top: 0;
    left: 0;
    // transform: translateX(-50%);
    background: #fff;
    width: 100%;
    height: 120px;
    line-height: 120px;
    z-index: 10;
    text-align: center;
    &__el-input {
      width: 40%;
      margin: 0 auto;
      .el-input__inner {
        font-size: 16px;
        color: #152c2c;
      }
    }
  }
  .main {
    padding: 20px 20px 0;
    margin: 120px auto 80px;
    border-radius: 4px;
    box-sizing: border-box;
    text-align: left;
    font-size: 0;
    &__seat {
      display: inline-block;
      width: 394px;
      margin: 0 10px 10px;
    }
    .config-card {
      padding-top: 6px;
      min-height: 380px;
      padding-bottom: 20px;
      // border-bottom: 1px solid #ccc;
    }
  }
  .add-card {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    border-top: 1px solid #ccc;
    background: #fff;
    z-index: 10;
    &__btn {
      width: 154px;
      height: 40px;
      padding: 10px 15px;
      border-radius: 10px;
      background: orange;
      color: #fff;
      font-size: 16px;
      margin: 10px auto 0;
      text-align: center;
      cursor: pointer;
    }

  }
  .compleBtn {
    position: absolute;
    top: 0px;
    right: 0;
    margin-top: 10px;
    margin-right: 150px;
    text-align: right;
    .el-button--info {
      background: #ccc;
      color: #5f6c65;
      border: none;
    }
    .el-button--success {
      background: #0ed04b;
      border: none;
    }
  }
  .tips {
    display: inline-block;
    width: 100px;
    height: 20px;
    color: red;
  }
}
// placeholder
input::-webkit-input-placeholder {
  color: #5f6c65;
}

input:-moz-placeholder {
  color: #5f6c65;
}

input::-moz-placeholder {
  color: #5f6c65;
}

input:-ms-input-placeholder {
  color: #5f6c65;
}
</style>
