const path = require('path')
module.exports = {
  data: {
    properties: {
      date: '2017-11-03',
      location: 'TWG',
      event: 'Demo',
      participants: ['Bill', 'Oksana', 'Jack', 'Josh', 'Ziemek']
    }
  },
  files: [
    {path: path.join(__dirname, 'tmp/demo.jpg'), hash: ''}
  ]
}
