import Hilo, { Matrix } from 'hilojs'
import source from '~/static/source.json'
import GameText from "./text"

function randomArr (arr) {
    return arr.sort(() => 0.5 - Math.random())
}
function getTime (time = 0) {
    let m = Math.floor(time / 60) + ''
    m = m.padStart(2, '0')
    let s = time % 60 + ''
    s = s.padStart(2, '0')
    return `${m} : ${s}`
}


export default class InitGame {
    constructor ({ container, configData, callback = () => { } }) {
        this.container = container
        if (!configData) {
            return false
        }
        // 数据处理
        this.isWaiting = false
        this.title = configData.title
        this.col = configData.col
        this.row = configData.row
        this.list = configData.list
        this.answer = this.list.map(item => `img-${item.id}`).join('__')
        this.randomList = randomArr(JSON.parse(JSON.stringify(this.list)))
        this.imgList = []
        this.miniImg = {
            width: 200, height: 200, isXcenter: true, oWidth: 200, oHeight: 200,

        }
        this.rightImg = {
            width: 200, height: 150
        }
        this.imgContainer = {
            width: 800,
            height: 500
        }

        this.timeCount = 0
        this.timeStart = true

        const mImg = new Image()
        mImg.src = this.list[0].src






        // 资源下载
        this.quene = this.loadQuene(() => {
            this.miniImg.oHeight = mImg.height
            this.miniImg.oWidth = mImg.width

            // 以高度为标准计算
            this.miniImg.height = this.imgContainer.height / this.row
            this.miniImg.width = mImg.width * (this.miniImg.height / mImg.height)
            if (this.miniImg.width * this.col > this.imgContainer.width) {
                // 以宽度为标准计算
                this.miniImg.width = this.imgContainer.width / this.col
                this.miniImg.height = mImg.height * (this.miniImg.width / mImg.width)
                this.miniImg.isXcenter = true
            }

            // 右侧图片宽高
            if (this.miniImg.oWidth > this.miniImg.oHeight) {
                this.rightImg.height = (this.rightImg.width / this.miniImg.oWidth) * this.miniImg.oHeight
            } else {
                this.rightImg.width = (this.rightImg.height / this.miniImg.oHeight) * this.miniImg.oWidth
            }


            // 场景处理
            this.stage = this.initStage(true)
            this.ticker = this.initTicker()

            this.initTitle()
            this.initClock()
            this.initButton()
            this.initAnswerList()
            this.initImgListContainer()
            this.initBgList()
            this.initImgList()




            // 事件处理 
            this.submit.on(Hilo.event.POINTER_END, e => {
                if (this.isWaiting) { return false }
                this.isWaiting = true

                // 停止计时
                this.timeStart = false
                this.timeCount = -1

                const myAnswer = this.gridList.map(item => item.imgId || '').join('__')
                this.initResultTip(this.answer === myAnswer)

                this.submit.visible = false
                this.restart.visible = true

                // 停止拖拽
                this.imgList.forEach(item => { item.stopDrag() })

                this.changeIsWaiting()
            })
            this.restart.on(Hilo.event.POINTER_END, e => {
                if (this.isWaiting) { return false }
                this.isWaiting = true

                // 开始计时
                this.timeCount = -1
                this.timeStart = true

                this.submit.visible = true
                this.restart.visible = false

                this.resetImgList()
                this.resetImgBgList()
                this.resetRandomList(true)
                this.resetGridList()

                this.initImgList()

                this.changeIsWaiting()
            })
            this.result.on(Hilo.event.POINTER_END, e => {
                if (this.isWaiting) { return false }
                this.isWaiting = true

                // 停止计时
                this.timeStart = false
                this.timeCount = -1

                this.question.visible = true
                this.submit.visible = false
                this.restart.visible = false
                this.result.visible = false

                this.resetImgList()
                this.resetImgBgList()
                this.resetRandomList()
                this.resetGridList(true, true)

                this.changeIsWaiting()
            })
            this.question.on(Hilo.event.POINTER_END, e => {
                if (this.isWaiting) { return false }
                this.isWaiting = true

                // 开始计时
                this.timeCount = -1
                this.timeStart = true

                this.question.visible = false
                this.submit.visible = true
                this.restart.visible = false
                this.result.visible = true

                this.resetGridList(true, false)
                this.initImgList()

                this.changeIsWaiting()
            })
            this.arrowDown.on(Hilo.event.POINTER_END, e => {
                if (!this.submit.visible) { return false }
                if (this.isWaiting) { return false }
                this.isWaiting = true
                this.renderNext('down')
                this.changeIsWaiting()
            })
            this.arrowUp.on(Hilo.event.POINTER_END, e => {
                if (!this.submit.visible) { return false }
                if (this.isWaiting) { return false }
                this.isWaiting = true
                this.renderNext('up')
                this.changeIsWaiting()
            })


            this.ticker.timeout(() => {
                this.ticker.nextTick(() => {
                    callback(this)
                })
            }, 500)

        })


    }
    changeIsWaiting (time = 250) {
        this.ticker.timeout(() => {
            this.isWaiting = false
        }, time)
    }

    resetImgList () {
        this.imgList.forEach(item => { this.stage.removeChild(item) })
        this.imgList = []
    }
    resetImgBgList () {
        this.imgBgList.forEach(item => item.imgId = null)
    }
    resetRandomList (isRandom) {
        this.randomList.forEach(item => item.isRender = false)
        if (isRandom) { this.randomList = randomArr(this.randomList) }
    }
    resetGridList (isChangeVisible, data) {
        this.gridList.forEach((item, index) => {
            item.imgId = null
            if (isChangeVisible) {
                item.getChildById(`answerImg${index}`).visible = data
            }
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

        function touchHandler (event) {
            if (event.touches.length > 1) { return false }
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
            y: (80 - fontSize) / 2,
            // background:'red'
        })

        const container = new Hilo.Container({
            width: 500,
            height: 80,
            y: 130,
            x: 510,
            children: [title],
            // background:'#ccc'
        }).addTo(this.stage)

        return container
    }
    initResultTip (data) {
        const id = data ? 'right' : 'wrong'
        const tip = this.getSourceBitmap(id).addTo(this.stage)
        this.ticker.timeout(() => {
            this.stage.removeChild(tip)
        }, 2000)
    }

    initClock () {
        // 计时器
        const time = new GameText({
            text: getTime(this.timeCount),
            fontSize: 38,
            bold: true,
            color: '#fff',
            reTextWidth: 240,
            x: 1200, y: 155,
            // background:'red'
        }).addTo(this.stage)
        this.ticker.interval(() => {
            if (this.timeStart) {
                this.timeCount++
                time.text = getTime(this.timeCount)
            }
        }, 1000)
    }

    initButton () {
        this.submit = this.getSourceBitmap('submit', { id: 'submit', y: 880, })
        this.restart = this.getSourceBitmap('restart', { id: 'restart', y: 880, visible: false })
        this.result = this.getSourceBitmap('result', { id: 'result', y: 865, x: 200 })
        this.question = this.getSourceBitmap('question', { id: 'question', y: 865, x: 200, visible: false })
        this.arrowUp = this.getSourceBitmap('arrow-up', { id: 'arrow-up', y: 700, x: 1200 })
        this.arrowDown = this.getSourceBitmap('arrow-down', { id: 'arrow-down', y: 700, x: 1450 })

        this.submit.x = this.getCenterX(this.submit.width)
        this.restart.x = this.getCenterX(this.restart.width)

        this.stage.addChild(this.submit, this.restart, this.result, this.question, this.arrowUp, this.arrowDown)
    }

    getCenterX (w) {
        return (this.stage.width - w) / 2
    }

    getSourceBitmap (id, properties) {
        return new Hilo.Bitmap({ image: this.quene.get(id).content, rect: this.quene.get(id).rect, ...properties })
    }

    initBgList () {
        const w = 200
        const h = 150
        const lineCount = 2
        const paddingX = (600 - (w + 10) * lineCount) / 2
        const paddingY = (380 - (h + 10) * lineCount) / 2
        this.imgBgList = [1, 2, 3, 4].map((item, index) => {
            const bg = new Hilo.Graphics()
            bg.lineStyle(1, "#000").beginFill('#efefef').drawRect(
                0, 0, w, h).endFill()

            const container = new Hilo.Container({
                x: (index % lineCount) * (w + 10) + paddingX + 1060,
                y: (Math.floor(index / lineCount)) * (h + 10) + paddingY + 290,
                id: `bg-${index}`, children: [bg]
            })
            container.imgId = null
            return container
        })

        this.stage.addChild(...this.imgBgList)
    }
    sorting () {
        let bgIndex = 0
        const pX = 100 - this.rightImg.width / 2
        const pY = (75) - this.rightImg.height / 2
        this.imgList.forEach((item, index) => {
            if (item.gridId) { return false }

            const bgItem = this.imgBgList[bgIndex]
            // 图片以前的bg清空 imgId
            this.getStageChild(item.bgId).imgId = null
            item.bgId = bgItem.id
            item.x = bgItem.x + pX
            item.y = bgItem.y + pY
            bgItem.imgId = item.id

            bgIndex++
        })
    }

    renderNext (data) {
        if (this.randomList.length < 4) { return false }

        // 非渲染的数据
        if (!this.randomList.filter(item => !item.isRender)) { return false }

        const bgLength = this.blankBgLength()
        if (!bgLength) { return false }
        const imgId = this.imgBgList[data === 'up' ? 0 : 3].imgId

        let imgIndex
        this.randomList.forEach((item, index) => {
            if (imgId === `img-${item.id}`) {
                imgIndex = index
            }
        })

        if (typeof imgIndex !== 'number') { return false }

        let list = []
        if (data === 'up') {
            list = this.randomList.filter((item, index) => !item.isRender && index < imgIndex).reverse()
        } else {
            list = this.randomList.filter((item, index) => !item.isRender && index > imgIndex)
        }
        if (!list.length) { list = this.randomList.filter((item, index) => !item.isRender) }
        list = list.filter((item, index) => index < 4)
        if (data === 'up') { list.reverse() }
        if (!list.length) { return false }

        this.imgBgList.forEach(item => {
            const bgImg = this.getStageChild(item.imgId)
            if (bgImg) {
                bgImg.bgId = null

                this.imgList = this.imgList.filter(item => item.id !== bgImg.id)
                this.randomList.some(item => {
                    const rule = `img-${item.id}` === bgImg.id
                    if (rule) { item.isRender = false }
                    return rule
                })

                this.stage.removeChild(bgImg)
            }

            item.imgId = null
        })
        this.initImgList(list)
    }


    findBgIndex () {
        let bgIndex
        this.imgBgList.some((item, index) => {
            if (!item.imgId) { bgIndex = index }
            return !item.imgId
        })
        return bgIndex
    }
    blankBgLength () {
        return this.imgBgList.filter(item => item.imgId).length
    }

    removeImgItem (img) {
        this.imgList = this.imgList.filter(item => item.id !== img.id)
        let imgItem = {}
        this.randomList = this.randomList.filter(item => {
            if (`img-${item.id}` === img.id) { imgItem = item }
            return `img-${item.id}` !== img.id
        })
        this.randomList.push({ ...imgItem, isRender: false })
        this.stage.removeChild(img)
    }
    getStageChild (id) {
        return this.stage.getChildById(id)
    }

    initImgList (renderList) {
        let bgIndex = this.findBgIndex()
        const list = renderList || this.randomList.filter((item, index) => !item.isRender).filter((item, index) => index < 4)
        list.map((item, index) => {
            item.isRender = true
            const img = new Hilo.Bitmap({
                image: item.src,
                id: `img-${item.id}`,
                width: this.rightImg.width,
                height: this.rightImg.height,
            })

            img.x = this.imgBgList[bgIndex].x + 100 - this.rightImg.width / 2
            img.y = this.imgBgList[bgIndex].y + (75) - this.rightImg.height / 2
            img.bgId = this.imgBgList[bgIndex].id
            this.imgBgList[bgIndex].imgId = img.id
            bgIndex++

            img.originW = img.width
            img.originH = img.height

            Hilo.util.copy(img, Hilo.drag)
            img.startDrag()

            img.on(Hilo.event.POINTER_START, e => {
                this.stage.removeChild(img)
                this.stage.addChild(img)
            })
            img.on(Hilo.event.POINTER_END, e => {
                const imgX = img.x + img.width / 2
                const imgY = img.y + img.height / 2
                const grid = this.gridList.filter(g => (imgX > g.x && imgX < (g.x + this.miniImg.width)) && (imgY > g.y && imgY < (g.y + this.miniImg.height)))[0]
                const blankBgLength = this.blankBgLength()

                if (!grid && img.gridId && blankBgLength >= 4) {
                    // 格子里移除 右侧无位置 销毁
                    this.getStageChild(img.gridId).imgId = null
                    img.gridId = null
                    this.removeImgItem(img)
                } else if (!grid && img.gridId && blankBgLength < 4) {
                    // 格子里移除 添加到右侧 右侧有位置 直接添加
                    const bgIndex = this.findBgIndex()

                    img.x = this.imgBgList[bgIndex].x + 100 - this.rightImg.width / 2
                    img.y = this.imgBgList[bgIndex].y + (75) - this.rightImg.height / 2
                    img.width = img.originW
                    img.height = img.originH

                    this.imgBgList[bgIndex].imgId = img.id
                    this.getStageChild(img.gridId).imgId = null
                    img.gridId = null
                    img.bgId = this.imgBgList[bgIndex].id
                } else if (!grid && !img.gridId) {
                    // 右侧移除 返回原地
                    const bgItem = this.getStageChild(img.bgId)
                    img.x = bgItem.x + 100 - this.rightImg.width / 2
                    img.y = bgItem.y + (75) - this.rightImg.height / 2
                } else if (grid && !grid.imgId && !img.gridId) {
                    // 右侧移到格子 格子无图
                    img.x = grid.x
                    img.y = grid.y
                    img.width = this.miniImg.width
                    img.height = this.miniImg.height

                    this.getStageChild(img.bgId).imgId = null
                    img.bgId = null
                    img.gridId = grid.id
                    grid.imgId = img.id

                    let next = this.randomList.filter((nextItem, nextIndex) => !nextItem.isRender).filter((nextItem, nextIndex) => nextIndex < 4)

                    if (!next.length) { return false }
                    if (this.blankBgLength() > 0) {
                        // this.initImgList([next[0]])
                    } else {
                        this.sorting()
                        this.initImgList(next)
                    }
                } else if (grid && !grid.imgId && img.gridId) {
                    // 格子移到格子 格子无图
                    img.x = grid.x
                    img.y = grid.y

                    this.getStageChild(img.gridId).imgId = null
                    img.gridId = grid.id
                    grid.imgId = img.id
                } else if (grid && grid.imgId && img.gridId) {
                    // 格子移到格子 格子有图
                    const changeImg = this.getStageChild(grid.imgId)
                    const imgGrid = this.getStageChild(img.gridId)
                    img.x = grid.x
                    img.y = grid.y
                    changeImg.x = imgGrid.x
                    changeImg.y = imgGrid.y

                    img.gridId = grid.id
                    grid.imgId = img.id
                    changeImg.gridId = imgGrid.id
                    imgGrid.imgId = changeImg.id
                } else if (grid && grid.imgId && !img.gridId) {
                    // 右侧移到格子 格子有图
                    // 移到对应格子 两图位置互换
                    const changeImg = this.getStageChild(grid.imgId)
                    const bgItem = this.getStageChild(img.bgId)

                    img.x = grid.x
                    img.y = grid.y
                    img.width = this.miniImg.width
                    img.height = this.miniImg.height

                    changeImg.x = bgItem.x + 100 - changeImg.originW / 2
                    changeImg.y = bgItem.y + (75) - changeImg.originH / 2
                    changeImg.width = changeImg.originW
                    changeImg.height = changeImg.originH

                    img.gridId = grid.id
                    grid.imgId = img.id
                    img.bgId = null

                    changeImg.gridId = null
                    bgItem.imgId = changeImg.id
                    changeImg.bgId = bgItem.id
                }

            })

            this.imgList.push(img)
            return img
        })


        this.stage.addChild(...this.imgList)

    }
    initImgListContainer () {
        const container = new Hilo.Container({
            id: 'imgListContainer',
            background: '#fff',
            // children: imgList,
            width: 600,
            height: 380,
            x: 1060,
            y: 290,
        }).addTo(this.stage)
    }
    initAnswerList () {

        this.gridList = this.list.map((item, index) => {
            const paddingX = this.miniImg.isXcenter ? (this.imgContainer.width - this.col * this.miniImg.width) / 2 : 0
            const paddingY = this.miniImg.isXcenter ? 0 : (this.imgContainer.height - this.col * this.miniImg.height) / 2
            const grid = new Hilo.Graphics()
            grid.lineStyle(1, "#000").beginFill('#fff').drawRect(
                0, 0, this.miniImg.width, this.miniImg.height).endFill()

            const answerImg = new Hilo.Bitmap({
                id: `answerImg${index}`,
                image: item.src,
                width: this.miniImg.width,
                height: this.miniImg.height,
                visible: false
            })

            const gridContainer = new Hilo.Container({
                x: (item.col) * this.miniImg.width + paddingX + 240,
                y: (item.row) * this.miniImg.height + paddingY + 290,
                id: item.id,
                children: [grid, answerImg]
            })
            return gridContainer
        })

        const container = new Hilo.Container({
            id: 'answerContainer',
            // background: '#ccc',
            // children: gridList,
            width: this.imgContainer.width,
            height: this.imgContainer.height,
            x: 240,
            y: 290
        })

        this.stage.addChild(container, ...this.gridList)
    }
}