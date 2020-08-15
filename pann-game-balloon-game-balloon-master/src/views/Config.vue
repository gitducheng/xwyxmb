<template>
  <div class="config">
    <div class="config__header">
      分组竞争
    </div>
    <div class="config__body">
      <div class="config__item">
        <div class="config__label">
          互动主题：
        </div>
        <div class="config__content is-inline">
          <input
            v-model="subject"
            class="config__subject"
            type="text"
            placeholder="单击输入主题内容"
          >
        </div>
      </div>
      <div class="config__item">
        <div class="config__label">
          正确项
          <span class="config__count">{{ rightList.length }}</span>/20
        </div>
        <div class="config__content">
          <tag-input
            v-model="rightList"
            :max-text-length="3"
            class="is-mt-8"
          />
        </div>
      </div>
      <div class="config__item">
        <div class="config__label">
          干扰项
          <span class="config__count">{{ mixedList.length }}</span>/10
        </div>
        <div class="config__content">
          <tag-input
            v-model="mixedList"
            :max-text-length="3"
            :max="10"
            class="is-mt-8"
          />
        </div>
      </div>
      <div class="config__footer is-clearfix">
        <div class="config-meta">
          <span class="config-meta__label">
            游戏难度：
          </span>
          <select
            v-model="difficulty"
            class="config-meta__content config-meta__select"
          >
            <option
              v-for="o in difficultyOptions"
              :key="o.value"
              :value="o.value"
            >
              {{ o.label }}
            </option>
          </select>
        </div>
        <div class="config-meta is-ml-24">
          <span class="config-meta__label">
            游戏时长：
          </span>
          <span class="config-meta__content">
            {{ duration }} 秒
          </span>
        </div>
        <div class="config__actions">
          <button
            class="button is-outlined is-mr-16"
            @click="handleImportExample"
          >
            导入范例
          </button>
          <button
            class="button is-primary"
            :disabled="submitting"
            @click="handleSubmit"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import isEmpty from 'lodash/isEmpty'
import Noty from 'noty'
import TagInput from '../components/TagInput'
import example from '../example.json'
import cloneDeep from 'lodash/cloneDeep'
import { load, save } from '../utils/container'

export default {
  components: { TagInput },
  data() {
    return {
      subject: '',
      rightList: [],
      mixedList: [],
      difficulty: 2,
      difficultyOptions: [
        { value: 1, label: '低' },
        { value: 2, label: '中' },
        { value: 3, label: '高' },
      ],
      submitting: false,
    }
  },
  computed: {
    duration() {
      // 高难度：5秒+个数*1.75，中难度：7秒+个数*2.25，低难度：8秒+个数*3.25；秒数四舍五入，
      // 比如只有一个元素的时候高难度7秒，中难度9秒，低难度11秒；
      const count = this.rightList.length + this.mixedList.length
      if (this.difficulty === 3) {
        return Math.round(5 + count * 1.75)
      } else if (this.difficulty === 2) {
        return Math.round(7 + count * 2.25)
      } else {
        return Math.round(8 + count * 3.25)
      }
      // return 10
    },
  },
  watch: {
    subject(val, oldVal) {
      if (val.length > 10) {
        new Noty({
          type: 'warning',
          text: '主题不能超过10个字',
          layout: 'topCenter',
          timeout: 2000,
        }).show()
        if (oldVal.length === 10) {
          // 禁止任何输入
          this.subject = oldVal
        } else {
          // 截取前10个字
          this.subject = this.subject.substring(0, 10)
        }
      }
    },
  },
  created() {
    load().then((data) => {
      if (!isEmpty(data)) {
        this.subject = data.subject
        this.rightList = data.rightList
        this.mixedList = data.mixedList
        this.difficulty = data.difficulty
      }
    }, (err) => {
      console.error(err)
    })
  },
  methods: {
    handleImportExample() {
      const { subject, rightList, mixedList } = cloneDeep(example)
      this.subject = subject
      this.rightList = rightList
      this.mixedList = mixedList
    },
    error(msg) {
      new Noty({
        type: 'warning',
        text: msg,
        layout: 'topCenter',
        timeout: 2000,
      }).show()
    },
    handleSubmit() {
      if (!this.subject.trim()) {
        this.error('请填写互动主题')
        return
      } else if (this.subject.trim().length > 10) {
        this.error('互动主题不能超过10个字')
        return
      } else if (this.rightList.length === 0) {
        this.error('请填写正确项')
        return
      } else if (this.mixedList.length === 0) {
        this.error('请填写干扰项')
        return
      }
      this.submitting = true
      // TODO 设置封面
      save('', {
        subject: this.subject.trim(),
        rightList: this.rightList,
        mixedList: this.mixedList,
        duration: this.duration,
        difficulty: this.difficulty,
      }).then(() => {
        this.$router.push({ name: 'Home' })
      }, (err) => {
        this.error(err.toString())
      })
    },
  },
}
</script>
