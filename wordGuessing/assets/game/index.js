import hilojs, { View, align } from 'hilojs'
import { getRandomOption } from '~/assets/util'
import source from "~/static/game.json"
import GameText from './text'
import { getTime } from '../util'



// 问题类
// 答案类
// 展示大图类

export default class InitGame {
    constructor ({ container, configData, callback = () => { } }) {
        if (!configData) {
            return false
        }
        this.configData = configData
        this.container = container
        // 加载资源
        this.queue = this.LoadQueue()
        this.queue.on('complete', e => {

            // 创建舞台
            this.stage = this.initStage({ container })
            this.ticker = this.initTicked()

            // 数据
            this.timeCount = 0
            this.timeStart = true
            this.activeIndex = 0
            this.questionList = this.configData.map((item, index) => new Question(item, index))
            this.pArr = []
            this.fileContent = null

            // 场景
            this.ininBackground()
            this.ininScene()

            // 点击预览小图事件
            this.pArr.forEach((item, index) => {
                item.on(Hilo.event.POINTER_START, () => {
                    this.activeIndex = index
                    this.updateData()
                })
            })
            // 刷新按钮事件
            this.refreshBtn.on(Hilo.event.POINTER_START, e => {
                // 刷新选项
                this.questionList[this.activeIndex].option = this.questionList[this.activeIndex].getOption()
                this.questionList[this.activeIndex].myAnswer = []
                // 更新页面
                this.optionArr.forEach((item, index) => {
                    item.getChildById('word').text = this.questionList[this.activeIndex].option[index]
                })
                this.answerArr.forEach((item, index) => {
                    this.toggleOptionAnswer(item, false)
                })
                this.optionArr.forEach((item, index) => {
                    this.toggleOptionAnswer(item, true)
                })
            })
            // 重新开始按钮事件
            this.resetBtn.on(Hilo.event.POINTER_START, e => {
                // 清空数据
                this.questionList[this.activeIndex].myAnswer = []
                // 更新页面
                this.answerArr.forEach((item, index) => {
                    this.toggleOptionAnswer(item, false)
                })
                this.optionArr.forEach((item, index) => {
                    this.toggleOptionAnswer(item, true)
                })
            })
            // 点击选项事件
            this.optionArr.forEach((item, index) => {
                item.on(Hilo.event.POINTER_START, e => {
                    const myAnswer = this.questionList[this.activeIndex].myAnswer
                    const answer = this.questionList[this.activeIndex].answer

                    const bgColor = item.getChildById('bgColor')
                    const word = item.getChildById('word')

                    // 如果已经空了直接返回
                    if (!bgColor.visible && !word.visible) { return false }
                    // 找到答案的空框编号
                    let answerIndex = null
                    answer.forEach((item, index) => {
                        if (!myAnswer[index] && answerIndex === null) { answerIndex = index }
                    })
                    if (!bgColor || !word || answerIndex === null) { return false }

                    // 隐藏当前点击的选项
                    bgColor.visible = false
                    word.visible = false

                    // 更新答案 并展示对应项
                    myAnswer[answerIndex] = word.text
                    this.answerArr[answerIndex].getChildById('word').text = word.text
                    this.answerArr[answerIndex].getChildById('bgColor').visible = true
                    this.answerArr[answerIndex].getChildById('word').visible = true

                    // 如果答完当前题目，进入下一题
                    if (answer.length === myAnswer.length && myAnswer.every(item => item)) {
                        const index = this.activeIndex + 1
                        if (index < this.questionList.length) {
                            this.activeIndex = index
                            this.updateData()
                        }
                    }

                })
            })
            // 提交按钮事件
            this.commitBtn.on(Hilo.event.POINTER_START, e => {
                this.initConfirm()
            })


            this.ticker.nextTick(() => {
                setTimeout(() => {
                    callback(this)
                }, 500)
            })



        })
    }

    LoadQueue () {
        const queue = new Hilo.LoadQueue()
        const resources = Object.values(source)

        queue.add(resources);
        queue.start()

        return queue
    }

    getSourceBitmap (name, preperty) {
        const [img, icon] = name.split('/')
        const sourceId = source[img].id
        const image = this.queue.getContent(sourceId)
        const rect = icon ? source[img].children[icon].rect : source[img].rect
        return new Hilo.Bitmap({ image, rect, ...preperty })
    }
    getSourceInfo (name) {
        const [img, icon] = name.split('/')
        const sourceId = source[img].id
        const image = this.queue.getContent(sourceId)
        const rect = icon ? source[img].children[icon].rect : source[img].rect
        return { image, rect }
    }

    initStage ({ container }) {
        const gameWidth = 1920
        const gameHeight = 1080
        const scaleX = innerWidth / gameWidth
        const scaleY = innerHeight / gameHeight

        const stage = new Hilo.Stage({
            container,
            width: gameWidth,
            height: gameHeight,
            scaleX,
            scaleY
        })

        // 自适应屏幕
        window.onresize = function () {
            stage.scaleX = innerWidth / gameWidth
            stage.scaleY = innerHeight / gameHeight
            stage.resize(gameWidth, gameHeight, true)
        }

        if (Hilo.event.POINTER_START == "touchstart") {
            stage.enableDOMEvent('mousedown', true)
            stage.enableDOMEvent('mousemove', true)
            stage.enableDOMEvent('mouseup', true)
        }

        function touchHandler (event) {
            if( event.touches.length>1 ){ return false }
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
                false, false, false, 0 /*left*/, null);

            first.target.dispatchEvent(simulatedEvent);
        }

        function init () {
            console.log('convert touch to mouse');
            document.addEventListener("touchstart", touchHandler, true);
            document.addEventListener("touchmove", touchHandler, true);
            document.addEventListener("touchend", touchHandler, true);
            document.addEventListener("touchcancel", touchHandler, true);
        }

        if (Hilo.event.POINTER_START == "mousedown") {
            init();
        }
        //绑定交互事件
        stage.enableDOMEvent(Hilo.event.POINTER_START, true)
        stage.enableDOMEvent(Hilo.event.POINTER_MOVE, true)
        stage.enableDOMEvent(Hilo.event.POINTER_END, true)

        return stage
    }

    initTicked () {
        // 启动计时器
        const ticker = new Hilo.Ticker(60)
        ticker.addTick(this.stage)
        ticker.addTick(Hilo.Tween)
        ticker.start()

        return ticker
    }

    ininBackground () {
        return this.getSourceBitmap('background', { x: 0, y: 0 }).addTo(this.stage)

    }

    updateData () {
        const activeQuestion = this.questionList[this.activeIndex]

        // 预览小图
        this.pArr.forEach((item, index) => {
            const indexColor = this.activeIndex === index ? 'yellow' : 'green'
            item.getChildById('questionIndex').drawable.init({ ...this.getSourceInfo(`sprite/${indexColor}${index + 1}`) })
        })

        // 主展示区大图
        const img = new Image()
        img.src = activeQuestion.content
        this.fileContent.drawable.init({ image: activeQuestion.content, rect: [0, 0, img.width, img.height] })
        this.testContent.text = activeQuestion.content.slice(0, 390)
        this.testContent.visible = activeQuestion.tag === 'p'
        // this.testContent.x = (810 -  this.testContent.textWidth) / 2
        // this.testContent.y = (556 - this.testContent.textHeight) / 2

        this.tipText.text = '提示：' + activeQuestion.tip
        this.tipText.visible = !!activeQuestion.tip
        this.enlarge.visible = activeQuestion.tag === 'img'

        const lastAudio = document.querySelector('#container__audio')
        if (lastAudio) { this.container.removeChild(lastAudio) }
        if (activeQuestion.tag === 'audio') {
            const audioContent = Hilo.createElement('audio', {
                src: activeQuestion.content,
                controls: true,
                class: 'container__audio',
                id: 'container__audio',
                style: {
                    position: 'fixed',
                    top: '43%',
                    left: '23%',
                    width: '35%'
                }
            })
            this.container.appendChild(audioContent)
        }

        const lastVidoe = document.querySelector('#container__video')
        if (lastVidoe) { this.container.removeChild(lastVidoe) }
        if (activeQuestion.tag === 'video') {
            const videoContent = Hilo.createElement('video', {
                src: activeQuestion.content,
                controls: true,
                class: 'container__video',
                id: 'container__video',
                style: {
                    position: 'fixed',
                    bottom: '25%',
                    left: '28%',
                    maxWidth: '42%',
                    maxHeight: '48%',
                }
            })
            this.container.appendChild(videoContent)
        }

        // 答题区
        // 选项：与答案一致的文案不展示
        this.optionArr.forEach((item, index) => {
            const wordText = activeQuestion.option[index]
            item.getChildById('word').text = wordText

            const isShow = activeQuestion.myAnswer.indexOf(wordText) < 0
            this.toggleOptionAnswer(item, isShow)
        })
        // 答案移除重新建
        this.stage.removeChild(this.stage.getChildById('myAnswer'))
        this.stage.addChild(this.initAnswer())

    }

    ininScene () {
        // 1 预览 2 展示区 3 答题区
        const activeQuestion = this.questionList[this.activeIndex]

        // 预览列表
        const pArr = this.pArr = this.questionList.map(item => {
            const bg = new Hilo.Container({ background: '#f7e3c3' })
            const img = new Hilo.Bitmap({ image: item.content, visible: item.tag === 'img' })
            const border = this.getSourceBitmap('sprite/small-border')
            const text = new GameText({
                text: item.content.slice(0, 390),
                fontSize: 6,
                lineHeight: 6,
                color: '#999',
                visible: item.tag === 'p'
            })
            const audio = this.getSourceBitmap('audio', { visible: item.tag === 'audio' })

            const indexColor = this.activeIndex === item.index ? 'yellow' : 'green'
            const index = this.getSourceBitmap(`sprite/${indexColor}${item.index + 1}`, { id: 'questionIndex' })

            img.width = border.width - 10
            img.height = border.height - 10
            bg.width = img.width
            bg.height = img.height
            img.x = 0
            img.y = 150 * item.index
            bg.y = 150 * item.index
            text.x = 10
            text.y = 150 * item.index + 15
            text.maxWidth = img.width - 10
            audio.width = border.width - 10
            audio.y = border.height / 2 - 30
            border.x = img.x - 4
            border.y = img.y - 4
            index.x = img.x + 120
            index.y = img.y - 20

            // const bg = new Hilo.Graphics().drawRoundRect(0, 0, img.width , img.height, 20).beginFill('#f7e3c3').endFill()

            const itemContainer = new Hilo.Container({ children: [bg, img, text, audio, border, index] })

            return itemContainer
        })
        const pListContainer = new Hilo.Container({ children: pArr, x: 120, y: 220 })



        // 主要展示区----------------------------
        const fileContent = this.fileContent = new Hilo.Bitmap({ image: activeQuestion.content, x: 18, y: 15 })
        const testContent = this.testContent = new GameText({
            text: activeQuestion.content.slice(0, 384),
            fontSize: 28,
            lineHeight: 34,
            color: '#666',
            visible: activeQuestion.tag === 'p',
            x: 60,
            y: 80
        })
        // testContent.x = (810 -  testContent.textWidth) / 2
        // testContent.y = (556 - testContent.textHeight) / 2

        if (activeQuestion.tag === 'audio') {
            const audioContent = Hilo.createElement('audio', {
                src: activeQuestion.content,
                controls: true,
                class: 'container__audio',
                id: 'container__audio',
                style: {
                    position: 'fixed',
                    top: '43%',
                    left: '23%',
                    width: '35%'
                }
            })
            this.container.appendChild(audioContent)
        }

        if (activeQuestion.tag === 'video') {
            const videoContent = Hilo.createElement('video', {
                src: activeQuestion.content,
                controls: true,
                class: 'container__video',
                id: 'container__video',
                style: {
                    position: 'fixed',
                    bottom: '25%',
                    left: '28%',
                    maxWidth: '42%',
                    maxHeight: '48%',
                }
            })
            this.container.appendChild(videoContent)
        }



        const clock = this.getSourceBitmap('sprite/clock', { x: 270, y: -50 })
        const border = this.getSourceBitmap('border', { x: 0, y: 0 })
        const text = this.tipText = new GameText({
            text: '提示：' + activeQuestion.tip,
            x: 30,
            y: border.height + 20,
            fontSize: 28,
            lineHeight:30,
            color: '#999',
            visible: !!activeQuestion.tip
        })
        const clockTime = new GameText({
            text: this.clockTime,
            color: '#fff',
            fontSize: 60,
            fontWight: 700,
            x: 300,
            y: -50
        })
        const enlarge = this.enlarge = this.getSourceBitmap('sprite/enlarge', { visible: activeQuestion.tag === 'img', x: 755, y: 500 })
        const close = this.getSourceBitmap('sprite/close')
        const enlargeContainer = new Hilo.Container({
            clipChildren: true,
            width: this.stage.width,
            height: this.stage.height,
            x: 0,
            y: 0
        })
        const enlargeBg = new Hilo.Container({ width: this.stage.width, height: this.stage.height, x: 0, y: 0, background: '#000', alpha: 0.7 })


        close.on(Hilo.event.POINTER_START, () => {
            this.stage.removeChild(enlargeContainer)
        })

        enlarge.on(Hilo.event.POINTER_START, (e) => {
            if (activeQuestion.tag !== 'img') { return false }
            const newFile = new Hilo.Bitmap()
            Hilo.copy(newFile, this.fileContent)

            newFile.align = Hilo.align.CENTER
            const img = new Image()
            img.src = activeQuestion.content
            const { width, height } = img
            if (width > height) {
                newFile.width = this.stage.width / 3 * 2
                newFile.height = newFile.width / width * height
            } else {
                newFile.height = this.stage.height / 3 * 2
                newFile.width = newFile.height / height * width
            }

            close.x = (this.stage.width - newFile.width) / 2 + newFile.width - close.width / 2
            close.y = (this.stage.height - newFile.height) / 2 - close.height / 2
            enlargeContainer.addChild(enlargeBg, newFile, close)
            this.stage.addChild(enlargeContainer)

        })

        fileContent.width = border.width - 24
        fileContent.height = border.height - 31

        const bg = new Hilo.Graphics().drawRoundRect(18, 15, fileContent.width + 2, fileContent.height, 20).beginFill('#f7e3c3').endFill()

        // 计时器
        const time = new GameText({ text: getTime(this.timeCount), fontSize: 50, fontWeight: 700, color: '#fff', x: 380, y: -30 })
        this.ticker.interval(() => {
            if (this.timeStart) {
                this.timeCount++
                time.text = getTime(this.timeCount)
            }
        }, 1000)


        const mainContainer = new Hilo.Container({
            children: [bg, fileContent, testContent, border, clock, enlarge, text, time],
            x: 360,
            y: 240
        })


        // 答题区----------------------------
        const answerContainer = this.initAnswer()

        let optionY = 0
        const optionArr = this.optionArr = activeQuestion.option.map((item, index) => {
            const pCount = 6
            if (index % pCount === 0) {
                optionY = optionY + 70
            }
            return this.initBox({
                text: item,
                bgName: 'sprite/option-black',
                bgColorName: 'sprite/option-blue',
                x: index % pCount * 90,
                y: optionY,
                isAnswer: false
            })
        })
        const optionContainer = new Hilo.Container({
            children: optionArr,
            width: 300,
            x: 1300,
            y: 370
        })

        // 按钮组----------------------------
        // 1提交 2清空 3刷新
        const commitBtn = this.commitBtn = this.getSourceBitmap('sprite/commit', { x: 800, y: 940 })
        const resetBtn = this.resetBtn = this.getSourceBitmap('sprite/reset', { x: 1320, y: 750 })
        const refreshBtn = this.refreshBtn = this.getSourceBitmap('sprite/refresh', { x: 1620, y: 750 })

        // 添加到舞台----------------------------
        this.stage.addChild(pListContainer, mainContainer, answerContainer, optionContainer, commitBtn, resetBtn, refreshBtn)

    }

    initAnswer () {
        const activeQuestion = this.questionList[this.activeIndex]
        const answerArrContainer1 = []
        let answerY = 0
        const answerArr = this.answerArr = activeQuestion.answer.map((item, index) => {
            // 为了居中，每排答案放在一个容器中
            const pCount = 7
            const pRow = Math.floor(index / pCount)
            if (index % pCount === 0) {
                answerY = answerY + 56

                answerArrContainer1[pRow] = new Hilo.Container({ align: Hilo.align.TOP })
            }
            const box = this.initBox({
                bgName: 'sprite/answer-black',
                bgColorName: 'sprite/answer-yellow',
                border: 'sprite/answer-border',
                text: activeQuestion.myAnswer[index] || '',
                isAnswer: true,
                x: index % pCount * 76,
                y: answerY
            })
            answerArrContainer1[pRow].addChild(box)


            // 添加事件
            box.on(Hilo.event.POINTER_START, e => {
                const activeAnswer = this.questionList[this.activeIndex].myAnswer
                if (!activeAnswer[index]) { return false }
                // 消除对应答案项
                activeAnswer[index] = ''
                const answerWord = this.answerArr[index].getChildById('word')
                this.answerArr[index].getChildById('bgColor').visible = false
                answerWord.visible = false

                // 对应options展示
                const option = this.optionArr.filter((item, index) => answerWord.text === item.getChildById('word').text)
                if (option.length) {
                    option[0].getChildById('word').visible = true
                    option[0].getChildById('bgColor').visible = true
                }
            })


            return box
        })
        answerArrContainer1.forEach((item, index) => {
            answerArrContainer1[index].width = 525 / 7 * item.children.length
        })

        const answerContainer = new Hilo.Container({
            children: [...answerArrContainer1],
            width: 525,
            x: 1300,
            y: 230,
            id: 'myAnswer'
        })
        return answerContainer
    }

    initBox ({ text, bgName, border, bgColorName, x, y, isAnswer }) {
        const bgBox = this.getSourceBitmap(bgName)
        const color = isAnswer ? '#795548' : '#fff'
        const textBox = new GameText({ id: 'word', text: text, color, fontSize: 30, fontWeigth: 700, visible: !!text })
        const bgColorBox = this.getSourceBitmap(bgColorName, { id: 'bgColor', visible: !!text })
        const borderBox = isAnswer ? this.getSourceBitmap(border, { visible: false, id: 'border', visible: false }) : null

        const container = new Hilo.Container({ x, y })
        if (bgBox) { container.addChild(bgBox) }
        if (borderBox) { container.addChild(borderBox) }
        if (bgColorBox) { container.addChild(bgColorBox) }
        if (textBox) {
            textBox.x = bgBox.width / 4 + 2
            textBox.y = bgBox.height / 4 + 2
            container.addChild(textBox)
        }

        return container
    }

    toggleOptionAnswer (item, data) {
        const bgColor = item.getChildById('bgColor')
        const word = item.getChildById('word')
        if (!bgColor || !word) { return false }
        bgColor.visible = data
        word.visible = data
    }

    initConfirm () {
        const confirm = this.getSourceBitmap('commit', { id: 'commit' })
        const cancel = new Hilo.View({ x: 762, y: 506, width: 135, height: 85, background: 'transparent' })

        const yes = new Hilo.View()
        Hilo.util.copy(yes, cancel)
        yes.x = 1020

        const confirmContainer = new Hilo.Container({ children: [confirm, cancel, yes] })

        yes.on(Hilo.event.POINTER_START, e => {
            this.stage.removeChild(confirmContainer)
            const wrongArr = this.questionList.filter((item) => item.answer.join('') !== item.myAnswer.join(''))
            this.initResultTip(!wrongArr.length)
            // 计时器停止
            this.timeStart = false
        })

        cancel.on(Hilo.event.POINTER_START, e => {
            this.stage.removeChild(confirmContainer)
        })

        confirmContainer.addTo(this.stage)
    }

    initResultTip (data) {
        const success = this.getSourceBitmap('successful', { id: 'successful' })
        const wrong = this.getSourceBitmap('wrong', { id: 'wrong' })
        const result = data ? success : wrong
        this.stage.addChild(result)

        // 倒计时去掉
        this.ticker.timeout(e => {
            this.stage.removeChild(result)
            this.initResultData()
        }, 1000 * 2)
    }

    initResultData () {
        const bg = this.getSourceBitmap('answer')
        const back = this.getSourceBitmap('sprite/back', { x: 1530, y: 400 })
        const restart = this.getSourceBitmap('sprite/restart', { x: 1530, y: 580 })


        const result = this.questionList.map((item, index) => {
            const x = 210
            const color = '#894000'
            const answer = item.answer.join('')
            const myAnswer = item.myAnswer.join('')
            const indexText = new GameText({ text: index + 1, fontSize: 25, color, x: 0 * x })
            const answerText = new GameText({ text: answer, fontSize: 25, lineSpacing: -1, color, maxWidth: 380, align: Hilo.align.CENTER })
            const myAnswerText = new GameText({ text: myAnswer, fontSize: 25, lineSpacing: -1, color, maxWidth: 380, align: Hilo.align.CENTER })
            const line = new Hilo.Graphics()
            line.drawRoundRect(-130, index + 40, 1080, 2, 3).beginFill(color).endFill()
            answerText.maxWidth = 380
            myAnswerText.maxWidth = 380
            answerText.width = answerText.textWidth
            myAnswerText.width = myAnswerText.textWidth

            const answerContainer = new Hilo.Container({ children: [answerText], x: 3 * x - 20, y: -10, width: 380, height: 40 })
            const myAnswerContainer = new Hilo.Container({ children: [myAnswerText], x: 1 * x, y: -10, width: 380, height: 40 })
            return new Hilo.Container({ children: [indexText, answerContainer, myAnswerContainer, line], x: 380, y: index * 100 + 400 })
        })


        const resultDataContainer = new Hilo.Container({ children: [bg, back, restart, ...result] }).addTo(this.stage)

        // 按钮事件
        back.on(Hilo.event.POINTER_START, e => {
            this.stage.removeChild(resultDataContainer)
        })

        restart.on(Hilo.event.POINTER_START, e => {
            this.activeIndex = 0
            this.questionList.forEach((item, index) => {
                item.myAnswer = []
            })
            // 所有选项重新排
            this.questionList.forEach(item => {
                item.option = item.getOption()
            })
            this.updateData()
            this.stage.removeChild(resultDataContainer)
            // 重新计时
            this.timeCount = 0
            this.timeStart = true
        })
    }

}
class Question {
    constructor (data, index) {
        this.language = /[a-z]/.test(data.answer) ? 'english' : 'chinese'
        this.id = 'q' + (index + 1)
        this.index = index
        this.answer = data.answer.split('').filter(item => item)
        this.similar = data.similar.split('').filter(item => item)
        this.option = this.getOption()
        this.content = data.content
        this.tag = data.tag
        this.tip = data.tip
        this.name = data.name

        this.myAnswer = []
    }
    getOption () {
        const list = this.similar.filter(item => this.answer.indexOf(item) < 0)
        return getRandomOption([...this.answer, ...list], this.language)
    }
}