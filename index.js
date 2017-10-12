const hasha = require('hasha')
const objectHash = require('object-hash')
const Web3 = require('web3')

const verificationDocument = require('./verification-document')
const {fromAccount, fromAccountPassword, toAccount} = require('./config')

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

function gasCalculator (data) {
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

let verificationDocumentHash = objectHash(verificationDocument, {algorithm: 'sha256'})

console.log(verificationDocumentHash)
