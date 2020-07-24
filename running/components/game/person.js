import Hilo from 'hilojs'
import Ports from './ports.js'
import Mask from './mask'
export default class Person extends Hilo.Container {
  constructor(properties) {
    super(properties)
    this.initCenter(properties)

    this.initPao(properties)
  }
  startY = 300
  _tool = {}
  p1 = null
  p2 = null
  _p1Step = 0
  _p2Step = 0
  _state = 'ready' // 'playing' | 'end' | 'pause'
  get state() {
    return this._state
  }
  set state(val) {
    if (val === this._state) return
    this._state = val
    if (val === 'ready') {
      this.p1.ready()
      this.p2.ready()
      this._tool.dimian.stop()
      this.paodao && this.paodao.restQuick()

      this._tool.dimian.isStart = false
      this.p2Step = 0
      this.p1Step = 0
    }
    if (val === 'pause') {
      this.p1.stop()
      this.p2.stop()
      this._tool.dimian.pause()
    }
    if (val === 'playing') {
      this.p1.play()
      this.p2.play()
      if (this._tool.dimian.isStart) {
        this._tool.dimian.resume()
      } else {
        this._tool.dimian.start()
      }
    }

    if (val === 'end') {
      if (this.p1Step === this.p2Step) {
        this.p1.state = 'xiao'
        this.p2.state = 'xiao'
        return
      }
      if (this.p1Step > this.p2Step) {
        this.p1.state = 'xiao'
        this.p2.state = 'ku'
        return
      }
      if (this.p1Step < this.p2Step) {
        this.p1.state = 'ku'
        this.p2.state = 'xiao'
        return
      }
    }
  }
  get p1Step() {
    return this._p1Step
  }
  get p2Step() {
    return this._p2Step
  }
  set p1Step(val) {
    this._p1Step = val
    Hilo.Tween.to(this.p1, { y: val + this.startY }, { duration: 400 })
  }
  set p2Step(val) {
    this._p2Step = val
    Hilo.Tween.to(this.p2, { y: val + this.startY }, { duration: 400 })
  }
  maskPao = null
  initPao(properties) {
    const { source } = properties

    this.maskPao = new Mask({
      x: 0,
      y: 0,
      background: 'rgba(0,0,0,0.5)',
      width: this.width,
      height: this.height,
      source: source,
      visible: true
    }).addTo(this)
    const paoSource = source['game-p1-paobu']
    this.p1 = new Ports({
      source,
      interval: 1,
      scaleX: 0.7,
      scaleY: 0.7,
      x: 80 + 30,
      y: this.startY
    }).stop()

    this.p1.addTo(this)
    this.p2 = new Ports({
      source,
      p: 'game-p2',
      scaleX: 0.7,
      scaleY: 0.7,
      interval: 1,
      x: this.width - paoSource['正常跑1.png'].width - 80 + 60,
      y: this.startY
    }).stop()

    this.p2.addTo(this)
  }
  initCenter(properties) {
    const source = properties.source['game-paodao']
    const width = this.width
    const paodao = new Hilo.Container({
      x: 0,
      y: 0,
      width: width,
      height: this.height * 2,
      visible: true
    })
    paodao.addTo(this)
    const buchangArr = new Array(
      Math.floor(paodao.height / source['跑道.png'].height)
    )
    for (let index = 0; index < buchangArr.length; index++) {
      buchangArr[index] = 1
    }
    buchangArr.reduce((pre) => {
      return new Hilo.Bitmap({
        x: 0,
        y: pre ? pre.y + pre.height : 0,
        image: source['跑道.png'].image,
        rect: source['跑道.png'].rect,
        scaleX: width / source['跑道.png'].width,
        visible: true
      }).addTo(paodao)
    }, null)
    const qidian = new Hilo.Bitmap({
      x: 0,
      y: this.height / 2 - source['起跑线.png'].height,
      image: source['起跑线.png'].image,
      rect: source['起跑线.png'].rect,
      scaleX: width / source['起跑线.png'].width,
      visible: true
    }).addTo(paodao)

    const zhongdian = new Hilo.Bitmap({
      x: 0,
      //   x: 0,
      y: this.height - source['终点线.png'].height,
      image: source['终点线.png'].image,
      rect: source['终点线.png'].rect,
      scaleX: width / source['终点线.png'].width,
      visible: false
    }).addTo(this)

    paodao.restQuick = () => {
      paodao.y = 0
      qidian.y = this.height / 2 - source['起跑线.png'].height
      qidian.visible = true
      zhongdian.y = paodao.height - source['终点线.png'].height
      zhongdian.visible = false
    }

    this.paodao = paodao
    const dimian = Hilo.Tween.to(
      paodao,
      {
        y: -this.height
      },
      {
        duration: (this.height / 60) * 400,
        loop: true,
        onComplete: () => {},
        onUpdate: (r, t) => {
          if (this._state === 'end') {
            dimian.stop()
            zhongdian.y = this.height
            zhongdian.visible = true
            Hilo.Tween.to(
              zhongdian,
              { y: this.p1.y > this.p2.y ? this.p1.y : this.p2.y },
              { duration: 2000 }
            )
            Hilo.Tween.to(this.p1, { y: this.height }, { duration: 2000 })
            Hilo.Tween.to(
              this.p2,
              { y: this.height },
              {
                duration: 2000,
                onComplete: () => {
                  this.onEnd && this.onEnd()
                }
              }
            )
          }

          // if (zhongdian.y <= 0 && this._state === 'end') {
          //   dimian.stop()

          // }
          if (Math.abs(paodao.y) > qidian.y + qidian.height) {
            qidian.visible = false
          }
        }
      }
    ).stop()
    this._tool.dimian = dimian

    //起点
  }
}
