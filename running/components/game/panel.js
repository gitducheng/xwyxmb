import Hilo from 'hilojs'
import Text from './text'
import { randomArray } from './lib/util'
import numberUitl from 'num2capital'
import { TimeSelect } from 'element-ui'
export default class Panel extends Hilo.Container {
    constructor(properties) {
        super(properties)
        const { source, questions = [], second } = properties
        this.second = second
        const panel = source['game-panel']
        this._questions = questions
        this.source = source
        this.initCard(properties)
        this.initCard(properties, this.width - panel['右侧背景.png'].width)
        this.initTopCard(properties)
        this.initPauseCard(properties)
        this.initEvet(properties)
    }
    second = 0
    source = null
    _questions = []
    _state = 'pending' //状态 'ready' | 'playing' | 'animation' | 'pause' | 'stop' | 'end'
    _tool = {} //可操作工具
    _activeCount = null // 当前答题进度
    _activeContent = null // 当前题目
    _isDati = false
    _timer = 0
    get timer() {
        return this._timer
    }
    set timer(val) {
        this._timer = val
        this._tool.daojishi.forEach((item) => (item.text = val + 1))
    }
    initEvet(properties) {
        const { source } = properties
        const panel = source['game-panel']
        const { checkButton, checkButtonFalse } = this._tool
        checkButton.forEach((item, index) => {
            item.setImage(panel['对.png'].image, panel['对.png'].rect)
            item.on(Hilo.event.POINTER_START, (e) => {
                checkButtonFalse[index].setImage(
                    panel['错.png'].image,
                    panel['错.png'].rect
                )
                item.setImage(panel['对选中.png'].image, panel['对选中.png'].rect)
                const ti = this._activeContent[index][this._activeCount]
                ti.uCheck = '1'
                ti.isCood = ti.isCheck === 1 ? true : false
            })
        })

        checkButtonFalse.forEach((item, index) => {
            item.setImage(panel['错.png'].image, panel['错.png'].rect)

            item.on(Hilo.event.POINTER_START, (e) => {
                checkButton[index].setImage(panel['对.png'].image, panel['对.png'].rect)
                item.setImage(panel['错选中.png'].image, panel['错选中.png'].rect)
                const ti = this._activeContent[index][this._activeCount]
                ti.uCheck = '2'
                ti.isCood = ti.isCheck === 2 ? true : false
            })

        })
    }
    startTimer() {
        if (this.goPlaying) return
        if (this._state !== 'playing') return
        if (!this._activeContent) return
        if (this.timer === 0) return this.goNext()
        setTimeout(this.startTimer.bind(this), 1000)
        this.timer--
    }
    startQuestion() {
        const temp = JSON.parse(JSON.stringify(this._questions))
        const temp2 = JSON.parse(JSON.stringify(this._questions))
        const leftArr = randomArray(temp)
        const rightArr = randomArray(temp2)
        if (leftArr.length && rightArr.length) {
            this._activeContent = [leftArr, rightArr]
        }
        this._activeCount = null
    }
    switchQuestion() {
        if (this.goPlaying) return
        const { source } = this
        const panel = source['game-panel']
        if (!this._activeContent) return
        if (this._activeCount === null) {
            this._activeCount = 0
        } else {
            this._activeCount++
        }
        const { checkButton, checkButtonFalse } = this._tool
            // 重置每题状态
        this.timer = this.second
        checkButtonFalse &&
            checkButtonFalse.forEach((item) =>
                item.setImage(panel['错.png'].image, panel['错.png'].rect)
            )
        checkButton &&
            checkButton.forEach((item) =>
                item.setImage(panel['对.png'].image, panel['对.png'].rect)
            )
        this._tool.planetInfo[0].text = this._activeContent[0][
            this._activeCount
        ].text
        this._tool.planetInfo[1].text = this._activeContent[1][
            this._activeCount
        ].text
        this._tool.jinduban.text = `${this._activeCount + 1} / ${
      this._questions.length
    }`
        this.startTimer()
    }
    async goNext() {
        if (this.goPlaying) return
        if (this.timer !== 0) {
            return this.startTimer()
        }
        // 执行判断结果后的过长动画
        if (this._activeCount === null) {
            // 如果 _activeCount 为null 直接切换题目
            const { tihaoText } = this._tool
            const { tihao } = this._tool
            await new Promise((re) => {
                tihaoText.text = `第${numberUitl.num2Capital(1)}题`
                tihao.visible = true
                Hilo.Tween.to(
                    tihao, { alpha: 1 }, {
                        duration: 600,
                        onComplete: () => {
                            Hilo.Tween.to(
                                tihao, { alpha: 0 }, {
                                    delay: 1000,
                                    duration: 600,
                                    onComplete: () => {
                                        tihao.visible = false
                                        re()
                                    }
                                }
                            )
                        }
                    }
                )
            })
            this._isDati = true
            return this.switchQuestion()
        }

        // 先执行判断，还有所有过场动画

        // 判断是否还有下一题
        if (!this._activeContent[0][this._activeCount + 1]) {
            this.state = 'stop'
            setTimeout(() => {
                this.timer = -1
                this.state = 'end'
            }, 500)

            return
        }
        this.goPlaying = true
        await this.isGood()
        this.goPlaying = false
            // 切换题目
        this.switchQuestion()
    }
    async isGood() {
        const p1Ti = this._activeContent[0][this._activeCount]
        const p2Ti = this._activeContent[1][this._activeCount]
        this.onTi && this.onTi(p1Ti.isCood, p2Ti.isCood)
        this._tool.maskV.forEach((item, index) => {
            if (index === 0) {
                item.visible = !p1Ti.isCood
            } else {
                item.visible = !p2Ti.isCood
            }
        })
        this._isDati = false
        this.timer = -1
        this.onCheck && (await this.onCheck(p1Ti.isCood, p2Ti.isCood))
        this._tool.maskV.forEach((item, index) => {
            item.visible = false
        })
        this.onTi && this.onTi(null, null)
        const { tihaoText } = this._tool
        const { tihao } = this._tool
        await new Promise((re) => {
            tihaoText.text = `第${numberUitl.num2Capital(this._activeCount + 2)}题`
            tihao.visible = true
            Hilo.Tween.to(
                tihao, { alpha: 1 }, {
                    duration: 600,
                    onComplete: () => {
                        Hilo.Tween.to(
                            tihao, { alpha: 0 }, {
                                delay: 1000,
                                duration: 600,
                                onComplete: () => {
                                    tihao.visible = false
                                    re()
                                }
                            }
                        )
                    }
                }
            )
        })
        this._isDati = true
    }
    get state() {
        return this._state
    }

    set state(val) {
        if (this.state === 'val') return
        if (this._state === 'end' && val === 'playing') {
            //不允许结束状态设置
            return
        }
        if (this._state === 'playing' && val === 'playing') {
            //不允许重复设置
            return
        }
        if (this._state === 'end' && val === 'pause') {
            //不允许重复设置
            return
        }
        this._state = val
        if (val === 'ready') {
            this._activeCount = null
            this._activeContent = null
            this._tool.planetInfo[0].text = ''
            this._tool.planetInfo[1].text = ''
            this.timer = 0
            this._tool.jinduban.text = `0 / ${this._questions.length}`
            this.startQuestion()
            this.onReady && this.onReady()
                // this._tool.pauseMask.start()
        }

        if (val === 'playing') {
            this._tool.topcard.visible = true
            const stage = this.getStage()

            stage.ticker._paused && stage.ticker.resume()

            clearTimeout(this.startTimer.bind(this))

            this.goNext()
            this.onPlaying && this.onPlaying()
        } else {
            this._tool.topcard.visible = false
            clearTimeout(this.startTimer.bind(this))
        }
        if (val === 'pause') {
            clearTimeout(this.startTimer.bind(this))
            this._tool.pauseMask.start()
        }
        if (val === 'end') {
            this._tool.maskV.forEach((item) => (item.visible = false))
            this._tool.topcard.visible = false
            this.onEnd && this.onEnd(JSON.parse(JSON.stringify(this._activeContent)))
        }
    }

    initTopCard(properties) {
        const { source } = properties
        const panelStop = source['game-stop']
        const { _questions } = this

        const tihao = new Hilo.Container({
            width: panelStop['提示框.png'].width,
            height: panelStop['提示框.png'].height,
            x: this.width / 2 - panelStop['提示框.png'].width / 4,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            visible: false,
            y: 200
        })

        const tihaoBg = new Hilo.Bitmap({
            ...panelStop['提示框.png'],
            x: 0,
            y: 0
        }).addTo(tihao)

        const tihaoText = new Text({
            text: `第${numberUitl.num2Capital(this._activeCount + 1)}题`,
            fontSize: 80,
            lineHeight: 0,
            bold: true,
            textAlign: 'center',
            textVAlign: 'middle',
            height: 140,
            reTextWidth: tihaoBg.width,
            x: 0,
            y: 0,
            color: '#4BDFE8'
        }).addTo(tihao)
        tihao.addTo(this)
        this._tool.tihaoText = tihaoText
        this._tool.tihao = tihao
        const card = new Hilo.Container({
            width: 156 + 34 + 76,
            height: 56,
            x: this.width / 2 - (156 + 34 + 76) / 2,
            y: 70
                // background: 'rgba(0,0,0,0.5)'
        }).addTo(this)
        const daojishi = new Text({
            text: `0 / ${_questions.length}`,
            fontSize: 72,
            lineHeight: 56,
            bold: true,
            textAlign: 'center',
            textVAlign: 'middle',
            height: 56,
            reTextWidth: 156,
            x: 0,
            y: 0,
            color: '#4BDFE8'
        }).addTo(card)

        const stopBtn = new Hilo.Bitmap({
            x: 156 + 34 - 20,
            y: -18,
            image: panelStop['暂停按钮.png'].image,
            rect: panelStop['暂停按钮.png'].rect,
            visible: true
        }).addTo(card)
        stopBtn.on(Hilo.event.POINTER_START, (e) => {
            this.state = 'pause'
        })
        this._tool.jinduban = daojishi
        this._tool.topcard = card
    }

    initStartCard(properties) {
        const { source } = properties
        const panelStop = source['game-stop']
    }

    initPauseCard(properties) {
        const { source } = properties
        const panelStop = source['game-stop']
        const width = this.width
        const height = this.height
        const pauseCard = new Hilo.Container({
            x: 0,
            y: 0,
            alpha: 0,
            width,
            height,
            background: 'rgba(0,0,0,0.5)'
        }).addTo(this)
        const pauseCardPanel = new Hilo.Bitmap({
            x: 608,
            y: 210,
            image: panelStop['暂停面板.png'].image,
            rect: panelStop['暂停面板.png'].rect,
            visible: true
        }).addTo(pauseCard)
        const playBtn = new Hilo.Bitmap({
            x: 715,
            y: 517,
            image: panelStop['继续.png'].image,
            rect: panelStop['继续.png'].rect,
            visible: true
        }).addTo(pauseCard)
        const reStart = new Hilo.Bitmap({
            x: 1041,
            y: 517,
            image: panelStop['重置.png'].image,
            rect: panelStop['重置.png'].rect,
            visible: true
        }).addTo(pauseCard);
        [playBtn, reStart].forEach((item, index) => {
            item.on(Hilo.event.POINTER_START, (e) => {
                if (index > 0) {
                    this.state = 'ready'
                } else {
                    this.state = 'playing'
                }

                Hilo.Tween.to(
                    pauseCard, {
                        alpha: 0,
                        y: -pauseCard.height
                    }, {
                        duration: 200,
                        loop: false,
                        onComplete: () => {}
                    }
                )
            })
        })
        this._tool.pauseMask = Hilo.Tween.to(
            pauseCard, {
                alpha: 1,
                y: 0
            }, {
                duration: 200,
                loop: false,
                onComplete: () => {
                    if (this.state === 'pause') {
                        this.onPause && this.onPause()
                    }
                }
            }
        ).stop()
    }

    initCard(properties, x = 0) {
        const { source } = properties
        const panel = source['game-panel']
        const jifenban = new Hilo.Container({
            width: (x > 0 ? panel['右侧背景.png'] : panel['左侧背景.png']).width,
            height: this.height,
            x,
            y: 0
        }).addTo(this)
        new Hilo.Bitmap({
            ...(x > 0 ? panel['右侧背景.png'] : panel['左侧背景.png']),
            x: 0,
            y: 0
        }).addTo(jifenban, -1)

        const dataCard = new Hilo.Bitmap({
            ...panel['对话框对.png'],
            x: 14,
            y: 224
        }).addTo(jifenban)

        const maskV = new Hilo.Bitmap({
            ...panel['对话框错.png'],
            x: 33,
            y: 224,
            visible: false
        }).addTo(jifenban)
        Hilo.Tween.to(maskV, { alpha: 0 }, { loop: true, duration: 200 })
        this._tool.maskV = [...(this._tool.maskV || []), maskV]

        // 倒计时
        const daojishi = new Text({
            text: this._timer,
            fontSize: 45,
            lineHeight: 45,
            bold: false,
            textAlign: 'center',
            reTextWidth: 70,
            x: dataCard.x + 44,
            y: dataCard.y + 16,
            color: '#27a3dd'
        }).addTo(jifenban)
        this._tool.daojishi = [...(this._tool.daojishi || []), daojishi]
            // 题目
        const planetInfo = new Text({
            text: '',
            fontSize: 30,
            lineHeight: 30,
            bold: true,
            textAlign: 'center',
            textVAlign: 'middle',
            height: 216,
            reTextWidth: 394,
            // background: 'rgba(255,0,0,0.5)',
            x: 55,
            y: 314,
            color: 'rgba(21,1,45,1)'
        }).addTo(jifenban)
        this._tool.planetInfo = [...(this._tool.planetInfo || []), planetInfo]

        // 操作按钮
        const checkButton = new Hilo.Bitmap({
            x: 105 - 15,
            y: 789,
            rect: panel['对.png'].rect,
            image: panel['对.png'].image,
            visible: true
        }).addTo(jifenban)

        this._tool.checkButton = [...(this._tool.checkButton || []), checkButton]
        const checkButtonFalse = new Hilo.Bitmap({
            x: 309,
            y: 789,
            rect: panel['错.png'].rect,
            image: panel['错.png'].image,
            visible: true
        }).addTo(jifenban)
        this._tool.checkButtonFalse = [
            ...(this._tool.checkButtonFalse || []),
            checkButtonFalse
        ]
    }
    onUpdate() {
        if (this._state === 'playing') {
            if (this.timer < 4 && this.timer > 0) {
                this._tool.maskV.forEach((item, index) => {
                    const p1Ti = this._activeContent[index][this._activeCount]
                    this.onChaoshi &&
                        this.onChaoshi(
                            index,
                            p1Ti && p1Ti.isCood === undefined ? true : false
                        )
                })
            } else {
                this._tool.maskV.forEach((item, index) => {
                    this.onChaoshi && this.onChaoshi(index, false)
                })
            }
            if (this._activeContent[0][this._activeCount] && this._isDati) {
                this._tool.checkButton &&
                    this._tool.checkButton.forEach((item) => (item.visible = true))
                this._tool.checkButtonFalse &&
                    this._tool.checkButtonFalse.forEach((item) => (item.visible = true))
            } else {
                this._tool.checkButton &&
                    this._tool.checkButton.forEach((item) => (item.visible = false))
                this._tool.checkButtonFalse &&
                    this._tool.checkButtonFalse.forEach((item) => (item.visible = false))
            }
        } else {
            this._tool.maskV.forEach((item, index) => {
                this.onChaoshi && this.onChaoshi(index, false)
            })
            this._tool.checkButton &&
                this._tool.checkButton.forEach((item) => (item.visible = false))
            this._tool.checkButtonFalse &&
                this._tool.checkButtonFalse.forEach((item) => (item.visible = false))
        }
    }
}