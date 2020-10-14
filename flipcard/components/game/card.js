import Hilo from 'hilojs'
import Text from './text'
export default class Card extends Hilo.Container {
  constructor (properties) {
    super(properties)
    const {
      x = 0, y = 0, backgroundPos = {}, questions = {}
    } = properties || {}

    this.backgroundPos = backgroundPos
    this.questions = questions

    this.x = x
    this.y = y
    this.width = 306
    this.height = 316
    this.circleRadius = 115
    this.circlePointX = (this.width - this.circleRadius * 2) / 2
    this.circlePointY = (this.height - this.circleRadius * 2) / 2 - 4

    this.initFront(properties)
    this.initBack()
  }

  circleBj (properties) {
    return new Hilo.Bitmap({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      image: this.backgroundPos.image,
      // background: '#999999',
      visible: true
    })
  }

  // 正面
  initFront () {
    const _this = this
    const front = new Hilo.Container({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      // background: '#999999',
      visible: true,
    }).addTo(this)

    // 如果有图片绘制图片 否则绘制文字
    const {
      zhengText = '', zhengImg = ''
    } = this.questions
    if (zhengText) {
      this.drawText(front, zhengText, '#ffd65d')
    } else {
      this.drawImg(front, zhengImg, '#ffd65d')
    }

    // 正面点击事件
    front.on(Hilo.event.POINTER_START, (e) => {
      this.toggleTween(front, this.back)
    })

    this.front = front
  }
  // 反面
  initBack () {
    const back = new Hilo.Container({
      x: this.width / 2,
      y: 0,
      scaleX: 0,
      scaleY: 1,
      width: this.width,
      height: this.height,
      visible: false,
      id: 'back'
    }).addTo(this)

    // 如果有图片绘制图片 否则绘制文字
    const {
      fanText = '', fanImg = ''
    } = this.questions
    if (fanText) {
      this.drawText(back, fanText)
    } else {
      this.drawImg(back, fanImg)
    }

    // 反面点击事件

    back.on(Hilo.event.POINTER_START, (e) => {
      this.toggleTween(back, this.front)
    })

    this.back = back
  }

  drawImg (parent, imgSrc, bjColor = '#58b8ff') {
    const _this = this
    const container = new Hilo.Container({
      x: _this.circlePointX,
      y: _this.circlePointY,
      width: _this.circleRadius * 2,
      height: _this.circleRadius * 2,
      visible: true,
    }).addTo(parent)
    const graphics = new Hilo.Graphics({
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      width: this.width,
      height: this.height,
      align: Hilo.align.CENTER,
      background: '#999999',
      visible: true
    })

    const imgBitmap = new Hilo.Bitmap({
      x: 0,
      y: 0,
      align: Hilo.align.CENTER,
      image: imgSrc || require('~/static/fanfanka/img/zheng.png'),
      visible: true
    })

    let scale = 1
    const img = new Image()
    img.src = imgSrc || require('~/static/fanfanka/img/zheng.png')
    img.onload = function () {
      const scale = Math.sqrt(Math.pow(img.width, 2) + Math.pow(img.height, 2)) / 300
      imgBitmap.width = img.width / scale
      imgBitmap.height = img.height / scale
    }

    graphics.beginFill(bjColor).drawCircle(_this.circlePointX, _this.circlePointY, _this.circleRadius).endFill().addTo(container)
    imgBitmap.addTo(container)
    _this.circleBj().addTo(parent)
  }

  drawText (parent, text = 'apple', bjColor = '#58b8ff') {
    const graphics = new Hilo.Graphics({
      width: this.width,
      height: this.height,
      x: 0,
      y: 0,
    })
    graphics.beginFill(bjColor).drawCircle(this.circlePointX, this.circlePointY, this.circleRadius).endFill().addTo(parent)

    let fontSize = (this.circleRadius * 2) / (text.length/2)
    if(fontSize>50){
      if(text.length>4){
        fontSize=50
      }else{
        fontSize=90
      }}
    new Text({
      text,
      fontSize,
      lineHeight: fontSize,
      bold: true,
      textAlign: 'center',
      textVAlign: 'middle',
      height: fontSize,
      reTextWidth: text.length > 4 ?this.circleRadius * 2 - fontSize * 2:this.circleRadius * 2,
      x: text.length > 4 ? this.circlePointX + fontSize : this.circlePointX,
      y: this.height / 2 - fontSize/2,
      color: '#00008b'
    }).addTo(parent)
    this.circleBj().addTo(parent)
  }

  // 切换动画效果
  toggleTween (targetObj, completeObj, duration = 300) {
    Hilo.Tween.to(
      targetObj, {
      scaleX: 0,
      x: this.width / 2
    }, {
      duration,
      onComplete: () => {
        targetObj.visible = false
        Hilo.Tween.to(
          completeObj, {
          scaleX: 1,
          x: 0
        }, {
          duration,
          onStart: () => {
            completeObj.visible = true
          },
          onComplete: () => {
            // console.log('执行成功')
          }
        }
        )
      }
    }
    )
  }
}