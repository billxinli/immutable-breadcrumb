const fs = require('fs')
const openpgp = require('openpgp')

const publicKeyBuffer = fs.readFileSync('./tmp/3FB7E73D.asc')

const publicKeyHex = publicKeyBuffer.toString('hex')
const publicKey = publicKeyBuffer.toString()

let options = {
  data: 'Hello, World!',
  publicKeys: openpgp.key.readArmored(publicKey).keys
}

openpgp.encrypt(options)
  .then((ciphertext) => console.log(ciphertext.data))
