import Hilo from 'hilojs'
import PausedCard from '../components/paused-card'
import confuseAnswers from '../utils/confuseAnswers'
import { fontFamily, gameWidth, gameHeight } from '../utils/constants'
import formatTime from '../utils/formatTime'
import getRandomInt from '../utils/getRandomNum'

const hideVelocity = 20
const MONSTER_HEIGHT = 380
const MONSTER_GAP = 40

const PlayingScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor(properties) {
        PlayingScene.superclass.constructor.call(this, properties)
        this.init(properties)

        this.duration = properties.config.duration
        this.properties = properties
    },

    properties: null,

    velocity: 0, // 加速度

    state: 'over', // 游戏状态：playing / paused / over
    // monsterVisibleList: null, // 怪物隐藏标记

    pausedCard: null,

    duration: 0, // 游戏持续秒数
    startTimestamp: 0, // 游戏开始时间
    pausedSeconds: 0, // 弥补暂停时间
    pausedTimestamp: 0, // 游戏暂停时间
    continueTimestamp: 0, // 游戏继续时间
    countdown: 0, // 倒计时秒

    leftScore: 0, // 左边得分
    leftCorrectCount: 0, // 左边累计答对次数
    leftErrorCount: 0, // 左边累计答错次数
    leftCombo: 0, // 左边连击次数
    leftMaxCombo: 0, // 左边最高连击次数
    leftRecords: [],

    rightScore: 0, // 右边得分
    rightCorrectCount: 0, // 右边累计答对次数
    rightErrorCount: 0, // 右边累计答错次数
    rightCombo: 0, // 右边连击次数
    rightMaxCombo: 0, // 右边最高连击次数
    rightRecords: [],

    onUpdate() {
        // if (this.state === 'playing' && !this.hasMonsterInView()) {
        //   this.gameOver()
        // }
        if (this.state === 'over') {
            this.countdown = 0
        } else if (this.state === 'playing') {
            this.countdown = this.duration + this.pausedSeconds - Math.floor((+new Date() - this.startTimestamp) / 1000)
                // console.log('countdown: ' + this.countdown)
            if (this.countdown <= 0) {
                this.gameOver(true)
            }
        }
    },

    // hasMonsterInView() {
    //   if (this.monsterVisibleList === null) {
    //     return false
    //   }
    //   // console.log(this.monsterVisibleList)
    //
    //   return some(this.monsterVisibleList, (visible) => visible)
    // },

    gameOver(timeIsOut = true) {
        this.fire(timeIsOut ? 'time-is-up' : 'game-over', {
            leftScore: this.leftScore, // 左边得分
            leftCorrectCount: this.leftCorrectCount, // 左边累计答对次数
            leftErrorCount: this.leftErrorCount, // 左边累计答错次数
            leftCombo: this.leftCombo, // 左边连击次数
            leftRecords: this.leftRecords,
            leftMaxCombo: this.leftMaxCombo, // 左边最高连击次数
            rightScore: this.rightScore, // 右边得分
            rightCorrectCount: this.rightCorrectCount, // 右边累计答对次数
            rightErrorCount: this.rightErrorCount, // 右边累计答错次数
            rightCombo: this.rightCombo, // 右边连击次数
            rightMaxCombo: this.rightMaxCombo, // 右边最高连击次数
            rightRecords: this.rightRecords,
        })
        this.state = 'over'
    },

    init(properties) {
        const { assets, config } = properties

        this.createMonsters(properties)

        // 顶部
        const topBanner = new Hilo.Bitmap({
            image: assets.getContent('playing-top-banner'),
        }).addTo(this)
        const pause = new Hilo.Bitmap({
            image: assets.getContent('pause'),
        }).addTo(this)
        const subjectText = new Hilo.Text({
            font: 'bold 50px ' + fontFamily,
            text: config.subject,
            textAlign: 'center',
            color: '#ffffff',
            lineSpacing: 0,
            width: 500,
            maxWidth: 500,
            height: 60,
        }).addTo(this)
        const timeText = new Hilo.Text({
            font: 'bold 39px ' + fontFamily,
            text: '00 : 00',
            textAlign: 'center',
            color: '#ffffff',
            lineSpacing: 0,
            width: 180,
            height: 60,
            onUpdate: function() {
                this.text = formatTime(this.parent.countdown)
            },
        }).addTo(this)

        // 左边得分
        const leftBanner = new Hilo.Bitmap({
            image: assets.getContent('playing-left-banner'),
        }).addTo(this)
        const leftScore = new Hilo.Text({
            font: 'bold 52px ' + fontFamily,
            text: '0',
            textAlign: 'center',
            color: '#ffffff',
            lineSpacing: 0,
            width: 250,
            height: 60,
            onUpdate: function() {
                this.text = this.parent.leftScore
            },
        }).addTo(this)

        // 右边得分
        const rightBanner = new Hilo.Bitmap({
            image: assets.getContent('playing-right-banner'),
        }).addTo(this)
        const rightScore = new Hilo.Text({
            font: 'bold 52px ' + fontFamily,
            text: '0',
            textAlign: 'center',
            color: '#ffffff',
            lineSpacing: 0,
            width: 250,
            height: 60,
            onUpdate: function() {
                this.text = this.parent.rightScore
            },
        }).addTo(this)

        const pausedCard = new PausedCard({
            id: 'pausedCard',
            assets,
        }).addTo(this)

        topBanner.x = gameWidth / 2 - topBanner.width / 2
        topBanner.y = 35
        pause.x = topBanner.x + 430
        pause.y = topBanner.y + 146
        subjectText.x = topBanner.x + 146
        subjectText.y = topBanner.y + 60
        timeText.x = topBanner.x + 252
        timeText.y = topBanner.y + 154

        pausedCard.x = 612
        pausedCard.y = 323.5

        leftBanner.x = 83
        leftBanner.y = 64
        leftScore.x = leftBanner.x + 80
        leftScore.y = leftBanner.y + 40

        rightBanner.x = gameWidth - rightBanner.width - 83
        rightBanner.y = 64
        rightScore.x = rightBanner.x
        rightScore.y = rightBanner.y + 54

        // 事件
        pause.on(Hilo.event.POINTER_START, (e) => {
            this.pausedTimestamp = +new Date()
            console.log(e.eventTarget, e.stageX, e.stageY)
            this.state = 'paused'
            pausedCard.show()
        })
        pausedCard.on('reset', () => {
            this.fire('restart')
        })
        pausedCard.on('continue', () => {
            this.continueTimestamp = +new Date()
                // 弥补暂停时间
            this.pausedSeconds += Math.round((this.continueTimestamp - this.pausedTimestamp) / 1000)
            this.state = 'playing'
        })
    },

    getMonsterY(level) {
        // 初始Y座标 - 移动的秒数*每秒移动距离 = 现在的Y
        return (gameHeight + level * (MONSTER_HEIGHT + MONSTER_GAP)) - ((+new Date() - this.startTimestamp) / 1000 - this.pausedSeconds) * this.velocity
    },

    /**
     * 创建怪兽们~
     * @param properties
     */
    createMonsters(properties) {
        const { config, assets } = properties
        const orangeOptions = confuseAnswers(config)
        const greenOptions = confuseAnswers(config)
            // this.monsterVisibleList = Array(options.length * 2).fill(true)

        const count = orangeOptions.length

        // 每秒移动距离
        this.velocity = (gameHeight + count * MONSTER_HEIGHT + (count - 1) * MONSTER_GAP) / (config.duration)

        for (let i = 0; i < orangeOptions.length; i++) {
            const option = orangeOptions[i]
            option.orangeClicked = false
            const orangeMonster = new Hilo.Bitmap({
                id: 'orange-monster-' + i,
                image: assets.getContent('orangeBalloonMonster'),
                onUpdate: function() {
                    if (this.parent.state !== 'playing') return
                    if (this.y > -this.height) {
                        this.y = this.parent.getMonsterY(i)
                    } else if (this.y <= -this.height) {
                        // this.parent.monsterVisibleList[i] = false
                    }
                },
            }).addTo(this)

            const orangeText = new Hilo.Text({
                font: 'bold 47px ' + fontFamily,
                text: option.text,
                textAlign: 'center',
                color: '#ffffff',
                lineSpacing: 0,
                width: 178,
                height: 60,
                onUpdate: function() {
                    if (this.parent.state !== 'playing') return
                    if (this.y > -this.height) {
                        this.y = this.parent.getMonsterY(i) + 60
                            // this.y -= velocity
                    }
                },
            }).addTo(this)

            // 自适应字体大小
            var maxHeight = orangeText.height / 2
            for (let i = 36; i < 100; i++) {
                if (orangeText.height > maxHeight) {
                    orangeText.textHeight = i - 2
                    orangeText._fontHeight = i - 2
                    orangeText.font =
                        'normal bold ' +
                        (i - 2) +
                        'px/' +
                        (i - 2) +
                        'px Helvetica Neue, Helvetica, Arial, Microsoft Yahei,Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif'
                    orangeText.textHeight = i - 2
                    orangeText._fontHeight = i - 2
                    orangeText.font =
                        'normal bold ' +
                        (i - 2) +
                        'px/' +
                        (i - 2) +
                        'px Helvetica Neue, Helvetica, Arial, Microsoft Yahei,Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif'
                    break
                } else {
                    orangeText.textHeight = i
                    orangeText._fontHeight = i
                    orangeText.font =
                        'normal bold ' +
                        i +
                        'px/' +
                        i +
                        'px Helvetica Neue, Helvetica, Arial, Microsoft Yahei,Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif'
                }
            }

            const orangeUpMonster = new Hilo.Bitmap({
                id: 'orange-up' + i,
                image: assets.getContent('orange-up-monster'),
                onUpdate: function() {
                    if (this.parent.state !== 'playing') return
                    if (this.y > -this.height) {
                        if (!option.orangeClicked) {
                            this.y = this.parent.getMonsterY(i)
                        } else {
                            this.y -= hideVelocity
                        }
                    }
                },
                visible: false,
            }).addTo(this)

            const orangeUpText = new Hilo.Text({
                font: 'bold 47px ' + fontFamily,
                textAlign: 'center',
                color: '#d35352',
                lineSpacing: 0,
                width: 120,
                height: 60,
                onUpdate: function() {
                    if (this.parent.state !== 'playing') return
                    if (this.y > -this.height) {
                        if (!option.orangeClicked) {
                            this.y = this.parent.getMonsterY(i) + 176
                        } else {
                            this.y -= hideVelocity
                        }
                    }
                },
                visible: false,
            }).addTo(this)

            const orangeDownMonster = new Hilo.Bitmap({
                id: 'orange-down' + i,
                image: assets.getContent('orange-down-monster'),
                onUpdate: function() {
                    if (this.parent.state !== 'playing') return
                    if (option.orangeClicked && this.y < gameHeight) {
                        this.y += hideVelocity
                    }
                    if (!option.orangeClicked && this.y > -this.height) {
                        this.y = this.parent.getMonsterY(i)
                    }
                },
                visible: false,
            }).addTo(this)

            const orangeBlowup = new Hilo.Bitmap({
                id: 'orange-blowup' + i,
                image: assets.getContent('orange-blowup'),
                onUpdate: function() {
                    if (this.parent.state !== 'playing') return
                    if (!option.orangeClicked) {
                        if (this.y > -this.height) {
                            this.y = this.parent.getMonsterY(i)
                        }
                    }
                },
                visible: false,
            }).addTo(this)

            // 每排1个，x轴随机，两边位置一致
            // o-- o--
            // -o- -o-
            // --o --o
            // const position = i % 3
            // const level = Math.floor(i / 3)
            // // 173为气球怪兽宽度；138为左侧间隔
            // orangeMonster.x = 160 + position * 173
            // // 58为两个气球的垂直间隔
            // orangeMonster.y = i * 58 + level * 200
            //
            // // 右侧怪兽排列
            // greenMonster.x = 160 + gameWidth / 2 + position * 218
            // greenMonster.y = i * 58

            const level = i // 每行一个
                // 173为气球怪兽宽度
            const orangeRandomX = getRandomInt(173 + 10, gameWidth / 2 - (173 + 10))

            // MONSTER_HEIGHT为气球怪兽高度，150为每行间隔高度
            const monsterY = gameHeight + level * (MONSTER_HEIGHT + MONSTER_GAP)

            // 简化排列
            // const position = i % 3
            // const level = Math.floor(i / 3)
            // 173为气球怪兽宽度；126为左侧间隔；100为气球间距
            // orangeMonster.x = 126 + position * (173 + 100)
            orangeMonster.x = orangeRandomX
            orangeMonster.y = monsterY
            orangeText.x = orangeMonster.x
            orangeText.y = orangeMonster.y + 60
            orangeUpMonster.x = orangeMonster.x
            orangeUpMonster.y = orangeMonster.y
            orangeUpText.x = orangeUpMonster.x + 38
            orangeUpText.y = orangeUpMonster.y + 176
            orangeDownMonster.x = orangeMonster.x
            orangeDownMonster.y = orangeMonster.y
            orangeBlowup.x = orangeMonster.x
            orangeBlowup.y = orangeMonster.y

            orangeMonster.on(Hilo.event.POINTER_START, () => {
                this.clickOrangeMonster(
                    option,
                    orangeMonster,
                    orangeText,
                    orangeUpMonster,
                    orangeUpText,
                    orangeDownMonster,
                    orangeBlowup,
                )
            })
            orangeText.on(Hilo.event.POINTER_START, () => {
                this.clickOrangeMonster(
                    option,
                    orangeMonster,
                    orangeText,
                    orangeUpMonster,
                    orangeUpText,
                    orangeDownMonster,
                    orangeBlowup,
                )
            })
        }

        for (let i = 0; i < greenOptions.length; i++) {
            const option = greenOptions[i]
            option.greenClicked = false
            const greenMonster = new Hilo.Bitmap({
                id: 'green-monster-' + i,
                image: assets.getContent('greenBalloonMonster'),
                onUpdate: function() {
                    if (this.parent.state !== 'playing') return
                    if (this.y > -this.height) {
                        this.y = this.parent.getMonsterY(i)
                    } else if (this.y <= -this.height) {
                        // this.parent.monsterVisibleList[options.length + i] = false
                    }
                },
            }).addTo(this)

            const greenText = new Hilo.Text({
                font: 'bold 47px ' + fontFamily,
                text: option.text,
                textAlign: 'center',
                color: '#ffffff',
                lineSpacing: 0,
                width: 178,
                height: 60,
                onUpdate: function() {
                    if (this.parent.state !== 'playing') return
                    if (this.y > -this.height) {
                        this.y = this.parent.getMonsterY(i) + 60
                    }
                },
            }).addTo(this)

            var maxHeight = greenText.height / 2
            for (let i = 36; i < 100; i++) {
                if (greenText.height > maxHeight) {
                    greenText.textHeight = i - 2
                    greenText._fontHeight = i - 2
                    greenText.font =
                        'normal bold ' +
                        (i - 2) +
                        'px/' +
                        (i - 2) +
                        'px Helvetica Neue, Helvetica, Arial, Microsoft Yahei,Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif'
                    greenText.textHeight = i - 2
                    greenText._fontHeight = i - 2
                    greenText.font =
                        'normal bold ' +
                        (i - 2) +
                        'px/' +
                        (i - 2) +
                        'px Helvetica Neue, Helvetica, Arial, Microsoft Yahei,Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif'
                    break
                } else {
                    greenText.textHeight = i
                    greenText._fontHeight = i
                    greenText.font =
                        'normal bold ' +
                        i +
                        'px/' +
                        i +
                        'px Helvetica Neue, Helvetica, Arial, Microsoft Yahei,Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif'
                }
            }

            const greenUpMonster = new Hilo.Bitmap({
                id: 'green-up' + i,
                image: assets.getContent('green-up-monster'),
                onUpdate: function() {
                    if (this.parent.state !== 'playing') return
                    if (this.y > -this.height) {
                        if (!option.greenClicked) {
                            this.y = this.parent.getMonsterY(i)
                        } else {
                            this.y -= hideVelocity
                        }
                    }
                },
                visible: false,
            }).addTo(this)

            const greenUpText = new Hilo.Text({
                font: 'bold 47px ' + fontFamily,
                textAlign: 'center',
                color: '#d35352',
                lineSpacing: 0,
                width: 120,
                height: 60,
                onUpdate: function() {
                    if (this.parent.state !== 'playing') return
                    if (this.y > -this.height) {
                        if (!option.greenClicked) {
                            this.y = this.parent.getMonsterY(i) + 176
                        } else {
                            this.y -= hideVelocity
                        }
                    }
                },
                visible: false,
            }).addTo(this)

            const greenDownMonster = new Hilo.Bitmap({
                id: 'green-down' + i,
                image: assets.getContent('green-down-monster'),
                onUpdate: function() {
                    if (this.parent.state !== 'playing') return
                    if (option.greenClicked && this.y < gameHeight) {
                        this.y += hideVelocity
                    }
                    if (!option.greenClicked && this.y > -this.height) {
                        this.y = this.parent.getMonsterY(i)
                    }
                },
                visible: false,
            }).addTo(this)

            const greenBlowup = new Hilo.Bitmap({
                id: 'green-blowup' + i,
                image: assets.getContent('green-blowup'),
                onUpdate: function() {
                    if (this.parent.state !== 'playing') return
                    if (!option.greenClicked) {
                        if (this.y > -this.height) {
                            this.y = this.parent.getMonsterY(i)
                        }
                    }
                },
                visible: false,
            }).addTo(this)

            const level = i // 每行一个
            const greenRandomX = getRandomInt(173 + 10, gameWidth / 2 - (173 + 10))
                // MONSTER_HEIGHT为气球怪兽高度，150为每行间隔高度
            const monsterY = gameHeight + level * (MONSTER_HEIGHT + MONSTER_GAP)

            // 右侧怪兽排列
            // greenMonster.x = 126 + gameWidth / 2 + position * (173 + 100)
            greenMonster.x = gameWidth / 2 + greenRandomX
            greenMonster.y = monsterY
            greenText.x = greenMonster.x
            greenText.y = greenMonster.y + 60
            greenUpMonster.x = greenMonster.x
            greenUpMonster.y = greenMonster.y
            greenUpText.x = greenUpMonster.x + 38
            greenUpText.y = greenUpMonster.y + 176
            greenDownMonster.x = greenMonster.x
            greenDownMonster.y = greenMonster.y
            greenBlowup.x = greenMonster.x
            greenBlowup.y = greenMonster.y

            greenMonster.on(Hilo.event.POINTER_START, () => {
                this.clickGreenMonster(
                    option,
                    greenMonster,
                    greenText,
                    greenUpMonster,
                    greenUpText,
                    greenDownMonster,
                    greenBlowup,
                )
            })
            greenText.on(Hilo.event.POINTER_START, () => {
                this.clickGreenMonster(
                    option,
                    greenMonster,
                    greenText,
                    greenUpMonster,
                    greenUpText,
                    greenDownMonster,
                    greenBlowup,
                )
            })
        }

        // this.resetPosition()
    },

    // resetPosition() {
    //   console.log(this.getChildById('orange-right-0'))
    // },

    clickOrangeMonster(
        option,
        orangeText,
        orangeMonster,
        orangeUpMonster,
        orangeUpText,
        orangeDownMonster,
        orangeBlowup,
    ) {
        if (this.state !== 'playing') {
            return
        }
        if (option.orangeClicked) {
            return
        }
        const right = option.right

        // 每答对一次+10分，答错一次-5分 ；如果连续答对3道题时，第三道+12分
        const currentScore = !right ? -5 : this.leftCombo >= 3 ? 12 : 10

        option.orangeClicked = true
        orangeText.visible = false
        orangeMonster.visible = false
        if (right) {
            orangeUpMonster.visible = true
            orangeUpText.text = `+ ${currentScore} 分`
            orangeUpText.visible = true
        } else {
            orangeDownMonster.visible = true
            orangeBlowup.visible = true
            setTimeout(() => orangeBlowup.visible = false, 1000)
        }

        // 左边累计答对次数
        this.leftCorrectCount = this.leftCorrectCount + (right ? 1 : 0)
            // 左边累计答错次数
        this.leftErrorCount = this.leftErrorCount + (!right ? 1 : 0)
            // 左边连击次数
        this.leftCombo = right ? this.leftCombo + 1 : 0
            // 左边最高连击次数
        this.leftMaxCombo = Math.max(this.leftMaxCombo, this.leftCombo)
            // 左边得分
        this.leftScore = this.leftScore + (currentScore)
        this.leftRecords.push({ text: option.text, right })
    },

    clickGreenMonster(
        option,
        greenMonster,
        greenText,
        greenUpMonster,
        greenUpText,
        greenDownMonster,
        greenBlowup,
    ) {
        if (this.state !== 'playing') {
            return
        }
        if (option.greenClicked) {
            return
        }
        const right = option.right

        // 每答对一次+10分，答错一次-5分 ；如果连续答对3道题时，第三道+12分
        const currentScore = !right ? -5 : this.rightCombo >= 3 ? 12 : 10

        option.greenClicked = true
        greenText.visible = false
        greenMonster.visible = false
        if (right) {
            greenUpMonster.visible = true
            greenUpText.text = `+ ${currentScore} 分`
            greenUpText.visible = true
        } else {
            greenDownMonster.visible = true
            greenBlowup.visible = true
            setTimeout(() => greenBlowup.visible = false, 1000)
        }

        // 右边累计答对次数
        this.rightCorrectCount = this.rightCorrectCount + (right ? 1 : 0)
            // 右边累计答错次数
        this.rightErrorCount = this.rightErrorCount + (!right ? 1 : 0)
            // 右边连击次数
        this.rightCombo = right ? this.rightCombo + 1 : 0
            // 右边最高连击次数
        this.rightMaxCombo = Math.max(this.rightMaxCombo, this.rightCombo)
            // 右边得分
            // 每答对一次+10分，答错一次-5分 ；如果连续答对3道题时，第三道+12分
        this.rightScore = this.rightScore + currentScore
        this.rightRecords.push({ text: option.text, right })
    },

    show() {
        this.visible = true
        this.state = 'playing' // 游戏状态
        this.startTimestamp = +new Date()
            // this.resetPosition()
    },

    hide() {
        this.visible = false
        this.state = 'over' // 游戏状态
        this.timer = 0 // 计时
            // this.monsterVisibleList = null // 计时

        this.leftScore = 0 // 左边得分
        this.leftCorrectCount = 0 // 左边累计答对次数
        this.leftErrorCount = 0 // 左边累计答错次数
        this.leftCombo = 0 // 左边连击次数
        this.leftMaxCombo = 0 // 左边最高连击次数
        this.leftRecords = [] // 左边答题记录

        this.rightScore = 0 // 右边得分
        this.rightCorrectCount = 0 // 右边累计答对次数
        this.rightErrorCount = 0 // 右边累计答错次数
        this.rightCombo = 0 // 右边连击次数
        this.rightMaxCombo = 0 // 右边最高连击次数
        this.rightRecords = [] // 左边答题记录
            // this.getChildById('gameover').alpha = 0
            // this.getChildById('board').alpha = 0
            // this.getChildById('score').alpha = 0
            // this.getChildById('best').alpha = 0
            // this.getChildById('start').alpha = 0
            // this.getChildById('grade').alpha = 0
            // this.getChildById('board').y += 150
            // this.getChildById('score').y += 150
            // this.getChildById('best').y += 150
    },
})

export default PlayingScene