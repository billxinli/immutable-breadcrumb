const IPFS = require('ipfs')

function startNode (ipfsRepo) {
  const node = new IPFS({
    repo: ipfsRepo,
    init: true, // default
    start: true,
    EXPERIMENTAL: { // enable experimental features
      pubsub: true,
      sharding: true, // enable dir sharding
    }
  })

  return node
}

module.exports = {
  startNode
}
