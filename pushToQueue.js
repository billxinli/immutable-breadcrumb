const verificationDocument = require('./verification-document')
const encodeAssetQueue = require('./lib/encodeAssetQueue/queue')

encodeAssetQueue.enqueue({verificationDocument}).then(() => process.exit(0))

