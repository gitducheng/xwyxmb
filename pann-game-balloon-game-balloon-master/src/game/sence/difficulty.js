import Hilo from 'hilojs'
import { fontFamily } from '../utils/constants'

const DifficultyScene = Hilo.Class.create({
  Extends: Hilo.Container,
  constructor(properties) {
    DifficultyScene.superclass.constructor.call(this, properties)
    this.init(properties)
  },

  init({ assets, config }) {
    // { id: 'star', src: 'images/star.png' },
    // { id: 'star-gray', src: 'images/star-gray.png' },
    // 背景
    const bg = new Hilo.Bitmap({
      image: assets.getContent('difficulty-bg'),
    })

    // 主题
    const subjectText = new Hilo.Text({
      font: 'bold 60px ' + fontFamily,
      text: config.subject,
      textAlign: 'center',
      color: '#ffffff',
      lineSpacing: 0,
      maxWidth: 500,
      width: 500,
      height: 60,
    })

    // 时长
    const durationText = new Hilo.Text({
      font: `bold 28px ${fontFamily}`,
      text: `游戏时长：${config.duration} 秒`,
      textAlign: 'center',
      color: '#755858',
      lineSpacing: 0,
      maxWidth: 600,
      width: 600,
      height: 60,
    })

    // 难度
    const difficultyLabelText = new Hilo.Text({
      font: `bold 40px ${fontFamily}`,
      text: '游戏难度：',
      color: '#755858',
      lineSpacing: 0,
      width: 200,
      height: 60,
    })
    const difficultyStars = []
    for (let i = 1; i <= 3; i++) {
      const bright = i <= config.difficulty
      difficultyStars.push(new Hilo.Bitmap({
        id: bright ? `star-${i}` : `star-gray-${i}`,
        image: assets.getContent(bright ? 'star' : 'star-gray'),
      }))
    }

    // 开始游戏
    const startButton = new Hilo.Bitmap({
      image: assets.getContent('button-bg'),
    })
    const startButtonText = new Hilo.Text({
      font: '40px ' + fontFamily,
      text: '开始游戏',
      color: '#ffffff',
      lineSpacing: 0,
      width: 160,
      height: 40,
    })

    // 背景位置
    bg.x = 560
    bg.y = 160

    // 主题
    subjectText.x = bg.x + 146
    subjectText.y = bg.y + 64

    // 时长
    durationText.x = bg.x + (bg.width / 2 - durationText.width / 2)
    durationText.y = subjectText.y + subjectText.height + 140

    // 难度
    difficultyLabelText.x = bg.x + 130
    difficultyLabelText.y = durationText.y + 100
    difficultyStars.forEach((star, index) => {
      // 切图没切好，亮、暗星星宽度不一致，所以用55指代星星宽度，本该是 star.width
      star.x = bg.x + 350 + (55 + 30) * index
      star.y = durationText.y + 90
    })

    // 开始按钮
    startButton.x = bg.x + (bg.width / 2 - startButton.width / 2)
    startButton.y = bg.y + bg.height + 97 // offset by bg
    startButtonText.x = startButton.x + 60
    startButtonText.y = startButton.y + 18

    // 事件
    startButton.on(Hilo.event.POINTER_START, () => {
      this.fire('start')
    })
    startButtonText.on(Hilo.event.POINTER_START, () => {
      this.fire('start')
    })

    this.addChild(
      bg,
      subjectText,
      durationText,
      startButton,
      startButtonText,
      difficultyLabelText,
      ...difficultyStars,
    )
  },

  hide() {
    this.visible = false
  },

  show() {
    this.visible = true
  },
})

export default DifficultyScene
