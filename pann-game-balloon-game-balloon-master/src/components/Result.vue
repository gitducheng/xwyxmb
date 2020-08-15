<template>
  <div class="result-wrapper">
    <div class="result">
      <img
        class="result__bg"
        src="../assets/result-bg.png"
      >
      <div class="result__content">
        <template v-if="activeTab===0">
          <div class="result__label">
            <img
              class="is-vertical-centered"
              width="25"
              height="20"
              src="../assets/check.png"
            >
            <span class="is-vertical-centered is-ml-12">正确答案</span>
          </div>
          <div
            class="result__label"
          >
            <img
              class="is-vertical-centered"
              width="20"
              height="20"
              src="../assets/times.png"
            >
            <span class="is-vertical-centered is-ml-12">错误答案</span>
          </div>

          <div class="result__answers is-clearfix">
            <div class="result__answers-wrapper result__right-answers">
              <div
                v-for="(answer,index) in config.rightList"
                :key="index"
                class="result__answer"
              >
                {{ answer }}
              </div>
            </div>
            <div class="result__answers-wrapper result__wrong-answers">
              <div
                v-for="(answer,index) in config.mixedList"
                :key="index"
                class="result__answer"
              >
                {{ answer }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="result__label is-small">
            答对 <span class="result__label-right">{{ score.leftCorrectCount }}</span> 个，
            答错 <span class="result__label-wrong">{{ score.leftErrorCount }}</span> 个
          </div>
          <div class="result__label is-small">
            答对 <span class="result__label-right">{{ score.rightCorrectCount }}</span> 个，
            答错 <span class="result__label-wrong">{{ score.rightErrorCount }}</span> 个
          </div>
          <div class="result__answers is-clearfix">
            <div class="result__answers-wrapper result__right-answers">
              <div
                v-for="(answer,index) in score.leftRecords"
                :key="index"
                class="result__answer"
                :class="answer.right ? 'is-right' : 'is-wrong' "
              >
                {{ answer.text }}
              </div>
            </div>
            <div class="result__answers-wrapper result__wrong-answers">
              <div
                v-for="(answer,index) in score.rightRecords"
                :key="index"
                class="result__answer"
                :class="answer.right ? 'is-right' : 'is-wrong' "
              >
                {{ answer.text }}
              </div>
            </div>
          </div>
        </template>

        <div class="result__tabs">
          <div
            v-for="(tab, index) in tabs"
            :key="index"
            class="result__tab"
            :class="{'is-active': activeTab === index}"
            @click="activeTab = index"
          >
            {{ tab }}
          </div>
        </div>
      </div>
      <div class="result__actions">
        <div
          class="result__action"
          @click="$emit('back2score')"
        >
          返回
        </div>
        <div
          class="result__action"
          @click="restart"
        >
          重新开始
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Why? canvas中无法实现滚动条，所以结果使用html开发
 */
export default {
  name: 'Result',
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    score: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tabs: ['题目答案', '作答结果'],
      activeTab: 0,
    }
  },
  methods: {
    restart() {
      this.$router.push({ query: { replay: 1 } })
      window.location.reload()
    },
  },
}
</script>

<style lang="scss">
.result {
  position: absolute;
  width: 720px;
  height: 400px;
  left: 45%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #755858;

  &__bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  &__content {
    position: absolute;
    top: 108px;
    width: 100%;
  }

  &__label {
    display: inline-block;
    width: 50%;
    text-align: center;
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;

    &.is-small {
      font-size: 16px;
    }

    &-right {
      color: #6c9b2c;
    }

    &-wrong {
      color: #b4340d;
    }
  }

  &__answers {
    margin-top: 20px;
    padding: 0 20px;
    min-height: 180px;
    max-height: 180px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  &__answers-wrapper {
    display: inline-block;
    width: 50%;
    float: left;
    font-weight: bold;
  }

  &__answer {
    position: relative;
    height: 26px;
    line-height: 26px;
    margin-bottom: 8px;
    background-image: url("../assets/result-answer-bg.png");
    background-size: 80%;
    background-position: center;
    background-repeat: no-repeat;
    text-align: center;

    &:after {
      content: '';
      position: absolute;
      background-repeat: no-repeat;
      top: 6px;
    }

    &.is-right:after {
      right: 48px;
      background-image: url("../assets/check.png");
      background-size: 100%;
      width: 18px;
      height: 18px;
    }

    &.is-wrong:after {
      right: 50px;
      background-image: url("../assets/times.png");
      background-size: 100%;
      width: 14px;
      height: 14px;
    }
  }

  &__answer-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 80%;
  }

  &__tabs {
    width: 200px;
    margin: 20px auto 0;
    background-color: #b1cfe8;
    border-radius: 26px;
    color: #ffffff;
  }

  &__tab {
    display: inline-block;
    min-width: 50%;
    height: 26px;
    line-height: 26px;
    text-align: center;
    font-weight: bold;
    cursor: default;

    &.is-active {
      background-image: linear-gradient(0deg,
        #e2673e 0%,
        #c7e8fd 100%);
      border-radius: 26px;
      box-shadow: -1px 5px 10px 0px rgba(224, 106, 113, 0.79);
    }
  }

  &__actions {
    position: absolute;
    top: 148px;
    right: -240px;
    width: 200px;
  }

  &__action {
    width: 130px;
    height: 36px;
    line-height: 36px;
    font-size: 18px;
    font-weight: bold;
    border: solid 1px #f1b9a8;
    border-radius: 13px;
    color: #ffffff;
    text-align: center;
    cursor: default;
    background-image: linear-gradient(0deg,
      #e2673e 0%,
      #c7e8fd 100%);
    box-shadow: -6px 6px 0px 0px rgba(4, 18, 5, 0.1);
    margin-bottom: 50px;
  }
}
</style>
