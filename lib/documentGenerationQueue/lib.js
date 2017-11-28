const _ = require('lodash')
const objectHash = require('object-hash')
const fs = require('fs')
const qrCode = require('./../qrCode')

function buildDocument (chunks, outputPath) {
  let printOut = []
  printOut.push(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Proof of existence</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <style>
      img{width:100%}
      .qr-code{border-collapse:separate;border-spacing:0;}
      .qr-code .qr-cell{padding:0;margin:0;width:5px !important;height:5px !important;}
      .qr-code .qr-white{background-color:#fff;}
      .qr-code .qr-black{background-color:#000;}
      td{vertical-align:top;}
    </style>
  </head>
  <body>
    <div class="container">
`)

  printOut.push(`
  <h1>Proof of existence</h1>
  <hr>
  <h2>Metadata</h2>
  <p><strong>TXH:</strong> <pre>${chunks.results.transactionHash}</pre> 
  <a href="https://rinkeby.etherscan.io/tx/${chunks.results.transactionHash}" target="_blank">Etherscan</a>
  </p>`)

  let verificationDocument = JSON.parse(_.map(chunks.qrCodes, 'chunk').join(''))

  let H = objectHash(verificationDocument.verificationDocument, {algorithm: 'sha256'})
  printOut.push(`<p><strong>H:</strong> <pre>0x0003${H}</pre></p>`)

  printOut.push(`<h2>Document Attributes</h2>`)
  printTable(chunks.results.verificationDocument.data)

  printOut.push(`<p><strong>IPFSH:</strong></p>`)
  _.forEach(chunks.results.ipfs, (file) => {
    printOut.push(`<p><pre>- https://ipfs.io/ipfs/${file.hash}</pre></p>`)
    printOut.push(`<p><img src="https://ipfs.io/ipfs/${file.hash}"/></p>`)
  })

  printOut.push('<hr>')

  function printTable (object) {
    if (_.isObject(object)) {
      printOut.push('<table class="table table-striped table-sm">')
      _.forEach(object, (value, key) => {
        printOut.push(`<tr>`)
        printOut.push(`<td>`)
        printOut.push(key)
        printOut.push(`</td>`)
        printOut.push(`<td>`)
        printTable(value)
        printOut.push(`</td>`)
        printOut.push(`</tr>`)
      })
      printOut.push('</table>')
    } else if (_.isArray(object)) {
      printOut.push('<ul>')
      _.forEach(object, (o) => {
        printOut.push(`<li>${o}</li>`)
      })
      printOut.push('</ul>')
    } else {
      printOut.push(object)
    }
  }

  printOut.push('<h2>QR Codes</h2>')
  let promises = _.map(chunks.qrCodes, (chunk) => {
    let page = _.get(chunk, 'index', 0) + 1
    let qr = _.get(chunk, 'chunk', '')
    return qrCode.createQRArray(qr)
      .then((rows) => {

        printOut.push('<table class="qr-code">')
        _.forEach(rows, (cells) => {
          printOut.push('<tr>')
          _.forEach(cells, (cell) => {
            printOut.push(`<td class="qr-cell ${cell === 1 ? 'qr-black' : 'qr-white'}"></td>`)
          })
          printOut.push('</tr>')
        })
        printOut.push('</table>')
      })
  })

  return Promise.all(promises)
    .then(() => {
      printOut.push('<hr>')
      printOut.push('<p>This is your cryptographic proof of existance</p>')
      fs.writeFileSync(outputPath, printOut.join('\n'))
    })

}

module.exports = {
  buildDocument
}