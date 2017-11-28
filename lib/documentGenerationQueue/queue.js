const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const kue = require('../kue')
const queueName = 'documentGeneration'

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
        let data = job.data

        let printOut = {
          verificationDocument: _.get(data, 'verificationDocument'),
          transactionHash: _.get(data, 'transactionHash'),
          ipfs: _.get(data, 'ipfs')
        }

        return Promise.resolve(printOut)
      })
      .then((results) => {
        console.log(`Queue ${queueName} finished job`)
        return onComplete({results, data: job.data})
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

  let printOutText = JSON.stringify(results.results)

  let splitString = function (string, size) {
    let re = new RegExp('.{1,' + size + '}', 'g')
    return string.match(re)
  }

  let printOutTextChunks = _.map(splitString(printOutText, 5000), (chunk, index) => { return {index, chunk} })
  return Promise.resolve({qrCodes: printOutTextChunks, results: results.results})
    .then((data) => {
      let {buildDocument} = require('./lib')
      let output = path.join(__dirname, '../..', 'output.html')
      buildDocument(data, output)
        .then(() => {
          console.log(`Done, saved to ${output}`)
        })
    })

}

module.exports = {
  queueName,
  enqueue,
  process,
  onComplete
}
