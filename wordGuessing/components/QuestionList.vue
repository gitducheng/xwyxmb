<template>
  <div type="flex"
       class="g-question-list">
    <div class="g-question-list__content"
         v-for="(item,index) in data"
         :key="index">
      <i class="el-icon-error g-question-list__remove"
         @click="remove(index)"
         :class="{'g-question-list__hide':data.length<2}"></i>
      <div class="g-question-list__item"
           onselectstart="return false"
           :class="{'g-question-list__item-active':activeIndex===index}"
           @click="select(index)">
        <i class="g-question-list__index">{{index+1}}</i>
        <i v-if="item.tag==='audio'"
           class="el-icon-video-play g-question-list__file-audio"></i>
        <component class="g-question-list__file"
                   v-if="item&&item.content"
                   :is="item.tag"
                   :src="item.content">{{item.content}}</component>
      </div>
    </div>
    <div v-if="data.length<5"
         class="g-question-list__button-col">
      <el-button type="text"
                 @click="add">
        <p class="g-question-list__item g-question-list__add">添加</p>
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      default: () => [],
      type: Array
    },
    activeIndex: {
      default: () => 0,
      type: Number
    }
  },
  data () {
    return {
    }
  },
  methods: {
    add () { this.$emit('add') },
    remove (index) {
      if (this.data.length <= 1) { return false }
      this.$emit('remove', index)
    },
    select (index) { this.$emit('select', index) }
  }
}
</script>

<style lang="scss">
.g-question-list {
  &__content {
    float: left;
    margin-right: 20px;
  }
  &__item {
    position: relative;
    width: 80px;
    height: 80px;
    overflow: hidden;
    border: 1px solid #ccc;
    padding: 1px;
    border-radius: 8px;
    font-size: 12px;
    color: #999;
    background: #fff;
    cursor: pointer;
  }
  &__item-active {
    border: 1px solid #1989fa;
  }
  &__file {
    overflow: hidden;
    width: 100%;
    height: 100%;
    object-fit: fill;
    cursor: pointer;
  }
  &__file-audio {
    font-size: 20px;
    &::before {
      display: inline-block;
      width: 60px;
      height: 40px;
      background-color: #efecec;
      border: 1px solid transparent;
      border-radius: 20px;
      margin-top: 15px;
      line-height: 40px;
    }
  }
  &__remove {
    position: relative;
    top: 8px;
    right: -42px;
    font-size: 18px;
    cursor: pointer;
    color: #ddd;
    z-index: 2;
    &:hover {
      color: #1989fa;
    }
  }
  &__button-col {
    float: left;
    padding-top: 18px;
    .el-button {
      padding: 0;
    }
  }
  &__add {
    line-height: 76px;
    &:hover {
      color: #409eff;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }
  &__index {
    width: 50px;
    height: 50px;
    border: 1px solid #ffc107;
    border-radius: 50%;
    background: #ffc107;
    position: absolute;
    bottom: -22px;
    left: -20px;
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    text-align: right;
    padding-right: 12px;
    z-index: 2;
  }
  &__hide {
    height: 16px;
    &::before {
      display: none;
    }
  }
}
</style>