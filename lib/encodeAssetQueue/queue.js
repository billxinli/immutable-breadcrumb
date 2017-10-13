const objectHash = require('object-hash')
const _ = require('lodash')
const Promise = require('bluebird')
const fs = require('fs')
const tmp = require('tmp')
const path = require('path')
const {sendTransaction} = require('./../blockchain')
const {fromAccount, fromAccountPassword, toAccount} = require('./../../config/config')
const prefixProofOfOwnership = '0003'
const promisfiedTmpDir = Promise.promisify(tmp.dir)
const promisfiedFsWriteFile = Promise.promisify(fs.writeFile)
const verifyTransactionQueue = require('./../verifyTransactionQueue/queue')
const kue = require('../kue')
const queueName = 'encodeAsset'

function enqueue (data) {
  return new Promise((resolve, reject) => {
    let job = kue.queue.create(queueName, data)
      .removeOnComplete(true)
      .save((err) => {
        if (err) {
          reject(err)
        } else {
          console.log(`Queue: ${queueName} (${job.id}) created`)
          resolve(job)
        }
      })
  })
}

function process () {
  console.log(`Queue ${queueName} started processing`)

  kue.queue.process(queueName, (job, done) => {
    console.log(`Queue ${queueName} processing job`)

    onStart(job.data)
      .then(() => {
        let verificationDocument = job.data.verificationDocument
        let H = objectHash(verificationDocument, {algorithm: 'sha256'})
        H = `${prefixProofOfOwnership}${H}`

        return promisfiedTmpDir()
          .then((tmpDirectory) => {
            let newFilePath = path.join(tmpDirectory, H)
            return Promise.all([
              Promise.resolve(newFilePath),
              promisfiedFsWriteFile(newFilePath, JSON.stringify(job.data.verificationDocument, undefined, 2))
            ])
          })
          .spread((newFilePath) => {
            return sendTransaction(fromAccount, fromAccountPassword, toAccount, H)
              .then((data) => {
                let transactionHash = _.get(data, 'transactionHash')
                return Promise.resolve({filePath: newFilePath, transactionHash})
              })
          })
      })
      .then((results) => {
        console.log(`Queue ${queueName} finished job`)

        return onComplete(_.merge(results, job.data))
          .then(() => done(null))
      })
      .catch((err) => {
        return onFailed(err, job.data)
          .then(() => done(err))
      })
  })
}

function onStart (data) {
  console.log(`onStart on ${queueName}`, JSON.stringify(data, undefined, 2))
  return Promise.resolve(data)
}

function onFailed (err, data) {
  console.log(`onFailed on ${queueName}`, JSON.stringify(data, undefined, 2))
  return Promise.reject(err)
}

function onComplete (results) {
  console.log(`onComplete on ${queueName}`, JSON.stringify(results, undefined, 2))

  results.ttl = 10 // Set out default ttl
  return verifyTransactionQueue.enqueue(results)
}

module.exports = {
  queueName,
  enqueue,
  process,
  onComplete
}
