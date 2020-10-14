<template>
  <div class="g-game-content"
       ref="gGameContent">
    <h4 class="g-game-content__title">{{title}}</h4>
    <draggable v-model="sort"
               :sort="!isSubmited"
               draggable=".g-game-content__dragula">
      <transition-group>
        <div v-for="(item) in sort"
             :key="item.i"
             class="g-game-content__dragula"
             onselectstart="return false">
          <span class="g-game-content__index"
                onselectstart="return false">{{item.i}}</span>
          <span class="g-game-content__text"
                onselectstart="return false"
                :title="item.name">{{item.name}}</span>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    isSubmited: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      // sort: []
    }
  },
  computed: {
    sort: {
      get () { return this.data },
      set (val) {
        this.$emit('update', val)
      },
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss">
.g-game-content {
  padding: 20px;
  &::after {
    content: "";
    display: block;
    clear: both;
  }
  &__title {
    height: 5rem;
    font-size: 1.8rem;
    color: #012d5f;
  }
  &__dragula {
    margin: 10px;
    width: 17rem;
    cursor: pointer;
    float: left;
    min-height: 12rem;
    position: relative;
    background: #fff;
    border-radius: 4px;
    box-shadow: 1px 1px 2px 0 #aaa;
    &:hover {
      box-shadow: 2px 2px 5px 1px #aaa;
    }
  }
  &__index {
    display: inline-block;
    border: 1px solid #ccc;
    background: #efefef;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    line-height: 20px;
    text-align: center;
    margin: 10px;
  }
  &__text {
    display: block;
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    padding: 10px;

    max-height: 6rem;
    overflow: auto;
  }
}
</style>