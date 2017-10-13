const _ = require('lodash')
const Promise = require('bluebird')
const QRCode = require('qrcode')

function createQRArray (string) {
  return new Promise((resolve, reject) => {
    try {
      let qr = QRCode.create(string)
      let modules = qr.modules
      let width = qr.modules.size

      let arrays = []
      _.times(width, (i) => {
        let row = []
        _.times(width, (j) => {
          row.push(modules.get(i, j))
        })
        arrays.push(row)
      })
      resolve(arrays)
    } catch (err) {
      reject(err)
    }
  })
}

function createQRImage (stream, string) {
  return new Promise((resolve, reject) => {
    QRCode.toFileStream(stream, string, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(stream)
      }
    })
  })
}

module.exports = {
  createQRArray,
  createQRImage
}
