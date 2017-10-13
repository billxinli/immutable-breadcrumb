const _ = require('lodash')
const Promise = require('bluebird')
const {getConfirmationStatus, getBlockNumber} = require('./../blockchain')
const kue = require('../kue')
const persistFilesQueue = require('./../persistFilesQueue/queue')
const defaultTTL = 10
const blockTime = 7500
const queueName = 'verifyTransaction'

function enqueue (data) {
  return new Promise((resolve, reject) => {
    let attempts = defaultTTL - _.get(data, 'ttl', defaultTTL)
    let delay = attempts * blockTime
    let job = kue.queue.create(queueName, data)
      .removeOnComplete(true)
      .delay(delay)
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

  kue.queue.process(queueName, 1, (job, done) => {
    console.log(`Queue ${queueName} processing job`)

    onStart(job.data)
      .then(() => {
        let transactionHash = _.get(job, 'data.transactionHash', null)

        return Promise.all([
          getConfirmationStatus(transactionHash),
          getBlockNumber(transactionHash)
        ])
      })
      .spread((confirmationStatus, blockNumber) => {
        if (!confirmationStatus) {
          throw Error('Not found')
        }

        console.log(`Queue ${queueName} finished job`)
        return onComplete(_.merge({confirmationStatus: confirmationStatus, blockNumber: blockNumber}, job.data))
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
  if (!_.isUndefined(data.ttl)) {
    if (parseInt(data.ttl, 10) > 0) {
      data.ttl = parseInt(data.ttl, 10) - 1
    } else {
      console.log('OnFailed, no more retries')
      return Promise.reject(err)
    }
  } else {
    data.ttl = defaultTTL
  }

  console.log(`onFailed on ${queueName}`, JSON.stringify(data, undefined, 2), ', retry with TTL', data.ttl)
  return enqueue(data)
}

function onComplete (results) {
  console.log(`onComplete on ${queueName}`, JSON.stringify(results, undefined, 2))

  return persistFilesQueue.enqueue(results)
}

module.exports = {
  queueName,
  enqueue,
  process,
  onComplete,
  defaultTTL
}
