import Hilo from 'hilojs'
import source from '~/static/source.json'
import GameText from "./text"

function randomArr(arr) {
    return arr.sort(() => 0.5 - Math.random())
}

export default class InitGame {
    constructor({ container, configData, callback = () => {} }) {
        // 数据处理
        this.container = container
        if (!configData) {
            return false
        }
        this.title = configData.title
        this.tableData = configData.data
        this.subList = []
        this.tableData.forEach((item, index) => {
            item.sub.forEach((s, i) => {
                this.subList.push({
                    text: s,
                    parentId: `class${index}`
                })
            })
        })
        this.subList = randomArr(this.subList)
        this.callback = callback


        // 资源下载
        this.quene = this.loadQuene(() => {


            // 场景处理
            this.stage = this.initStage(true)
            this.ticker = this.initTicker()

            this.initTitle()
            this.initClass()
            this.initSubClass()




            // 事件处理



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

        if (Hilo.event.POINTER_START == "touchstart") {
            stage.enableDOMEvent('mousedown', true)
            stage.enableDOMEvent('mousemove', true)
            stage.enableDOMEvent('mouseup', true)
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
        let fontSize = 58
        if (this.title.length > 8) { fontSize = Math.floor(420 / this.title.length) }
        const title = new GameText({
                text: this.title,
                fontSize,
                height: fontSize,
                bold: true,
                color: '#fff',
                textAlign: 'center',
                reTextWidth: 500,
                y: (80 - fontSize) / 2
                    // background:'#ccc'
            })
            // title.width=title.textWidth

        const container = new Hilo.Container({
            width: 500,
            height: 80,
            y: 40,
            x: (this.stage.width - 500) / 2,
            children: [title],
            // background:'#ccc'
        }).addTo(this.stage)

        return container
    }

    initClass() {
        const length = this.tableData.length
        const height = (this.stage.height - length * 110)
        const space = height / length / 5 * 2
        const classContainer = new Hilo.Container({
            width: 350,
            height: this.stage.height,
            x: 300,
            y: (height - space) / 2
        })

        const classNameList = this.classNameList = this.tableData.map((item, index) => {
            const classNameBg = this.getSourceBitmap('imgClass')

            let fontSize = 40
            if (item.className.length > 8) { fontSize = Math.floor(classNameBg.width / item.className.length) }
            const text = new GameText({
                text: item.className,
                color: '#fff',
                fontSize,
                lineHeight: fontSize,
                bold: true,
                textAlign: 'center',
                reTextWidth: classNameBg.width,
                y: (classNameBg.height - fontSize) / 2
            })
            const container = new Hilo.Container({
                id: `class${index}`,
                children: [classNameBg, text],
                y: index * (110 + space),
            })
            container.width = classNameBg.width
            container.height = classNameBg.height
            return container
        })
        classContainer.addChild(...classNameList).addTo(this.stage)
    }

    initSubClass() {
        const subClassList = []
        const count = 5
        const line = Math.ceil(this.subList.length / count)
        const padding = (this.stage.height - line * 110) / 2
        this.subList.forEach((item, index) => {
            const subClassBg = this.getSourceBitmap('imgSub')
            let fontSize = 30
            if (item.text.length > 8) { fontSize = Math.floor(subClassBg.width / item.text.length) }
            const text = new GameText({
                text: item.text,
                color: '#000',
                fontSize,
                lineHeight: fontSize,
                textAlign: 'center',
                reTextWidth: subClassBg.width,
                y: (subClassBg.height - fontSize) / 2
            })
            const container = new Hilo.Container({
                children: [subClassBg, text],
                x: 750 + (index % count) * 210,
                y: padding + Math.floor(index / count) * 110
            })
            container.width = subClassBg.width
            container.height = subClassBg.height
            container.parentId = item.parentId
            container.originX = container.x
            container.originY = container.y

            Hilo.util.copy(container, Hilo.drag)
            container.startDrag([0, 0, 1920, 1080])

            subClassList.push(container)

            // 拖动事件
            if (Hilo.event.POINTER_MOVE == "touchmove") {
                container.on('mousemove', e => {
                    this.classNameList.forEach((name, nameIndex) => {
                        if (name.hitTestObject(container)) {
                            name.scaleX = 1.2
                            name.scaleY = 1.2
                            name.pivotX = name.x + (name.getScaledWidth() - name.width) / 2
                        } else {
                            name.scaleX = 1
                            name.scaleY = 1
                            name.pivotX = name.x
                                // name.pivotY=name.y
                        }
                    })
                })
            }

            container.on(Hilo.event.POINTER_MOVE, e => {
                this.classNameList.forEach((name, nameIndex) => {
                    if (name.hitTestObject(container)) {
                        name.scaleX = 1.2
                        name.scaleY = 1.2
                        name.pivotX = name.x + (name.getScaledWidth() - name.width) / 2
                    } else {
                        name.scaleX = 1
                        name.scaleY = 1
                        name.pivotX = name.x
                            // name.pivotY=name.y
                    }
                })
            })

            if (Hilo.event.POINTER_END == "touchend") {
                container.on('mouseup', e => {
                    let isRight = false
                    this.classNameList.forEach((name, nameIndex) => {
                        if (name.hitTestObject(container)) {
                            if (container.parentId === name.id) {
                                isRight = true
                                container.visible = false
                                item.isComplete = true
                            } else {
                                Hilo.Tween.to(name, { x: name.x + 50 }, { duration: 80, reverse: true, ease: Hilo.Ease.Quad.EaseIn })
                            }
                        }
                        name.scaleX = 1
                        name.scaleY = 1
                        name.pivotX = name.x
                    })
                    if (!isRight) {
                        Hilo.Tween.to(container, { x: container.originX, y: container.originY }, { duration: 100, ease: Hilo.Ease.Quad.EaseIn })
                    }
                    const isComplete = this.subList.every(subClassItem => subClassItem.isComplete)
                    if (isComplete) { this.callback(this, isComplete) }
                })
            }

            container.on(Hilo.event.POINTER_END, e => {
                let isRight = false
                this.classNameList.forEach((name, nameIndex) => {
                    if (name.hitTestObject(container)) {
                        if (container.parentId === name.id) {
                            isRight = true
                            container.visible = false
                            item.isComplete = true
                        } else {
                            Hilo.Tween.to(name, { x: name.x + 50 }, { duration: 80, reverse: true, ease: Hilo.Ease.Quad.EaseIn })
                        }
                    }
                    name.scaleX = 1
                    name.scaleY = 1
                    name.pivotX = name.x
                })
                if (!isRight) {
                    Hilo.Tween.to(container, { x: container.originX, y: container.originY }, { duration: 100, ease: Hilo.Ease.Quad.EaseIn })
                }
                const isComplete = this.subList.every(subClassItem => subClassItem.isComplete)
                if (isComplete) { this.callback(this, isComplete) }
            })
        })

        this.stage.addChild(...subClassList)
    }





    getSourceBitmap(id, properties) {
        return new Hilo.Bitmap({ image: this.quene.get(id).content, rect: this.quene.get(id).rect, ...properties })
    }
}