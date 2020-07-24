import Hilo from 'hilojs'

export default class Ports extends Hilo.Container {
  constructor(properties) {
    super(properties)
    this.initPao(properties)
    this.initCheck(properties)
    this.initIsCheck(properties)
    this.ready()
  }
  _playState = 'ready' // 'playing' | 'stop'
  _state = 'pao' // 'xiao' | 'ku' | 'pao' | 'gongji' 'chuiji' | 'bingdong' | 'dianji'

  set playState(val) {
    this._playState = val

    if (val === 'ready') {
      this.state = 'pao'
    }

    if (val === 'stop') {
      this._activingPose && this._activingPose.stop()
    }
    if (val === 'playing') {
      this._activingPose && this._activingPose.play()
    }
  }
  get playState() {
    return this._playState
  }
  _activingPose = null
  get state() {
    return this._state
  }
  set state(val) {
    this._state = val

    // 遍历状态
    const { pose } = this
    for (const key in pose) {
      if (pose.hasOwnProperty(key)) {
        const element = pose[key]
        if (key === val) {
          element.visible = true
          element.play()
          this._activingPose = element
        } else {
          element.visible = false
          element.stop()
        }
      }
    }
  }
  pose = {
    // 奔跑状态
    pao: null,
    xiao: null,
    ku: null,
    gongji: null,
    // 挨揍状态
    chuiji: null,
    bingdong: null,
    dianji: null
  }
  play() {
    this.playState = 'playing'
    return this
  }
  stop() {
    this.playState = 'stop'
    return this
  }
  ready() {
    this.playState = 'ready'
    return this
  }
  initCheck(properties) {
    const { source } = properties
    const x = 105
    const y = -100
    this.check = new Hilo.Bitmap({
      ...source['game-paodao']['人物打勾对.png'],
      visible: false,
      x,
      y
    }).addTo(this)

    this.checkFalse = new Hilo.Bitmap({
      ...source['game-paodao']['人物打勾错.png'],
      visible: false,
      x,
      y
    }).addTo(this)
  }

  initIsCheck(properties) {
    const { source } = properties
    const x = 105 + source['game-paodao']['超时.png'].width / 4
    const y = -100
    this.chaoshi = new Hilo.Bitmap({
      ...source['game-paodao']['超时.png'],
      scaleX: 0.5,
      scaleY: 0.5,
      visible: false,
      x,
      y
    }).addTo(this)
  }
  onUpdate() {
    if (this.playState === 'ready') {
      const { pose } = this
      for (const key in pose) {
        if (pose.hasOwnProperty(key)) {
          const element = pose[key]
          element.stop()
        }
      }
    }
  }
  initPao(properties) {
    const { source, p = 'game-p1' } = properties
    const paoSource = source[`${p}-paobu`]

    const gongjiSource = source[`${p}-gongji`]
    const shandianSource = source[`${p}-shandian`]

    const paoFrame = {}
    paoFrame.pao = new Hilo.TextureAtlas({
      image: paoSource['正常跑1.png'].image,
      frames: [
        // 跑步
        paoSource['正常跑1.png'].rect,
        paoSource['正常跑2.png'].rect
      ],
      sprites: {
        pao: [0, 1]
      }
    })

    paoFrame.xiao = new Hilo.TextureAtlas({
      image: paoSource['开心1.png'].image,
      frames: [paoSource['开心1.png'].rect, paoSource['开心2.png'].rect],
      sprites: {
        xiao: [0, 1]
      }
    })

    paoFrame.ku = new Hilo.TextureAtlas({
      image: paoSource['伤心1.png'].image,
      frames: [paoSource['伤心1.png'].rect, paoSource['伤心2.png'].rect],
      sprites: {
        ku: [0, 1]
      }
    })
    //
    paoFrame.gongji = new Hilo.TextureAtlas({
      image: gongjiSource['攻击1.png'].image,
      frames: [
        gongjiSource['攻击1.png'].rect,
        gongjiSource['攻击2.png'].rect,
        gongjiSource['攻击3.png'].rect,
        gongjiSource['攻击4.png'].rect
      ],
      sprites: {
        gongji: [0, 1, 2, 3]
      }
    })
    //

    paoFrame.dianji = new Hilo.TextureAtlas({
      image: shandianSource['闪电1.png'].image,
      frames: [
        shandianSource['闪电1.png'].rect,
        shandianSource['闪电2.png'].rect
      ],
      sprites: {
        dianji: [0, 1]
      }
    })

    //
    paoFrame.bingdong = new Hilo.TextureAtlas({
      image: source[p]['冰冻.png'].image,
      frames: [source[p]['冰冻.png'].rect, source[p]['冰冻.png'].rect],
      sprites: {
        bingdong: [0, 1]
      }
    })

    paoFrame.chuiji = new Hilo.TextureAtlas({
      image: source[p]['锤晕.png'].image,
      frames: [source[p]['锤晕.png'].rect, source[p]['锤晕.png'].rect],
      sprites: {
        chuiji: [0, 1]
      }
    })

    const { pose } = this

    for (const key in pose) {
      if (pose.hasOwnProperty(key)) {
        pose[key] = new Hilo.Sprite({
          interval: 8,
          x: 0,
          y: 0,
          visible: false
        })
          .stop()
          .addFrame(paoFrame[key].getSprite(key))
          .addTo(this)
      }
    }
  }
}
