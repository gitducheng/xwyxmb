import Hilo from 'hilojs'
import Text from './text'
export default class ExportScence extends Hilo.Container {
    constructor(properties) {
        super(properties)
        this.initBg(properties)
    }
    initBg(properties) {
        const { backgroundPos, questions, preview } = properties

        const bg = new Hilo.Bitmap({
            x: 0,
            y: 0,
            image: backgroundPos.image,
            rect: backgroundPos.rect,
            visible: true
        })
        bg.addTo(this, -1)

        new Text({
            text: `每题时间：${questions.second}秒`,
            fontSize: 30,
            lineHeight: 30,
            bold: true,
            textAlign: 'center',
            textVAlign: 'middle',
            height: 80,
            // background: 'rgba(255,0,0,0.2)',
            reTextWidth: 500,
            x: 1920 / 2 - 250,
            y: 400,
            color: '#000'
        }).addTo(this)
        if (preview) return
        const startbtn = new Text({
            text: `点击任意地方开始游戏`,
            fontSize: 30,
            lineHeight: 30,
            bold: true,
            textAlign: 'center',
            textVAlign: 'middle',
            height: 80,
            // background: 'rgba(255,0,0,0.2)',
            reTextWidth: 500,
            x: 1920 / 2 - 250,
            y: 900,
            color: '#4BDFE8'
        }).addTo(this)
        Hilo.Tween.to(startbtn, { alpha: 0 }, { loop: true, duration: 1000 })

        const startNumber = new Text({
            text: 4,
            fontSize: 120,
            lineHeight: 120,
            bold: true,
            textAlign: 'center',
            textVAlign: 'middle',
            height: 200,
            // background: 'rgba(255,0,0,0.2)',
            visible: false,
            cc: 3,
            alpha: 1,
            reTextWidth: 500,
            x: 1920 / 2 - 250,
            y: 600,
            color: '#4BDFE8'
        }).addTo(this)
        let isActive = false

        this.on(Hilo.event.POINTER_START, (e) => {
            if (preview) return
            if (isActive) return
            isActive = true
            startNumber.visible = true
            Hilo.Tween.to(
                startNumber, { text: -2 }, {
                    duration: 4000,

                    onUpdate: (r, v) => {
                        const num = parseInt(startNumber.text)
                        if (startNumber.text >= 1) {
                            startNumber.text = num
                            return
                        }
                        if (num === 0) {
                            startNumber.text = 'Ready!'
                            return
                        }
                        if (startNumber.text < 0) {
                            startNumber.text = 'GO!'
                            return
                        }
                    },
                    onComplete: () => {
                        this.visible = false
                        startNumber.alpha = 1
                        startNumber.text = 4
                        startNumber.visible = false
                        this.onStart && this.onStart()
                        isActive = false
                    }
                }
            )
        })
    }
}