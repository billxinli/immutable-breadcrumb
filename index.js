const hasha = require('hasha')
const objectHash = require('object-hash')
const Web3 = require('web3')
const _ = require('lodash')
const IPFS = require('ipfs')
const Promise = require('bluebird')

const verificationDocument = require('./verification-document')
const {fromAccount, fromAccountPassword, toAccount, ipfsRepo} = require('./config')

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

function gasCalculator (data) {
  // transaction base gas is 21000
  // none zero byte is 68 gas, and 2 characters in the hex data is 1 byte, thus the division by 2
  return 21000 + Math.ceil(data.length * 68 / 2)
}

function sendTransaction (fromAccount, fromAccountPassword, toAccount, data, value = 1) {
  return web3.eth.personal.unlockAccount(fromAccount, fromAccountPassword, 15000)
    .then((decrypted) => {
      console.log('Decrypted:', decrypted)
      return web3.eth.getBalance(fromAccount)
        .then((balance) => {
          console.log('Wei:', balance)
          console.log('Eth:', web3.utils.fromWei(balance, 'ether'))

          return web3.eth.sendTransaction({
            from: fromAccount,
            to: toAccount,
            value: value,
            gas: gasCalculator(data),
            data: data
          })
        })
    })
}

const node = new IPFS({
  repo: ipfsRepo,
  init: true, // default
  start: true,
  EXPERIMENTAL: { // enable experimental features
    pubsub: true,
    sharding: true, // enable dir sharding
  }
})

// Events

node
  .on('ready', () => {
// Node is ready to use when you first create it
    console.log('ready')
  })
  .on('error', (err) => {
    // Node has hit some error while initing/starting
    console.log('error', err)
  })
  .on('init', () => {
    // Node has successfully finished initing the repo
    console.log('init')
  })
  .on('start', () => {
    // Node has started
    console.log('start')

    const fs = require('fs')

    node.files.add([fs.createReadStream('./tmp/image.jpeg'), fs.createReadStream('./tmp/image2.jpg')])
      .then((files) => {
        return Promise.map(files, (file) => {
          let {hash} = file

          console.log(hash)
          console.log(new Buffer(hash).toString('hex'))

          let DH = new Buffer(hash).toString('hex')
          DH = `0x${DH}`

          return sendTransaction(fromAccount, fromAccountPassword, toAccount, DH)
        })
      })
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
      })

  })
  .on('stop', () => {
    // Node has stopped
    console.log('stop')
  })

let verificationDocumentHash = objectHash(verificationDocument, {algorithm: 'sha256'})

console.log(verificationDocumentHash)
