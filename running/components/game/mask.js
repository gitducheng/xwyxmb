import Hilo from 'hilojs'

export default class Mask extends Hilo.Container {
  constructor(properties) {
    super(properties)
    this.alpha = 0
    this.initGeo(properties)
  }
  async maskShow() {
    this.visible = true
    return new Promise((re) => {
      Hilo.Tween.to(
        this,
        { alpha: 1 },
        {
          duration: 700,
          onComplete: () => {
            re()
          }
        }
      )
    })
  }
  async showShandian(arrow) {
    this.maskShow()
    const target = arrow ? this.shandianLeft : this.shandianRight
    target.visible = true
    Hilo.Tween.to(
      target,
      { alpha: 0 },
      {
        duration: 300,
        repeat: 2,
        onComplete: () => {
          target.visible = false
          target.alpha = 1
          this.hideMask()
        }
      }
    )
  }
  hideMask() {
    Hilo.Tween.to(
      this,
      { alpha: 0 },
      {
        duration: 700,
        onComplete: () => {
          this.visible = false
        }
      }
    )
  }
  async shaowChuizi(arrow) {
    this.maskShow()
    const target = arrow ? this.chuiziLeft : this.chuiziRight
    target.visible = true
    Hilo.Tween.to(
      target,
      { rotation: arrow ? -60 : 60 },
      {
        duration: 700,
        repeat: 3,
        onComplete: () => {
          target.visible = false
          target.rotation = 0
          this.hideMask()
        }
      }
    )
  }
  initGeo(properties) {
    const { source } = properties

    this.shandianLeft = new Hilo.Bitmap({
      x: 400,
      y: 0,
      ...source['game-paodao']['左闪电.png'],
      visible: false
    }).addTo(this)

    this.shandianRight = new Hilo.Bitmap({
      x: this.width - 400 - source['game-paodao']['右闪电.png'].width,
      y: 0,
      ...source['game-paodao']['右闪电.png'],
      visible: false
    }).addTo(this)

    this.chuiziLeft = new Hilo.Bitmap({
      x: -100 + source['game-paodao']['左锤子.png'].width - 350,
      y: 80 + source['game-paodao']['左锤子.png'].height - 150,
      ...source['game-paodao']['左锤子.png'],

      pivotY: source['game-paodao']['左锤子.png'].height - 150,
      pivotX: source['game-paodao']['左锤子.png'].width - 350,
      rotation: 0,
      visible: false
    }).addTo(this)
    this.chuiziRight = new Hilo.Bitmap({
      x: this.width - -40 - source['game-paodao']['右锤子.png'].width + 350,
      y: 80 + 150,
      pivotY: 150,
      pivotX: 350,
      rotation: 0,
      ...source['game-paodao']['右锤子.png'],
      visible: false
    }).addTo(this)
  }
}
