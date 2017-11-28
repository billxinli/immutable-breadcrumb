const verificationDocument = require('./demo-verification-document')
const encodeAssetQueue = require('./lib/encodeAssetQueue/queue')

encodeAssetQueue.enqueue({verificationDocument}).then(() => process.exit(0))

