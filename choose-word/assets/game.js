import Hilo from 'hilojs'
import source from '~/static/source.json'
import { randomArr } from "./util";
import GameText from "./text";

export default class InitGame {
    constructor({ container, configData, callback = () => {} }) {
        // 数据处理
        if (!configData) {
            return false
        }
        this.container = container
        this.title = configData.title
        this.word = configData.word
        this.answer = configData.answer
        this.similar = configData.similar
        this.option = randomArr([...this.answer, ...this.similar])

        this.myAnswer = new Array(this.answer.length).fill('')
        this.myAnswerResult = new Array(this.answer.length).fill('')

        // 资源下载
        this.quene = this.loadQuene(() => {


            // 场景处理
            this.stage = this.initStage(true)
            this.ticker = this.initTicker()

            this.initTitle()
            this.initQuestion()
            this.initResultButton()
            this.submit = this.getSourceBitmap('submit', { visible: false, x: 791, y: 960 }).addTo(this.stage)
            this.initOption()


            // 事件处理
            this.submit.on(Hilo.event.POINTER_END, e => {
                //提交
                if (this.myAnswer.join('') === this.answer.join('')) {
                    this.initResultTip(true)
                } else {
                    this.initResultTip(false)
                }
                this.submit.visible = false
                this.resultButtonContainer.visible = true
                this.optionList.forEach((item, index) => {
                    item.stopDrag()
                    if (item.answerResult) {
                        item.getChildById('yes').visible = item.answerResult === 'yes'
                        item.getChildById('no').visible = item.answerResult === 'no'
                    }
                })
            })

            this.ticker.nextTick(() => {
                callback(this)
            })

        })


    }

    loadQuene(callback) {
        const quene = new Hilo.LoadQueue()
        quene.add(Object.values(source))
        quene.on('complete', () => {
            callback()
        })
        quene.start()
        return quene
    }

    initStage(bg) {
        const width = 1920
        const height = 1080
        const scaleX = innerWidth / width
        const scaleY = innerHeight / height

        const stage = new Hilo.Stage({
            renderType: 'canvas',
            container: this.container,
            width,
            height,
            scaleX,
            scaleY
        })

        window.onresize = () => {
            stage.scaleX = innerWidth / width
            stage.scaleY = innerHeight / height
            stage.resize(width, height, true)
        }

        function touchHandler(event) {
            var touches = event.changedTouches,
                first = touches[0],
                type = "";
            switch (event.type) {
                case "touchstart":
                    type = "mousedown";
                    break;
                case "touchmove":
                    type = "mousemove";
                    break;
                case "touchend":
                    type = "mouseup";
                    break;
                default:
                    return;
            }

            // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
            //                screenX, screenY, clientX, clientY, ctrlKey, 
            //                altKey, shiftKey, metaKey, button, relatedTarget);

            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1,
                first.screenX, first.screenY,
                first.clientX, first.clientY, false,
                false, false, false, 0 /*left*/ , null);

            first.target.dispatchEvent(simulatedEvent);
        }

        function init() {
            console.log('convert touch to mouse');
            document.addEventListener("touchstart", touchHandler, true);
            document.addEventListener("touchmove", touchHandler, true);
            document.addEventListener("touchend", touchHandler, true);
            document.addEventListener("touchcancel", touchHandler, true);
        }

        if (Hilo.event.POINTER_START == "mousedown") {
            init();
        }

        stage.enableDOMEvent(Hilo.event.POINTER_START, true)
        stage.enableDOMEvent(Hilo.event.POINTER_MOVE, true)
        stage.enableDOMEvent(Hilo.event.POINTER_END, true)

        if (bg) {
            this.getSourceBitmap('background').addTo(stage)
        }

        return stage
    }
    initTicker() {
        // ticker刷新舞台
        const ticker = new Hilo.Ticker(60)
        ticker.addTick(this.stage)
        ticker.addTick(Hilo.Tween)
        ticker.start()
        return ticker
    }
    initTitle() {
        let fontSize = 60
        if (this.title.length > 8) { fontSize = Math.floor(420 / this.title.length) }
        const title = new GameText({
            text: this.title,
            fontSize,
            height: fontSize,
            bold: true,
            color: '#894000',
            textAlign: 'center',
            reTextWidth: 500,
            y: (120 - fontSize) / 2,
            // background:'#ccc'
        })

        const container = new Hilo.Container({
            width: 500,
            height: 120,
            y: 65,
            x: (this.stage.width - 500) / 2,
            children: [title],
        }).addTo(this.stage)

        return container
    }

    initQuestion() {
        const container = new Hilo.Container({
            width: this.stage.width / 5 * 4,
            // height: this.stage.height / 5 * 2 - 100,
            y: 230,
        })
        container.x = (this.stage.width - container.width) / 2

        // let fontSize = 40
        // if (this.word.length > 300) { fontSize = (Math.floor(container.width * 5 / 2 / this.word.length)) }

        let questionArr = []
        let lineArr = []
        this.word.forEach((item, index) => {
            // const y = (index) * container.height / this.word.length
            const y = (index) * 110
            let x = 0
            let fontSize = 38
            const wordCount = item.join('').length
            const allWidth = wordCount * fontSize + item.filter(i => !i).length * 300
            if (allWidth > container.width) {
                // fontSize = Math.floor((container.width - (allWidth - wordCount * fontSize)) / wordCount)
            }
            item.map((v, i) => {
                if (v) {
                    const text = new GameText({
                        reTextWidth: v.length * fontSize,
                        text: v,
                        color: '#000',
                        lineHeight: fontSize,
                        fontSize,
                        y,
                        x
                    })
                    text.width = text.textWidth
                    x += fontSize * v.length
                    questionArr.push(text)
                } else {
                    const line = new Hilo.Graphics({ y: y + fontSize, x }).drawRect(0, 0, 300, 2).beginFill().endFill()
                    x += 300
                    lineArr.push(line)
                }
            })
        })
        this.lineArr = lineArr
        this.lineXY = lineArr.map(item => ({ x: item.x + container.x, y: item.y + container.y - 90 }))

        container.addChild(...questionArr, ...lineArr).addTo(this.stage)
    }

    initOption() {
        // option大小 300*90
        const lineCount = Math.ceil(this.option.length / 5)
        const startLine = [2, 1, 0][lineCount - 1]
        const lastLineLength = Math.ceil(this.option.length % 5) || 5
            // 选项
        const optionList = this.optionList = this.option.map((item, index) => {
            const originBg = this.getSourceBitmap('originBg', { id: 'origin' })
            const blueBg = this.getSourceBitmap('blueBg', { id: 'blue', visible: false })
            const yes = this.getSourceBitmap('yes', { id: 'yes', x: 270, y: 50, visible: false })
            const no = this.getSourceBitmap('no', { id: 'no', x: 270, y: 50, visible: false })

            let fontSize = 40
            if (item.length > 6) { fontSize = (Math.floor(300 / item.length)) }
            const text = new GameText({
                    id: 'text',
                    text: item,
                    color: '#000',
                    lineHeight: fontSize,
                    fontSize,
                    textAlign: 'center',
                    reTextWidth: 300,
                    y: (90 - fontSize) / 2,
                    // background: '#ccc'
                })
                // text.width = text.textWidth
                // text.height = text.textHeight

            const line = Math.floor(index / 5)
            const lackSpace = line + 1 === lineCount ? (5 - lastLineLength) * 320 : 0
            const padding = (this.stage.width / 5 + lackSpace) / 2 - 30
            const optionContainer = new Hilo.Container({
                width: 300,
                height: 88,
                children: [originBg, blueBg, text, yes, no],
                x: (index % 5) * 320 + padding,
                y: (line + 1 + startLine) * 100 + 550
                    // [2,1,0][lineCount-1] 
            })

            optionContainer.originX = optionContainer.x
            optionContainer.originY = optionContainer.y
            Hilo.util.copy(optionContainer, Hilo.drag)
            optionContainer.startDrag([0, 0, 1920, 1080])

            return optionContainer
        })

        this.stage.addChild(...optionList)

        optionList.forEach((optionContainer, index) => {
            // 修改层级

            optionContainer.on(Hilo.event.POINTER_START, () => {
                this.stage.removeChild(...optionList)
                this.stage.addChild(...[...optionList, optionContainer])
            })

            //拖拽释放

            optionContainer.on(Hilo.event.POINTER_END, e => {
                const eX = e.stageX - 150
                const eY = e.stageY
                const text = optionContainer.getChildById('text').text
                this.myAnswer.forEach((answer, answerIndex) => {
                    if (answer === text) { this.myAnswer[answerIndex] = '' }
                })
                const result = this.lineXY.some((item, i) => {
                    const rule = (eX < item.x + 300 && eX > item.x - 100) && (eY > item.y - 45 && eY < item.y + 90)
                    if (rule) {
                        if (!this.myAnswer[i] || this.myAnswer[i] === text) {
                            this.myAnswer[i] = text
                            Hilo.Tween.to(optionContainer, { x: item.x, y: item.y }, { duration: 100, ease: Hilo.Ease.Quad.EaseIn })
                        } else {
                            const lastOption = optionList.filter((oValue, oIndex) => oValue.getChildById('text').text === this.myAnswer[i])[0]
                            this.myAnswer[i] = text
                            Hilo.Tween.to(optionContainer, { x: item.x, y: item.y }, { duration: 100, ease: Hilo.Ease.Quad.EaseIn })
                            Hilo.Tween.to(lastOption, { x: lastOption.originX, y: lastOption.originY }, { alpha: 1, duration: 100, ease: Hilo.Ease.Quad.EaseIn })
                            lastOption.answerResult = null
                            lastOption.answerIndex = null
                        }
                    }

                    optionContainer.answerResult = this.myAnswer[i] === this.answer[i] ? 'yes' : 'no'
                    optionContainer.answerIndex = i
                    return rule
                })
                if (!result) {
                    optionContainer.answerResult = null
                    optionContainer.answerIndex = null
                    Hilo.Tween.to(optionContainer, { x: optionContainer.originX, y: optionContainer.originY }, { duration: 100, ease: Hilo.Ease.Quad.EaseIn })
                }

                // 答完题显示提交
                if (this.myAnswer.every(answerVal => answerVal) && this.resultButtonContainer.visible === false) {
                    this.submit.visible = true
                } else {
                    this.submit.visible = false
                }

            })
        })


    }

    initResultTip(data) {
        const id = data ? 'successful' : 'wrong'
        const tip = this.getSourceBitmap(id).addTo(this.stage)
        this.ticker.timeout(() => {
            this.stage.removeChild(tip)
        }, 2000)
    }

    initResultButton() {
        const restart = this.getSourceBitmap('restart', { x: 1056, y: 960 }).addTo(this.stage)
        const result = this.getSourceBitmap('result', { x: 528, y: 960 }).addTo(this.stage)
        this.resultButtonContainer = new Hilo.Container({
            children: [restart, result],
            visible: false
        }).addTo(this.stage)

        restart.on(Hilo.event.POINTER_END, e => {
            this.resultButtonContainer.visible = false
            this.myAnswer = this.myAnswer.map(item => '')
            this.option = randomArr([...this.answer, ...this.similar])
            this.optionList.forEach((item, index) => {
                item.answerIndex = null
                item.answerResult = null
                item.getChildById('text').text = this.option[index]
                item.getChildById('yes').visible = false
                item.getChildById('no').visible = false
                item.getChildById('blue').visible = false
                Hilo.Tween.to(item, { x: item.originX, y: item.originY }, { alpha: 1, duration: 100, ease: Hilo.Ease.Quad.EaseIn })
                item.startDrag([0, 0, 1920, 1080])
            })

        })

        result.on(Hilo.event.POINTER_END, e => {
            this.optionList.forEach((item, index) => {
                if (item.answerResult === 'no') {
                    item.getChildById('no').visible = false
                    item.getChildById('blue').visible = true

                    const text = item.getChildById('text').text
                    const rightText = this.answer[item.answerIndex]
                    const changeOption = this.optionList.filter((option, i) => rightText === option.getChildById('text').text)[0]
                    item.getChildById('text').text = rightText
                    changeOption.getChildById('text').text = text
                }
            })
        })
    }

    getSourceBitmap(id, properties) {
        return new Hilo.Bitmap({ image: this.quene.get(id).content, rect: this.quene.get(id).rect, ...properties })
    }
}