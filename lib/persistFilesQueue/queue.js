const _ = require('lodash')
const Promise = require('bluebird')
const fs = require('fs')
const documentGenerationQueue = require('./../documentGenerationQueue/queue')
const kue = require('../kue')
const queueName = 'persistFiles'

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

function process (node) {
  console.log(`Queue ${queueName} started processing`)

  node
    .on('ready', () => console.log('Node is ready to use when you first create it'))
    .on('error', (err) => console.log('Node has hit some error while initing/starting', err))
    .on('init', () => console.log('Node has successfully finished initing the repo'))
    .on('start', () => {
      kue.queue.process(queueName, (job, done) => {
        console.log(`Queue ${queueName} processing job`)

        let verificationDocumentFiles = _.get(job, 'data.verificationDocument.files', [])
        console.log(verificationDocumentFiles)

        onStart(job.data)
          .then(() => {
            let paths = _.map(verificationDocumentFiles, (verificationDocumentFile) => fs.createReadStream(verificationDocumentFile.path))
            return node.files.add(paths)
          })
          .tap((files) => {
            return Promise.map(files, (file) => {
              let {hash} = file

              let DH = new Buffer(hash).toString('hex')
              DH = `0x${DH}`

              console.log('IPFS Hash:', DH)

              // return sendTransaction(fromAccount, fromAccountPassword, toAccount, DH)
            })
          })

          .then((results) => {
            console.log(`Queue ${queueName} finished job`)
            return onComplete(_.merge({ipfs: results}, job.data))
              .then(() => done(null))
          })
          .catch((err) => {
            return onFailed(err, job.data)
              .then(() => done(err))
          })

        // onStart(job.data)
        //   .then(() => {
        //     console.log(`Queue ${queueName} finished job`)
        //     let results = 1
        //     let blockNumber = 2
        //     return onComplete({results, blockNumber, data: job.data})
        //       .then(() => done(null))
        //   })
        //   .catch((err) => {
        //     return onFailed(err, job.data)
        //       .then(() => done(err))
        //   })
      })
    })
    .on('stop', () => console.log('Node has stopped'))
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
  return documentGenerationQueue.enqueue(results)
}

module.exports = {
  queueName,
  enqueue,
  process,
  onComplete
}
