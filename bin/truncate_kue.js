#!/usr/bin/env node
const Promise = require('bluebird')
const _ = require('lodash')
const kue = require('./../lib/kue')

let promises = []

function removeJobById (id) {
  return new Promise((resolve, reject) => {
    kue.Job.get(id, (err, job) => {
      if (err) {
        reject(err)
      } else {
        job.remove((err) => {
          if (err) {
            reject(err)
          } else {
            resolve(`Removed job with ID: ${id}`)
          }
        })
      }
    })
  })
}

kue.queue.active((err, ids) => _.forEach(ids, (id) => promises.push(removeJobById(id))))
kue.queue.complete((err, ids) => _.forEach(ids, (id) => promises.push(removeJobById(id))))
kue.queue.failed((err, ids) => _.forEach(ids, (id) => promises.push(removeJobById(id))))
kue.queue.inactive((err, ids) => _.forEach(ids, (id) => promises.push(removeJobById(id))))
kue.queue.delayed((err, ids) => _.forEach(ids, (id) => promises.push(removeJobById(id))))

Promise.delay(1000)
  .then(() => Promise.all(promises))
  .then(console.log)
  .catch(console.warn)
  .finally(() => {
    console.log('Done')
    process.exit(0)
  })
