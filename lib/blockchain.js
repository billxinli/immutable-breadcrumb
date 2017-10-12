const _ = require('lodash')
const Promise = require('bluebird')
const Web3 = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

function gasCalculator (data) {
  // transaction base gas is 21000
  // none zero byte is 68 gas, and 2 characters in the hex data is 1 byte, thus the division by 2
  return 21000 + Math.ceil(data.length * 68 / 2)
}

function getConfirmationStatus (txHash) {
  if (!_.startsWith(txHash, '0x') && !_.startsWith(txHash, '0X')) {
    txHash = `0x${txHash}`
  }

  return Promise.all([web3.eth.getTransaction(txHash), web3.eth.getTransactionReceipt(txHash)])
    .spread((transaction, receipt) => {
      if (transaction && receipt) {
        return _.get(transaction, 'blockNumber') === _.get(receipt, 'blockNumber') && _.get(transaction, 'blockNumber') > 0 && _.get(receipt, 'blockNumber') > 0
      }
      return Promise.resolve(false)
    })
    .catch(() => Promise.resolve(false))
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

module.exports = {
  gasCalculator,
  getConfirmationStatus,
  sendTransaction
}
