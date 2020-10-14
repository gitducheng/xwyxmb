import Hilo from 'hilojs'
import { fontFamily } from '../utils/constants'

const ScoreCard = Hilo.Class.create({
  Extends: Hilo.Container,
  constructor(properties) {
    ScoreCard.superclass.constructor.call(this, properties)
    this.init(properties)
  },

  // 得分
  score: null,

  init({ assets, avatarImg, name }) {
    new Hilo.Bitmap({
      id: 'score-bg',
      image: assets.getContent('score-bg'),
    }).addTo(this)

    const winHeader = new Hilo.Bitmap({
      id: 'win-header',
      image: assets.getContent('score-win-header'),
      visible: false,
      onUpdate: function () {
        if (this.parent.score) {
          this.visible = this.parent.score.result === 'win'
        }
      },
    }).addTo(this)

    const drawHeader = new Hilo.Bitmap({
      id: 'draw-header',
      image: assets.getContent('score-draw-header'),
      visible: false,
      onUpdate: function () {
        if (this.parent.score) {
          this.visible = this.parent.score.result === 'draw'
        }
      },
    }).addTo(this)

    const failedHeader = new Hilo.Bitmap({
      id: 'failed-header',
      image: assets.getContent('score-failed-header'),
      visible: true,
      onUpdate: function () {
        if (this.parent.score) {
          this.visible = this.parent.score.result === 'failed'
        }
      },
    }).addTo(this)

    const avatar = new Hilo.Bitmap({
      id: 'avatar',
      image: avatarImg,
    }).addTo(this)

    const nameText = new Hilo.Text({
      font: 'bold 26px ' + fontFamily,
      text: name,
      textAlign: 'center',
      color: '#755858',
      lineSpacing: 0,
      width: 80,
      height: 60,
    }).addTo(this)

    const countBg = new Hilo.Bitmap({
      id: 'count-bg',
      image: assets.getContent('score-count-bg'),
    }).addTo(this)

    const countText = new Hilo.Text({
      font: 'bold 34px ' + fontFamily,
      text: '分数：',
      textAlign: 'center',
      color: '#755858',
      lineSpacing: 0,
      maxWidth: 350,
      width: 350,
      height: 59,
      onUpdate: function () {
        if (this.parent.score) {
          this.text = `分数：${this.parent.score.score}`
        }
      },
    }).addTo(this)

    const star = new Hilo.Bitmap({
      id: 'count-star',
      image: assets.getContent('score-star'),
    }).addTo(this)

    const scoreSummaryBg = new Hilo.Bitmap({
      id: 'score-summary-bg',
      image: assets.getContent('score-summary-bg'),
    }).addTo(this)

    const summaryText1 = new Hilo.Text({
      font: 'bold 34px ' + fontFamily,
      text: '答错题目：',
      textAlign: 'center',
      color: '#755858',
      lineSpacing: 0,
      maxWidth: scoreSummaryBg.width,
      width: scoreSummaryBg.width,
      height: 64,
      onUpdate: function () {
        if (this.parent.score) {
          this.text = `答错题目：${this.parent.score.errorCount}`
        }
      },
    }).addTo(this)

    const summaryText2 = new Hilo.Text({
      font: 'bold 34px ' + fontFamily,
      text: '答对题目：',
      textAlign: 'center',
      color: '#755858',
      lineSpacing: 0,
      maxWidth: scoreSummaryBg.width,
      width: scoreSummaryBg.width,
      height: 64,
      onUpdate: function () {
        if (this.parent.score) {
          this.text = `答对题目：${this.parent.score.correctCount}`
        }
      },
    }).addTo(this)

    const summaryText3 = new Hilo.Text({
      font: 'bold 34px ' + fontFamily,
      text: '最高连击：',
      textAlign: 'center',
      color: '#755858',
      lineSpacing: 0,
      maxWidth: scoreSummaryBg.width,
      width: scoreSummaryBg.width,
      height: 64,
      onUpdate: function () {
        if (this.parent.score) {
          this.text = `最高连击：${this.parent.score.maxCombo}`
        }
      },
    }).addTo(this)

    winHeader.x = 68
    winHeader.y = -220
    drawHeader.x = 68
    drawHeader.y = -186
    failedHeader.x = 68
    failedHeader.y = -failedHeader.height / 2

    avatar.x = 240
    avatar.y = 74

    nameText.x = avatar.x + 30
    nameText.y = avatar.y + avatar.height + 10

    countBg.x = 128
    countBg.y = nameText.y + nameText.height
    countText.x = countBg.x
    countText.y = countBg.y + 16

    star.x = 120
    star.y = countBg.y - 16

    scoreSummaryBg.x = 59
    scoreSummaryBg.y = countBg.y + countBg.height + 25

    summaryText1.x = summaryText2.x = summaryText3.x = scoreSummaryBg.x
    summaryText1.y = scoreSummaryBg.y + 30
    summaryText2.y = summaryText1.y + summaryText1.height
    summaryText3.y = summaryText2.y + summaryText2.height
  },

  /**
   * 设置分数
   * @param score
   */
  setScore(score) {
    this.score = score
  },
})

export default ScoreCard
