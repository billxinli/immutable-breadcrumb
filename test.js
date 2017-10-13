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

console.log(`
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
`)
let promises = _.map(chunks.qrCodes, (chunk) => {
  let page = _.get(chunk, 'index', 0) + 1
  let qr = _.get(chunk, 'chunk', '')
  return qrCode.createQRArray(qr)
    .then((rows) => {
      console.log('<table class="qr-code">')
      _.forEach(rows, (cells) => {
        console.log('<tr>')
        _.forEach(cells, (cell) => {
          console.log(`<td class="qr-cell ${cell === 1 ? 'qr-black' : 'qr-white'}"></td>`)
        })
        console.log('</tr>')
      })
      console.log('</table>')
    })
})

Promise.all(promises)
  .then(() => {
    console.log('<hr>')

    console.log(`<p><pre>TXH: ${chunks.results.transactionHash}</pre></p>`)
    let verificationDocument = JSON.parse(_.map(chunks.qrCodes, 'chunk').join(''))
    const objectHash = require('object-hash')

    let H = objectHash(verificationDocument.verificationDocument, {algorithm: 'sha256'})
    console.log(`<p><pre>H: 0x0003${H}</pre></p>`)

    console.log(`<p><pre>IPFSH:</pre></p>`)
    _.forEach(chunks.results.ipfs, (file) => {
      console.log(`<p><pre>- https://ipfs.io/ipfs/${file.hash}</pre></p>`)
    })

    console.log('<hr>')

    function printTable (object) {
      if (_.isObject(object)) {
        console.log('<table border="1">')

        _.forEach(object, (value, key) => {
          console.log(`<tr>`)
          console.log(`<td>`)
          console.log(key)
          console.log(`</td>`)
          console.log(`<td>`)
          printTable(value)
          console.log(`</td>`)
          console.log(`</tr>`)
        })
        console.log('</table>')
      } else if (_.isArray(object)) {
        console.log('<ul>')
        _.forEach(object, (o) => {
          console.log(`<li>${o}</li>`)
        })
        console.log('</ul>')
      } else {
        console.log(object)
      }
    }
    printTable(chunks.results.verificationDocument.data)
    console.log('<hr>')
    console.log('<p><pre>This is your cryptographic deed</pre></p>')
  })
// const _ = require('lodash')
// let verificationDocument = require('./verification-document')
// let qrCode = require('./lib/qrCode')
//
// let tt = {
//   'verificationDocument': {
//     'data': {
//       'papId': 1,
//       'assetProperties': {
//         'type': 'house',
//         'numberOfRooms': 3,
//         'gpsCoordinates': [
//           {
//             'lat': 0,
//             'lng': 0
//           },
//           {
//             'lat': 1,
//             'lng': 0
//           },
//           {
//             'lat': 1,
//             'lng': 1
//           },
//           {
//             'lat': 0,
//             'lng': 1
//           }
//         ]
//       }
//     },
//     'files': [
//       {
//         'path': '/Users/billli/Desktop/immutable-breadcrumb/tmp/image.jpeg',
//         'hash': ''
//       },
//       {
//         'path': '/Users/billli/Desktop/immutable-breadcrumb/tmp/image2.jpg',
//         'hash': ''
//       }
//     ]
//   },
//   'transactionHash': '0xd0d7bbde3e43898eac1538f9ed571408f1074a377d925e9b32427df42bc3c7a7',
//   'ipfs': [
//     {
//       'path': 'QmWrXEpMid3oemwThvQRRYuyrGi1aZB8ZCHPgBaaUuP6sb',
//       'hash': 'QmWrXEpMid3oemwThvQRRYuyrGi1aZB8ZCHPgBaaUuP6sb',
//       'size': 208612
//     },
//     {
//       'path': 'QmVvhHMZADnQtE5zbwmgcA8kSmJyFRZoSFeN5Z9RZdQwCS',
//       'hash': 'QmVvhHMZADnQtE5zbwmgcA8kSmJyFRZoSFeN5Z9RZdQwCS',
//       'size': 58337
//     }
//   ]
// }
//
// let t = `[${JSON.stringify(tt)},${JSON.stringify(tt)},${JSON.stringify(tt)},${JSON.stringify(tt)},${JSON.stringify(tt)},${JSON.stringify(tt)},${JSON.stringify(tt)},${JSON.stringify(tt)},${JSON.stringify(tt)},${JSON.stringify(tt)},${JSON.stringify(tt)}]`
//
// console.log(JSON.stringify(t))
// console.log(JSON.stringify(t).length)
//
// let f = new Buffer(JSON.stringify(t))
//
// console.log(f.toString('hex'))
// console.log(f.toString('hex').length)
//
// var jsscompress = require('js-string-compression')
//
// var raw_text = JSON.stringify(t)
//
// var hm = new jsscompress.Hauffman()
// var compressed = hm.compress(raw_text)
//
// console.log('before compressed: ' + raw_text)
// console.log('length: ' + raw_text.length)
// console.log('after compressed: ' + compressed)
// console.log('length: ' + compressed.length)
//
// console.log(new Buffer(compressed).toString('base64'))
// console.log(new Buffer(compressed).toString('base64').length)
//
// console.log('decompressed: ' + hm.decompress(compressed))
//
// qrCode.createQRArray(JSON.stringify(verificationDocument))
//   .then(data => {
//
//     const black = '\033[40m  \033[0m'
//     const white = '\033[47m  \033[0m'
//
//     let toCell = function (isBlack) {
//       return isBlack ? black : white
//     }
//
//     _.forEach(data, (row) => {
//       _.forEach(row, (cell) => {
//         process.stdout.write(toCell((cell === 1)))
//       })
//       process.stdout.write('\n')
//     })
//
//   })
//
// const _ = require('lodash')
// const Promise = require('bluebird')
// const Web3 = require('web3')
//
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
//
// let owner = '0xBA769d1bc864C5380559991D0F59c10884740886'
// let user = '0x62b82e9a2777ab371cba44d1762026fa73008bfc'
//
//
// var contractAbi = new web3.eth.Contract([
//   {
//     'constant': true,
//     'inputs': [],
//     'name': 'getWaitingList',
//     'outputs': [
//       {
//         'name': '',
//         'type': 'address[]'
//       }
//     ],
//     'payable': false,
//     'type': 'function'
//   },
//   {
//     'constant': true,
//     'inputs': [],
//     'name': 'getCurrent',
//     'outputs': [
//       {
//         'name': '',
//         'type': 'uint256'
//       }
//     ],
//     'payable': false,
//     'type': 'function'
//   },
//   {
//     'constant': true,
//     'inputs': [],
//     'name': 'owner',
//     'outputs': [
//       {
//         'name': '',
//         'type': 'address'
//       }
//     ],
//     'payable': false,
//     'type': 'function'
//   },
//   {
//     'constant': false,
//     'inputs': [],
//     'name': 'pop',
//     'outputs': [
//       {
//         'name': '',
//         'type': 'address'
//       }
//     ],
//     'payable': false,
//     'type': 'function'
//   },
//   {
//     'constant': false,
//     'inputs': [],
//     'name': 'addToWaitingList',
//     'outputs': [],
//     'payable': false,
//     'type': 'function'
//   },
//   {
//     'constant': true,
//     'inputs': [
//       {
//         'name': '',
//         'type': 'uint256'
//       }
//     ],
//     'name': 'waitingList',
//     'outputs': [
//       {
//         'name': '',
//         'type': 'address'
//       }
//     ],
//     'payable': false,
//     'type': 'function'
//   },
//   {
//     'inputs': [],
//     'payable': false,
//     'type': 'constructor'
//   }
// ], '0x4313e7d669ffed840e49b0a07294f85a0401effa', {from: owner})
//
//
// console.log(contractAbi)
//
//
//
// return web3.eth.personal.unlockAccount(owner, 'password', 15000)
//   .then((decrypted) => {
//     console.log(decrypted)
//     // call just read
//     return contractAbi.methods.getCurrent().call()
//       .then((t) => {console.log(t)})
//       .catch((err) => {console.log(err)})
//
//     // //send is used to create transaction
//     return contractAbi.methods.pop().send()
//       .then((t) => {console.log(t)})
//       .catch((err) => {console.log(err)})
//   })
//
// var myContract = contractAbi.at('0x05adb9b1662d60b937bed9ac966e3505a11af87a')
// // suppose you want to call a function named myFunction of myContract
// var getData = myContract.getCurrent.getData()
// //finally paas this data parameter to send Transaction
// web3.eth.sendTransaction({to: '0x05adb9b1662d60b937bed9ac966e3505a11af87a', from: '0xba769d1bc864c5380559991d0f59c10884740886', data: getData})
//   .then((data) => {
//     console.log(data)
//   })
