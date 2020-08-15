import Hilo from 'hilojs'
import { fontFamily } from '../utils/constants'

const PausedCard = Hilo.Class.create({
  Extends: Hilo.Container,
  constructor(properties) {
    PausedCard.superclass.constructor.call(this, properties)
    this.init(properties)
  },

  visible: false,

  init({ assets }) {
    new Hilo.Bitmap({
      id: 'paused-bg',
      image: assets.getContent('paused-bg'),
    }).addTo(this)

    const nameText = new Hilo.Text({
      font: 'bold 80px ' + fontFamily,
      text: '活动暂停',
      textAlign: 'center',
      color: '#584242',
      lineSpacing: 0,
      maxWidth: 682,
      width: 682,
      height: 60,
    }).addTo(this)

    const continueButton = new Hilo.Bitmap({
      id: 'continue',
      image: assets.getContent('paused-button-bg'),
    }).addTo(this)
    const continueButtonText = new Hilo.Text({
      font: 'bold 48px ' + fontFamily,
      text: '继续',
      textAlign: 'center',
      color: '#ffffff',
      lineSpacing: 0,
      width: 99,
      height: 45,
    }).addTo(this)

    const resetButton = new Hilo.Bitmap({
      id: 'reset',
      image: assets.getContent('paused-button-bg'),
    }).addTo(this)
    const resetButtonText = new Hilo.Text({
      font: 'bold 48px ' + fontFamily,
      text: '重置',
      textAlign: 'center',
      color: '#ffffff',
      lineSpacing: 0,
      width: 99,
      height: 45,
    }).addTo(this)

    nameText.y = 50

    continueButton.x = 85
    continueButton.y = 216
    continueButtonText.x = continueButton.x + 50
    continueButtonText.y = continueButton.y + 25

    resetButton.x = 411
    resetButton.y = 216
    resetButtonText.x = resetButton.x + 50
    resetButtonText.y = resetButton.y + 25

    // 事件
    continueButton.on(Hilo.event.POINTER_START, () => {
      this.fire('continue')
      this.visible = false
    })
    continueButtonText.on(Hilo.event.POINTER_START, () => {
      this.fire('continue')
      this.visible = false
    })

    resetButton.on(Hilo.event.POINTER_START, () => {
      this.fire('reset')
      this.visible = false
    })
    resetButtonText.on(Hilo.event.POINTER_START, () => {
      this.fire('reset')
      this.visible = false
    })
  },

  show(score) {
    this.visible = true
  },
})

export default PausedCard
