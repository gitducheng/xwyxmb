<style scoped></style>
<template>
  <div>
    <div class="container" ref="container"></div>
    <Answer
      ref="answerModal"
      @handleBegin="handleBegin"
      @handleBack="handleBack"
    />
    <Result
      ref="resultModal"
      @handleBegin="handleBegin"
      @handleAnswer="handleAnswer"
    />
  </div>
</template>

<script>
import AssetsFectory from '~/components/game/lib/Asset'
import StageFectory from '~/components/game/stage'
import ExportScence from '~/components/game/exportScence'
import Persons from '~/components/game/person'
import Panel from '~/components/game/panel'
import Answer from './components/Answer.vue'
import Result from './components/result.vue'
export default {
  methods: {
    handleBack() {
      this.$refs['resultModal'].visible = true
    },
    handleBegin() {
      this.panel && (this.panel.state = 'ready')
    },
    handleAnswer() {
      if (this.questions) {
        this.$refs['answerModal'].init(this.questions, true, this.resAnw)
      }
    }
  },
  data() {
    return {
      resAnw: null
    }
  },
  components: {
    Answer,
    Result
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

    if (!configData) return this.$router.replace('/config')

    let questions = configData
    this.questions = questions

    // const  // 接入hilo动画引擎
    const Assets = AssetsFectory()
    const assets = new Assets()
    assets.on('load', (e) => {
      const num =
        +(e.target.queue.getLoaded() / e.target.queue.getTotal()).toFixed(2) *
        50
      // console.log(num)
    })
    const {
      spsource: { layout }
    } = await assets.load()

    const gameMain = StageFectory()
    this.$refs['container'].appendChild(gameMain.stage.canvas)
    const { stage, ticker } = gameMain
    const exportScence = new ExportScence({
      x: 0,
      y: 0,
      questions,
      backgroundPos: layout['game-stop']['游戏预览.png'],
      visible: true
    })
    // 插入计分板

    const panel = new Panel({
      x: 0,
      y: 0,
      width: stage.width,
      height: stage.height,
      second: questions.second,
      questions: [...questions.data],
      source: layout,
      visible: true
    })
    // 人物模型
    const person = new Persons({
      x: layout['game-panel']['左侧背景.png'].width,
      y: 0,
      background: 'rgba(0,0,0,0.5)',
      width: stage.width - 2 * layout['game-panel']['左侧背景.png'].width,
      height: stage.height,
      source: layout
    }).addTo(stage)

    stage.addChild(panel)

    // 游戏状态注册
    panel.onReady = () => {
      person.state = 'ready'
      exportScence.visible = true
      ticker._paused && ticker.resume()
    }
    panel.onPlaying = () => {
      person.state = 'playing'
    }
    panel.onPause = () => {
      person.state = 'pause'
      ticker.pause()
    }
    panel.onChaoshi = (index, visible) => {
      if (index === 0) {
        person.p1.chaoshi.visible =
          person.p1.check.visible || person.p1.checkFalse.visible
            ? false
            : visible
      } else {
        person.p2.chaoshi.visible =
          person.p2.check.visible || person.p2.checkFalse.visible
            ? false
            : visible
      }
    }
    panel.onTi = (p1, p2) => {
      if (typeof p1 === 'boolean' || typeof p2 === 'boolean') {
        person.p1.check.visible = p1
        person.p1.checkFalse.visible = !p1
        person.p2.check.visible = p2
        person.p2.checkFalse.visible = !p2
      } else {
        person.p1.check.visible = false
        person.p1.checkFalse.visible = false
        person.p2.check.visible = false
        person.p2.checkFalse.visible = false
      }
    }
    let resRow = null
    panel.onEnd = (row) => {
      const [p1, p2] = row
      const p1result = {
        success: p1.filter((item) => item.isCood),
        error: p1.filter((item) => !item.isCood)
      }
      const p2result = {
        success: p2.filter((item) => item.isCood),
        error: p2.filter((item) => !item.isCood)
      }
      resRow = { p1result, p2result }
      this.resAnw = resRow
      person.state = 'end'
    }
    person.onEnd = () => {
      this.$refs['resultModal'] && this.$refs['resultModal'].init(resRow, true)
      // panel.state = 'ready'
      // exportScence.visible = true
    }

    // 惩罚数组
    const chengfa = async function(ku, xiao, isR) {
      const arr = ['dianji', 'chuiji', 'bingdong']
      const str = arr[Math.floor(Math.random() * 3)]
      ku.state = 'ku'
      xiao.state = 'gongji'
      if (str === 'dianji') {
        person.maskPao.showShandian(isR)
      }
      if (str === 'chuiji') {
        person.maskPao.shaowChuizi(!isR)
      }
      await new Promise((re) => setTimeout(re, 700))
      ku.state = str
      xiao.state = 'xiao'
    }
    panel.onCheck = async (mut1, mut2) => {
      if (mut1 && mut2) {
        person.p1.state = 'xiao'
        person.p2.state = 'xiao'
        await new Promise((re) => setTimeout(re, 3000))
        person.p1.state = 'pao'
        person.p2.state = 'pao'
        return
      }
      if (!mut1 && !mut2) {
        person.p1.state = 'ku'
        person.p2.state = 'ku'

        await Promise.all([
          new Promise((re) => {
            const cacheY = person.p1.y
            const target = person.p1
            Hilo.Tween.to(
              target,
              { y: -600 },
              {
                duration: 3000,
                onComplete: () => {
                  target.state = 'pao'
                  Hilo.Tween.to(
                    target,
                    { y: cacheY },
                    {
                      delay: 500,
                      duration: 1000,
                      onComplete: re
                    }
                  )
                }
              }
            )
          }),
          new Promise((re) => {
            const cacheY = person.p2.y
            const target = person.p2

            Hilo.Tween.to(
              target,
              { y: -600 },
              {
                duration: 3000,
                onComplete: () => {
                  target.state = 'pao'
                  Hilo.Tween.to(
                    target,
                    { y: cacheY },
                    {
                      delay: 500,
                      duration: 1000,
                      onComplete: re
                    }
                  )
                }
              }
            )
          })
        ])

        return
      }
      if (mut1) {
        await chengfa(person.p2, person.p1, true)

        person.p1Step += 50
        person.p2Step -= 50
        await new Promise((re) => {
          const cacheY = person.p2.y
          const target = person.p2

          Hilo.Tween.to(
            target,
            { y: -600 },
            {
              duration: 4000,
              onComplete: () => {
                target.state = 'pao'
                Hilo.Tween.to(
                  target,
                  { y: cacheY },
                  {
                    delay: 500,
                    duration: 1000,
                    onComplete: re
                  }
                )
              }
            }
          )
        })
        person.p2.state = 'pao'
        person.p1.state = 'pao'
      } else {
        await chengfa(person.p1, person.p2, false)

        person.p2Step += 50
        person.p1Step -= 50
        await new Promise((re) => {
          const cacheY = person.p1.y
          const target = person.p1
          Hilo.Tween.to(
            target,
            { y: -600 },
            {
              duration: 4000,
              onComplete: () => {
                target.state = 'pao'
                Hilo.Tween.to(
                  target,
                  { y: cacheY },
                  {
                    delay: 500,
                    duration: 1000,
                    onComplete: re
                  }
                )
              }
            }
          )
        })
        person.p1.state = 'pao'
        person.p2.state = 'pao'
      }
    }

    // 插入预览导出图片
    exportScence.onStart = () => {
      panel.state = 'playing'
    }
    stage.addChild(exportScence)
    panel.state = 'ready'
    this.panel = panel
  }
}
</script>
