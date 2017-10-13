const kue = require('kue')
const config = require('config')
// const redisConfig = config.get('redis')

let queue = kue.createQueue(
  //{prefix: redisConfig.prefix, redis: redisConfig}
)

module.exports = kue
module.exports.queue = queue
