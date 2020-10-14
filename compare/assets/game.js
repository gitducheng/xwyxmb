import Hilo from 'hilojs'
import source from '~/static/source.json'
import GameText from "./text"

function randomArr (arr) {
    return arr.sort(() => 0.5 - Math.random())
}

export default class InitGame {
    constructor ({ container, configData, callback = () => { } }) {
        // 数据处理
        this.container = container
        if (!configData) { return false }
        this.title = configData.title
        this.data = configData.data
        this.activeSymbol = null
        this.myAnswerList = []
        this.isSubmit = false



        // 资源下载
        this.quene = this.loadQuene(() => {


            // 场景处理
            this.stage = this.initStage(true)
            this.ticker = this.initTicker()

            this.initTitle(true)
            this.initScene()
            this.initOption()
            this.initButton()




            // 事件处理
            this.symbolList.forEach((item, index) => {
                item.on(Hilo.event.POINTER_START, e => {
                    if (this.isSubmit) { return false }
                    const id = item.id
                    const bg = item.getChildById('symbolBrown')
                    if (bg.alpha === 1) {
                        // 选中
                        item.getChildById('symbolBrown').alpha = 0.7
                        this.activeSymbol = item.getChildById('symbol').text
                    } else {
                        // 取消选中
                        // item.getChildById('symbolBrown').alpha = 1
                        // this.activeSymbol = null
                    }

                    this.symbolList.forEach(s => {
                        if (s.id !== id) { s.getChildById('symbolBrown').alpha = 1 }
                    })
                })
            })
            this.myAnswerList.forEach((item, index) => {
                item.on(Hilo.event.POINTER_START, e => {
                    if (this.isSubmit) { return false }
                    if (this.activeSymbol) {
                        item.getChildById('answer').text = this.activeSymbol
                        this.activeSymbol = null
                        this.symbolList.forEach(s => {
                            s.getChildById('symbolBrown').alpha = 1
                        })
                    }

                    // 全部答完
                    const isOver = this.myAnswerList.every(s => s.getChildById('answer').text)
                    if (isOver) { this.submit.visible = true }
                })
            })

            this.submit.on(Hilo.event.POINTER_START, e => {
                this.isSubmit = true
                let isWright = true
                this.myAnswerList.forEach((item, index) => {
                    const myAnswer = item.getChildById('answer').text
                    if (myAnswer === this.data[index].answer) {
                        item.getChildById('green').visible = true
                    } else {
                        item.getChildById('red').visible = true
                        isWright = false
                    }
                })

                // 弹窗提示
                this.initResultTip(isWright)
                this.submit.visible = false
                this.restart.visible = true
                this.result.visible = true


                this.symbolList.forEach((item, index) => {
                    item.getChildById('symbolBrown').alpha = 1
                    this.activeSymbol = null
                })
            })

            this.restart.on(Hilo.event.POINTER_START, e => {
                this.isSubmit = false
                this.myAnswerList.forEach((item, index) => {
                    const answer = item.getChildById('answer')
                    answer.text = ''
                    answer.color = '#6a3f03'
                    item.getChildById('green').visible = false
                    item.getChildById('red').visible = false
                    item.getChildById('yellowGreen').visible = false
                })

                this.submit.visible = false
                this.restart.visible = false
                this.result.visible = false
            })

            this.result.on(Hilo.event.POINTER_START, e => {
                this.myAnswerList.forEach((item, index) => {
                    const answer = item.getChildById('answer')
                    // 只有错误的显示黄绿色
                    if (answer.text === this.data[index].answer) { return false }

                    answer.text = this.data[index].answer
                    answer.color = '#6a3f03'
                    item.getChildById('green').visible = false
                    item.getChildById('red').visible = false
                    item.getChildById('yellowGreen').visible = true
                })
            })





            this.ticker.nextTick(() => {
                callback(this)
            })

        })


    }

    loadQuene (callback) {
        const quene = new Hilo.LoadQueue()
        quene.add(Object.values(source))
        quene.on('complete', () => {
            callback()
        })
        quene.start()
        return quene
    }

    initStage (bg) {
        const width = 1920
        const height = 1080
        const scaleX = innerWidth / width
        const scaleY = innerHeight / height

        const stage = new Hilo.Stage({
            renderType: 'canvas',
            container: this.container,
            width, height, scaleX, scaleY
        })

        window.onresize = () => {
            stage.scaleX = innerWidth / width
            stage.scaleY = innerHeight / height
            stage.resize(width, height, true)
        }
        function touchHandler (event) {
            if( event.touches.length>1 ){ return false }
            var touches = event.changedTouches,
                first = touches[0],
                type = "";
            switch (event.type) {
                case "touchstart": type = "mousedown"; break;
                case "touchmove": type = "mousemove"; break;
                case "touchend": type = "mouseup"; break;
                default: return;
            }

            // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
            //                screenX, screenY, clientX, clientY, ctrlKey, 
            //                altKey, shiftKey, metaKey, button, relatedTarget);

            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1,
                first.screenX, first.screenY,
                first.clientX, first.clientY, false,
                false, false, false, 0/*left*/, null);

            first.target.dispatchEvent(simulatedEvent);
        }

        function init () {
            // console.log('convert touch to mouse');
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
    initTicker () {
        // ticker刷新舞台
        const ticker = new Hilo.Ticker(60)
        ticker.addTick(this.stage)
        ticker.addTick(Hilo.Tween)
        ticker.start()
        return ticker
    }
    initTitle () {
        let fontSize = 48
        if (this.title.length > 18) { fontSize = Math.floor(900 / this.title.length) }
        const title = new GameText({
            text: this.title,
            reTextWidth: 900,
            fontSize,
            lineHeight: fontSize,
            bold: true,
            color: '#fff',
            y: 20
        })
        title.x = (900 - this.title.length * fontSize) / 2

        const container = new Hilo.Container({
            width: 900,
            height: 80,
            y: 75,
            x: (this.stage.width - 900) / 2 - 10,
            children: [title],
        }).addTo(this.stage)

        return container
    }

    initScene () {
        const question = this.data.map((item, index) => {
            // 左右题
            const lText = new GameText({
                text: item.l, color: '#fff', bold: true, fontSize: 40, lineHeight: 40, id: "l",
                y: 27, textAlign: 'center', reTextWidth: 608
            })
            const rText = new GameText({
                text: item.r, color: '#fff', bold: true, fontSize: 40, lineHeight: 40, id: "r",
                y: 27, textAlign: 'center', reTextWidth: 608
            })
            const lBg = this.getSourceBitmap('textBg', { id: 'lBg' })
            const rBg = this.getSourceBitmap('textBg', { id: 'rBg' })
            // lText.width = lText.textWidth
            // lText.x = (608-lText.realWidth)/2
            // console.log(lText.width)
            // rText.width = rText.textWidth
            // rText.x = (608-rText.realWidth)/2

            const lContainer = new Hilo.Container({
                id: 'lContainer', children: [lBg, lText], width: 608, height: 94, x: 0
            })
            const rContainer = new Hilo.Container({
                id: 'rContainer', children: [rBg, rText], width: 608, height: 94, x: 790
            })

            // 答案
            const answer = new GameText({
                text: '', color: '#fff', bold: false, fontSize: 40, lineHeight: 40, id: "answer",
                y: 26, textAlign: 'center', reTextWidth: 132, fontFamily: 'Futura'
            })
            const yellow = this.getSourceBitmap('symbolYellow', { id: 'yellow', y: -1 })
            const yellowGreen = this.getSourceBitmap('symbolYellowGreen', { id: 'yellowGreen', y: -1, visible: false })
            const green = this.getSourceBitmap('symbolGreen', { id: 'green', y: -1, visible: false })
            const red = this.getSourceBitmap('symbolRed', { id: 'red', y: -1, visible: false })
            const answerContainer = new Hilo.Container({
                id: 'answerContainer', children: [yellow, yellowGreen, green, red, answer], width: 132, height: 92,
                x: 632
            })
            this.myAnswerList.push(answerContainer)


            const container = new Hilo.Container({
                children: [lContainer, answerContainer, rContainer], width: 132, height: 92,
                x: 0, y: index * 110 + 40,
            })
            return container
        })

        const container = new Hilo.Container({
            children: [...question], width: 1400, height: 120 * this.data.length,
            x: (this.stage.width - 1400) / 2, y: (this.stage.height - 120 * this.data.length) / 2 - 160 / this.data.length
        }).addTo(this.stage)
    }

    initOption () {
        const option = ['>', '<', '≧', '≦', '=', '≈']
        this.symbolList = option.map((item, index) => {
            const text = new GameText({
                text: item, color: '#fff', bold: false, fontSize: 40, lineHeight: 40, id: "symbol",
                y: 26, textAlign: 'center', reTextWidth: 132, fontFamily: 'Futura'
            })
            const bg = this.getSourceBitmap('symbolBrown', { id: 'symbolBrown', y: -1 })
            const container = new Hilo.Container({
                id: index, children: [bg, text], width: 132, height: 92, x: index * 253 - 50, background: 'yellow',
            })
            return container
        })
        const tip = new GameText({
            text: '请选择以下符号进行填空',
            fontSize: 35, x: -50, y: -40, color: 'red'
        })
        const container = new Hilo.Container({
            children: [...this.symbolList, tip], width: 1300, height: 100,
            x: (this.stage.width - 1300) / 2,
            y: this.stage.height / 2 + 120 / 2 * this.data.length + 50 / this.data.length,
        }).addTo(this.stage)
    }


    initButton () {
        this.submit = this.getSourceBitmap('submit', {
            x: 800, y: 970, visible: false
        })
        this.restart = this.getSourceBitmap('restart', {
            x: 1100, y: 970, visible: false
        })
        this.result = this.getSourceBitmap('result', {
            x: 500, y: 970, visible: false
        })

        this.stage.addChild(this.submit, this.restart, this.result)
    }



    initResultTip (data) {
        const id = data ? 'wright' : 'wrong'
        const tip = this.getSourceBitmap(id).addTo(this.stage)
        this.ticker.timeout(() => {
            this.stage.removeChild(tip)
        }, 2000)
    }

    getSourceBitmap (id, properties) {
        return new Hilo.Bitmap({ image: this.quene.get(id).content, rect: this.quene.get(id).rect, ...properties })
    }
}