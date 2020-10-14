import Hilo from 'hilojs'
import ScoreCard from '../components/score-card'
import { fontFamily, gameHeight, gameWidth } from '../utils/constants'

const ScoreScene = Hilo.Class.create({
  Extends: Hilo.Container,
  constructor(properties) {
    ScoreScene.superclass.constructor.call(this, properties)
    this.properties = properties
    this.init(properties)
  },

  properties: null,
  leftCard: null,
  rightCard: null,

  init({ assets }) {
    this.leftCard = new ScoreCard({
      id: 'orangeCard',
      assets,
      avatarImg: assets.getContent('score-orange-avatar'),
      name: '布丁',
    }).addTo(this)
    this.rightCard = new ScoreCard({
      id: 'greenCard',
      assets,
      avatarImg: assets.getContent('score-green-avatar'),
      name: '豆豆',
    }).addTo(this)

    const answerBtnBg = new Hilo.Bitmap({
      id: 'answer-button-bg',
      image: assets.getContent('score-button-bg'),
    }).addTo(this)
    const answerBtnText = new Hilo.Text({
      font: 'bold 40px ' + fontFamily,
      text: '查看答案',
      textAlign: 'center',
      color: '#ffffff',
      lineSpacing: 0,
      maxWidth: 278,
      width: 278,
      height: 80,
    }).addTo(this)

    const startBtnBg = new Hilo.Bitmap({
      id: 'start-button-bg',
      image: assets.getContent('score-button-bg'),
    }).addTo(this)
    const startBtnText = new Hilo.Text({
      font: 'bold 40px ' + fontFamily,
      text: '重新开始',
      textAlign: 'center',
      color: '#ffffff',
      lineSpacing: 0,
      maxWidth: 278,
      width: 278,
      height: 80,
    }).addTo(this)

    this.leftCard.x = 229
    this.leftCard.y = 224

    this.rightCard.x = gameWidth / 2 + 154
    this.rightCard.y = 224

    answerBtnBg.x = 588
    answerBtnBg.y = gameHeight - answerBtnBg.height - 86
    answerBtnText.x = answerBtnBg.x + 6
    answerBtnText.y = answerBtnBg.y + 18

    startBtnBg.x = gameWidth / 2 + 100
    startBtnBg.y = answerBtnBg.y
    startBtnText.x = startBtnBg.x + 6
    startBtnText.y = startBtnBg.y + 18

    // 按钮事件
    answerBtnBg.on(Hilo.event.POINTER_START, () => {
      this.fire('check-answer')
    })
    answerBtnText.on(Hilo.event.POINTER_START, () => {
      this.fire('check-answer')
    })

    startBtnBg.on(Hilo.event.POINTER_START, () => {
      this.fire('restart')
    })
    startBtnText.on(Hilo.event.POINTER_START, () => {
      this.fire('restart')
    })
  },

  hide() {
    this.score = null
    this.visible = false
  },

  show(
    {
      leftScore,
      leftCorrectCount,
      leftErrorCount,
      leftMaxCombo,
      rightScore,
      rightCorrectCount,
      rightErrorCount,
      rightMaxCombo,
    },
  ) {
    // leftScore: 0, // 左边得分
    // leftCorrectCount: 0, // 左边累计答对次数
    // leftErrorCount: 0, // 左边累计答错次数
    // leftCombo: 0, // 左边连击次数
    // leftMaxCombo: 0, // 左边最高连击次数
    //
    // rightScore: 0, // 右边得分
    // rightCorrectCount: 0, // 右边累计答对次数
    // rightErrorCount: 0, // 右边累计答错次数
    // rightCombo: 0, // 右边连击次数
    // rightMaxCombo: 0, // 右边最高连击次数
    this.leftCard.setScore({
      result: leftScore > rightScore ? 'win' : leftScore < rightScore ? 'failed' : 'draw',
      score: leftScore,
      correctCount: leftCorrectCount,
      errorCount: leftErrorCount,
      maxCombo: leftMaxCombo,
    })
    this.rightCard.setScore({
      result: rightScore > leftScore ? 'win' : rightScore < leftScore ? 'failed' : 'draw',
      score: rightScore,
      correctCount: rightCorrectCount,
      errorCount: rightErrorCount,
      maxCombo: rightMaxCombo,
    })
    this.visible = true
  },
})

export default ScoreScene
