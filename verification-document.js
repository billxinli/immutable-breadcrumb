const path = require('path')
module.exports = {
  data: {
    properties: {
      usage: ['residentiel-logement', 'commercial'],
      longueurTotale: 9.37,
      largeurTotale: 8.3,
      superficieTotale: 77.77,
      photo: 708,
      numeroDePieces: 4,
      numeroFenetreCadres: 0,
      numeroPortesCadrees: 4,
      numeroDePersonnesDorment: 2,
      plafond: 'aucun',
      solConstruction: 'cimente',
      mursExterieurConstruction: 'dur-crepis',
      toiture: 'tole-galvanisee',
      materiauxVeranda: ['veranda-bois-metal'],
      observations: 'La moitie du batiment (Pieces 1 et 2 sur le croquis) appartient a un autre proprietaire, Mamadou Diallo. \nPieces totale = 4, pieces pour Fily Sidibe sur Terrain 155 = 2.'
    }
  },
  files: [
    {path: path.join(__dirname, 'tmp/DSCN0507.JPG'), hash: ''}
  ]
}
