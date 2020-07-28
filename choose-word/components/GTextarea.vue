<template>
  <div class="g-textarea"
       id="g-textarea"
       :class="{'g-textarea__content-focus':isFocus}"
       @focus="onFocus"
       @blur="onBlur"
       contentEditable
       tabindex="0"
       :value="data"
       @input="onChange">
    <span v-if="!isFocus && !data.length && !space.length"
          class="g-textarea__placeholder">点击输入题目内容</span>
    <!-- <span>&nbsp;</span> -->
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    space: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isFocus: false,
    }
  },
  computed: {
    data: {
      get () { return this.value },
      set (val) {
        this.$emit('input', val.replace(' ', ''))
      },
    }
  },
  methods: {
    onFocus () {
      this.isFocus = true
      this.$emit('onFocus')

    },
    onBlur () {
      this.isFocus = false
      this.$emit('onBlur')
    },
    onChange (e) {
      this.data = e.target.textContent
      this.$emit('onChage')
    },
  }

}
</script>

<style lang="scss">
.g-textarea {
  width: 100%;
  height: 100%;

  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  outline: 0;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  padding: 10px;

  &:hover {
    border-color: #c0c4cc;
  }
  &__content-focus {
    border-color: #409eff !important;
    outline: 0;
  }

  &__placeholder {
    color: #5f6c65;
    font-size: 16px;
  }
}
</style>