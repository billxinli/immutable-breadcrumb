#!/usr/bin/env node
const cluster = require('cluster')

const env = 'development'

let numWorkers = require('os').cpus().length

if (cluster.isMaster) {
  process.title = 'immutable-breadcrumb-master'

  console.log(`Master cluster setting up ${numWorkers} workers...`)

  cluster
    .on('online', (worker) => {
      console.log(`Worker ${worker.process.pid} is online`)
    })
    .on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`)
      console.log(`Starting a new worker`)
      cluster.fork()
    })

  if (env === 'development') {
    numWorkers = 1
  }

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork()
  }
} else {
  const encodeAssetQueue = require('./../lib/encodeAssetQueue/queue')
  encodeAssetQueue.process()

  const verifyTransactionQueue = require('./../lib/verifyTransactionQueue/queue')
  verifyTransactionQueue.process()

  const persistFileQueue = require('./../lib/persistFilesQueue/queue')

  const {startNode} = require('./../lib/ipfs')
  const {ipfsRepo} = require('./../config/config')
  let node = startNode(ipfsRepo)

  persistFileQueue.process(node)

  const documentGenerationQueue = require('./../lib/documentGenerationQueue/queue')
  documentGenerationQueue.process()

  process.title = 'immutable-breadcrumb-worker'
}
