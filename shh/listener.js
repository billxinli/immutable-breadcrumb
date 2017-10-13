const Web3 = require('web3')
const net = require('net')
const web3 = new Web3(new Web3.providers.IpcProvider('/Users/billli/eth/rinkeby/geth.ipc', net))

web3.shh.generateSymKeyFromPassword('password')
  .then((data) => {
    web3.shh.subscribe('messages', {
      symKeyID: data,
      topics: ['0xdeadbeef']
    }, (err, message, subscription) => {
      console.log(web3.utils.hexToAscii(message.payload))
    })
  })
