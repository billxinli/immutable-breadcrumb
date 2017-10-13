const net = require('net')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.IpcProvider('/Users/billli/eth/rinkeby/geth.ipc', net))

web3.shh.generateSymKeyFromPassword('password')
  .then((data) => {
    console.log('New symmetric key', data)

    return web3.shh.post({
      ttl: 7,
      topic: '0xdeadbeef',
      powTarget: 2.01,
      powTime: 2,
      payload: web3.utils.asciiToHex('It is a trap!'),
      symKeyID: data
    })
  })
  .then((data) => console.log(data))
