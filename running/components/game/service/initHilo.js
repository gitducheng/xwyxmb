import AssetsFectory from '../lib/Asset'
export default async function() {
  const { $Hilo } = this
  const Assets = AssetsFectory($Hilo)
  const assets = new Assets()
  assets.on('load', (e) => {
    const num =
      +(e.target.queue.getLoaded() / e.target.queue.getTotal()).toFixed(2) * 50
    this.process = num
  })
  const { spsource } = await assets.load()

  this.process = 50

  let comm = {}
  ;[
    'xingzuopipei',
    'xingzuoxinxi',
    'xingzuoindex',
    'xingzuojieguo',
    'xingzuosave'
  ].forEach((element) => {
    comm[element] = spsource.layout[`mod-${element}`].reduce((pre, net) => {
      pre[net.name] = net
      return pre
    }, {})
  })
  ;['common'].forEach((element) => {
    comm[element] = spsource.layout[element].reduce((pre, net) => {
      pre[net.name] = net
      return pre
    }, {})
  })
}
