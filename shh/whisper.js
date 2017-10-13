const _ = require('lodash')
const Promise = require('bluebird')
const Web3 = require('web3')
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const net = require('net')

const web3 = new Web3(new Web3.providers.IpcProvider('/Users/billli/eth/rinkeby/geth.ipc', net))

web3.shh.generateSymKeyFromPassword('password')
  .then((data) => {
    console.log('newSynKey', data)

    web3.shh.newMessageFilter({symKeyID: data})
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
      })

    return web3.shh.getSymKey(data)
      .then((data) => {
        console.log('getSymKey:', data)
      })
  })

// web3.shh.getFilterMessages('02c1f5c953804acee3b68eda6c0afe3f1b4e0bec73c7445e10d45da333616412')
//   .then((data) => {
//     console.log(data)
//   })

web3.shh.newKeyPair()
  .then((data) => {
    return Promise.all([web3.shh.getPublicKey(data), web3.shh.getPrivateKey(data)])
      .spread((publicKey, privateKey) => {
        console.log('Data:', data)
        console.log('public:', publicKey)
        console.log('private:', privateKey)

        let sub
        web3.shh.newMessageFilter({privateKeyID: data})
          .then((data) => {
            // data.on('data', (data) => {console.log('event data:', data)})

            sub = data

            console.log('newMessageFilter', data)
            web3.shh.getFilterMessages(data)
              .then((data) => {
                console.log('getFilterMessages0', data)
              })
          })
          .catch((err) => {
            console.log(err)
          })

        web3.shh.subscribe('messages', {
          privateKeyID: data
        }, function () {
          console.log(arguments)
        })

        // web3.shh.hasKeyPair(publicKey)
        //   .then((data) => {
        //     console.log('hasKeyPair:', data)
        //   })

        web3.shh.post({
          ttl: 7,
          topic: '0xdeadbeef',
          powTarget: 2.01,
          powTime: 2,
          payload: '0x80081E',
          pubKey: publicKey
        })
          .then((data) => {
            console.log('post', data)

            web3.shh.getFilterMessages(sub)
              .then((data) => {
                console.log('getFilterMessages', data)
              })
          })

        // web3.shh.newMessageFilter()
        //   .then(console.log)
      })
  })
//
// var identities = []
// var subscription = null
//
// var shh = web3.shh
// Promise
//   .all([
//     web3.shh.newSymKey()
//       .then((id) => {
//         identities.push(id)
//       }),
//     web3.shh.newKeyPair()
//       .then((id) => {
//         identities.push(id)
//       })
//   ])
//   .then(() => {
//
//     // will receive also its own message send, below
//     subscription = shh.subscribe('messages', {
//       symKeyID: identities[0],
//       topics: ['0xffaadd11']
//     })
//       .on('data', console.log)
//
//   })
//   .then(() => {
//     shh.post({
//       symKeyID: identities[0], // encrypts using the sym key ID
//       sig: identities[1], // signs the message using the keyPair ID
//       ttl: 10,
//       topic: '0xffaadd11',
//       payload: '0xffffffdddddd1122',
//       powTime: 3,
//       powTarget: 0.5
//     })
//   })
