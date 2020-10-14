<template>
  <div class="container"
       ref="root">
  </div>
</template>

<script>
import InitGame from "~/assets/game"
export default {
  data() {
    return {
      chooseWordData: null,
    }
  },
  async mounted() {
    await this.getConfigData()
    if(!this.chooseWordData) {this.$router.replace('/config')}
    new InitGame({container: this.$refs.root,configData: this.chooseWordData})
  },
  methods: {
    async getConfigData() {
      try {
        const result=await this.$testload()
        if(typeof result==='string') {
          this.chooseWordData=JSON.parse(result||null)
        }
      } catch(error) {
        this.chooseWordData=JSON.parse(localStorage.getItem('chooseWordData')||null)
      }
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
