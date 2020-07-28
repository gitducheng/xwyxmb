<template>
  <div class="g-input"
       tabindex="1"
       :class="{'g-input__completed':isCompleted,'g-input__content-focus':isFocus}">
    <span class="el-icon-error g-input__close"
          @click="removeItem"></span>
    <input class="g-input__input"
           :size="dataSize"
           :placeholder="placeholder"
           v-model="data"
           maxlength="6"
           @blur="onBlur"
           @keyup.enter="onEnter"
           @focus="onFocus" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isCompleted: false,
      isFocus: false
    }
  },
  computed: {
    data: {
      get () { return this.value },
      set (val) { this.$emit('input', val.replace(' ', '')) },
    },
    dataSize () {
      if (!this.data) { return this.placeholder.length * 2 + 2 }
      let size = 0
      this.data.split('').forEach(item => {
        size = item.charCodeAt() > 255 ? size + 2 : size + 1
      })
      return size + 4
    }
  },
  watch: {
    data: {
      handler (val) {
        if (!val) {
          this.isCompleted = false
        }
        if (val && !this.isFocus) { this.isCompleted = true }
      },
      immediate: true
    }
  },
  methods: {
    onFocus () {
      this.isFocus = true
      this.$emit('onFocus', this.index)
    },
    onBlur () {
      this.isFocus = false
      if (this.data) { this.isCompleted = true }
      this.$emit('onBlur', this.index)
    },
    onEnter (e) {
      let inputArr = document.querySelectorAll('.g-config__similar .g-input__input')
      const target = inputArr[this.index + 1]
      if (target) { target.focus() } else {
        inputArr[this.index].blur()
      }

    },
    removeItem () { this.$emit('removeItem', this.index) },
  }
}
</script>

<style lang="scss">
.g-input {
  display: inline-block;
  position: relative;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  font-size: inherit;
  outline: 0;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  height: 30px;
  line-height: 26px;
  min-width: 100px;
  padding: 0 10px;
  &:hover {
    border-color: #c0c4cc;
  }
  &__content-focus {
    border-color: #409eff !important;
    outline: 0;
  }
}
.g-input__close {
  position: absolute;
  top: -8px;
  right: -6px;
  z-index: 5;
  color: #ccc;
  &:hover {
    color: #086fdc;
  }
}

.g-input__completed {
  text-align: center;
  & input {
    text-align: center;
    padding: 0 4px;
    background: #caf5d7;
  }
}
.g-input input {
  outline: none;
  border: none;
  height: 24px;
  line-height: 24px;
  display: inline-block;
  padding: 0 4px;
  text-align: center;
}
.g-input input:hover,
.g-input input:focus,
.g-input input:active {
  outline: none;
  border: none;
}
</style>