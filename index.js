const hasha = require('hasha')
const objectHash = require('object-hash')
const _ = require('lodash')
const Promise = require('bluebird')
const fs = require('fs')

const {gasCalculator, getConfirmationStatus, sendTransaction} = require('./lib/blockchain')
const {startNode} = require('./lib/ipfs')

const verificationDocument = require('./verification-document')
const {fromAccount, fromAccountPassword, toAccount, ipfsRepo} = require('./config/config')

let node = startNode(ipfsRepo)

node
  .on('ready', () => console.log('Node is ready to use when you first create it'))
  .on('error', (err) => console.log('Node has hit some error while initing/starting', err))
  .on('init', () => console.log('Node has successfully finished initing the repo'))
  .on('start', () => {

    console.log('Node has started')

    let H = objectHash(verificationDocument, {algorithm: 'sha256'})

    console.log('H:', H)

    node.files.add([fs.createReadStream('./tmp/image.jpeg'), fs.createReadStream('./tmp/image2.jpg')])
      .then((files) => {
        return Promise.map(files, (file) => {
          let {hash} = file

          let DH = new Buffer(hash).toString('hex')
          DH = `0x${DH}`

          console.log('IPFS Hash:', DH)

          // return sendTransaction(fromAccount, fromAccountPassword, toAccount, DH)
        })
      })
      .then((data) => console.log(data))
      .catch((err) => console.log(err))
  })
  .on('stop', () => console.log('Node has stopped'))
