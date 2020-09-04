<template>
  <div
class="tag-input"
       :class="{'is-focus': focusing}"
       @click="handleWrapClick"
>
    <span
v-if="placeholderVisible"
          class="tag-input__placeholder"
>
      单击输入，按【回车键】添加
    </span>
    <div
v-for="(tag, index) in tags"
         :key="index"
         class="tag-input__item"
         @click.prevent.stop
>
      <span class="tag-input__item-text">{{ tag }}</span>
      <span
class="tag-input__item-close"
            @click="handleRemoveItem(index)"
>×</span>
    </div>
    <div
class="is-inline-block"
         style="max-width: 100%;"
         :style="{width: inputInnerWidth + 'px'}"
>
      <input
ref="inputInner"
             v-model="inputValue"
             type="text"
             class="tag-input__inner"
             @blur="focusing = false"
             @focus="focusing = true"
             @keydown.enter="handleInputEnter"
             @keydown.delete="handleInputDelete"
             @input="handleInputChange"
             @compositionstart="compositing=true"
             @compositionend="compositing=false"
>
    </div>
  </div>
</template>
<script>
import Noty from 'noty'

export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    maxTextLength: {
      type: Number,
      default: 10,
    },
    max: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      tags: [],
      inputValue: '',
      compositing: false,
      focusing: false,
      inputComposedValue: '', // 拼写长度，用户计算输入框宽度
      tipShow: '',
    }
  },
  computed: {
    inputInnerWidth() {
      const { enLength, zhLength } = this.countMixedString(this.inputComposedValue)
      let width = 0
      if (enLength) {
        width += enLength * 11
      }
      if (zhLength) {
        width += zhLength * 18
      }
      return width || 18
    },
    placeholderVisible() {
      return this.tags.length === 0 && !this.inputComposedValue
    },
  },
  watch: {
    value(val) {
      this.tags = val
    },
    tags(val) {
      this.$emit('input', val)
    },
    inputValue(value, oldValue) {
      if (value.length > this.maxTextLength) {
        if (!this.tipShow) {
          new Noty({
            type: 'warning',
            text: `选项不能超过${this.maxTextLength}个字`,
            layout: 'topCenter',
            timeout: 2000,
          }).show()
          this.tipShow = setTimeout(() => {
            this.tipShow = ''
          }, 2000)
        }
        if (oldValue.length === this.maxTextLength) {
          // 禁止任何输入
          this.inputValue = oldValue
        } else {
          // 截取前n个字
          this.inputValue = this.inputValue.substring(0, this.maxTextLength)
        }
      }
    },
  },
  methods: {
    handleWrapClick() {
      this.$refs.inputInner.focus()
    },
    handleInputChange(e) {
      this.inputComposedValue = e.target.value
    },
    handleInputEnter() {
      if (!this.inputValue) {
        return
      }
      if (this.compositing) {
        return
      }
      if (this.tags.length >= this.max) {
        if (!this.tipShow) {
          new Noty({
            type: 'warning',
            text: `选项不能超过${this.max}个`,
            layout: 'topCenter',
            timeout: 2000,
          }).show()
          this.tipShow = setTimeout(() => {
            this.tipShow = ''
          }, 2000)
        }
        return
      }
      if (this.inputValue.trim().length > this.maxTextLength) {
        new Noty({
          type: 'warning',
          text: `选项不能超过${this.maxTextLength}个字`,
          layout: 'topCenter',
          timeout: 2000,
        }).show()
        return
      }
      this.tags.push(this.inputValue.trim() || ' ')
      this.inputValue = ''
      this.inputComposedValue = ''
    },
    handleInputDelete() {
      if (this.inputValue) {
        // 防止删除文字的时候误删标签
        return
      }
      if (this.tags.length > 0) {
        this.tags.splice(this.tags.length - 1, 1)
      }
    },
    handleRemoveItem(tagIndex) {
      this.tags.splice(tagIndex, 1)
    },
    countMixedString(str) {
      let zhLength = 0
      let enLength = 0
      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
          zhLength++
        } else {
          enLength++
        }
      }
      return { zhLength, enLength }
    },
  },
}
</script>
