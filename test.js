const _ = require('lodash')
let qrCode = require('./lib/qrCode')

let chunks = {
  'qrCodes': [
    {
      'index': 0,
      'chunk': '{"verificationDocument":{"data":{"properties":{"usage":["residentiel-logement","commercial"],"longueurTotale":9.37,"largeurTotale":8.3,"superficieTotale":77.77,"photo":708,"numeroDePieces":4,"numeroFenetreCadres":0,"numeroPortesCadrees":4,"numeroDePersonnesDorment":2,"plafond":"aucun","solConstruction":"cimente","mursExterieurConstruction":"dur-crepis","toiture":"tole-galvanisee","materiauxVeranda":["veranda-bois-metal"],"observations":"La moitie du batiment (Pieces 1 et 2 sur le croquis) appartient a un autre proprietaire, Mamadou Diallo. \\nPieces totale = 4, pieces pour Fily Sidibe sur Terrain 155 = 2."}},"files":[{"path":"/Users/billli/Desktop/immutable-breadcrumb/tmp/DSCN0507.JPG","hash":""}]},"transactionHash":"0xa8b0b69097baba7a83d4c10d3b89353533dafe8ad32be956f131d0a7c935625f","ipfs":[{"path":"QmYuFcv21PNFcdcYKQz9PirKCpK5SWL261E8RcZVws9DMp","hash":"QmYuFcv21PNFcdcYKQz9PirKCpK5SWL261E8RcZVws9DMp","size":478593}]}'
    }
  ],
  'results': {
    'verificationDocument': {
      'data': {
        'properties': {
          'usage': [
            'residentiel-logement',
            'commercial'
          ],
          'longueurTotale': 9.37,
          'largeurTotale': 8.3,
          'superficieTotale': 77.77,
          'photo': 708,
          'numeroDePieces': 4,
          'numeroFenetreCadres': 0,
          'numeroPortesCadrees': 4,
          'numeroDePersonnesDorment': 2,
          'plafond': 'aucun',
          'solConstruction': 'cimente',
          'mursExterieurConstruction': 'dur-crepis',
          'toiture': 'tole-galvanisee',
          'materiauxVeranda': [
            'veranda-bois-metal'
          ],
          'observations': 'La moitie du batiment (Pieces 1 et 2 sur le croquis) appartient a un autre proprietaire, Mamadou Diallo. \nPieces totale = 4, pieces pour Fily Sidibe sur Terrain 155 = 2.'
        }
      },
      'files': [
        {
          'path': '/Users/billli/Desktop/immutable-breadcrumb/tmp/DSCN0507.JPG',
          'hash': ''
        }
      ]
    },
    'transactionHash': '0xa8b0b69097baba7a83d4c10d3b89353533dafe8ad32be956f131d0a7c935625f',
    'ipfs': [
      {
        'path': 'QmYuFcv21PNFcdcYKQz9PirKCpK5SWL261E8RcZVws9DMp',
        'hash': 'QmYuFcv21PNFcdcYKQz9PirKCpK5SWL261E8RcZVws9DMp',
        'size': 478593
      }
    ]
  }
}


let printOut = []


printOut.push(`

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Cryptographic Deed</title>


<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>



<style>
.qr-code {
  border-collapse: separate;
  border-spacing: 0;
}
.qr-code .qr-cell {
  padding: 0;
  margin: 0;
  width: 5px !important;
  height: 5px !important;
}
.qr-code .qr-white {
  background-color: #fff;
}
.qr-code .qr-black {
  background-color: #000;
}

td{
vertical-align: top;
}

</style>
  </head>

  <body>
    <div class="container">


`)
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

Promise.all(promises)
  .then(() => {
    printOut.push('<hr>')

    printTable(chunks.results.verificationDocument.data)
    printOut.push('<hr>')

    printOut.push(`<p><pre>TXH: ${chunks.results.transactionHash}</pre></p>`)
    let verificationDocument = JSON.parse(_.map(chunks.qrCodes, 'chunk').join(''))
    const objectHash = require('object-hash')

    let H = objectHash(verificationDocument.verificationDocument, {algorithm: 'sha256'})
    printOut.push(`<p><pre>H: 0x0003${H}</pre></p>`)

    printOut.push(`<p><pre>IPFSH:</pre></p>`)
    _.forEach(chunks.results.ipfs, (file) => {
      printOut.push(`<p><pre>- https://ipfs.io/ipfs/${file.hash}</pre></p>`)
    })

    printOut.push('<hr>')

    function printTable (object) {
      if (_.isObject(object)) {
        printOut.push('<table border="1">')

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

    printOut.push('<p><pre>This is your cryptographic deed</pre></p>')
  })


