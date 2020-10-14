import chinese from '~/static/fonts-chinese.json'
import english from '~/static/fonts-english.json'

export function randomArr(arr) {
  return arr.sort(() => 0.5-Math.random())
}
export function getRandomOption(list,lang) {
  const fonts=lang==='english'? english:chinese
  const count=24-list.length
  let result=[]
  if(!list.length) {
    console.error('正确答案必须传')
    return ''
  }
  if(list.length>24) {
    console.error('超出字数限制')
    return ''
  }

  const getRandom=() => {
    if(result.length>=count) {
      result=Array.from(new Set(result)) //排除掉list中原有的
    }
    if(result.length<count) {
      const index=Math.floor(Math.random()*fonts.length)
      result.push(fonts[index])
      return getRandom()
    }
  }

  getRandom()
  return randomArr([...result,...list])
}

export function getTime(time=0) {
  let m=Math.floor(time/60)+''
  m=m.padStart(2,'0')
  let s=time%60+''
  s=s.padStart(2,'0')
  return `${m} : ${s}`
}