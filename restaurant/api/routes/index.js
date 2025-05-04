var express = require('express')
var router = express.Router()

class MenuItem {
  constructor (title, price) {
    this.title = title
    this.price = price
  }
}

/**
 * GET /
 */
router.get('/', function(req, res, next) {
  res.json([
    new MenuItem('Салат', 100),
    new MenuItem('Суп', 300),
    new MenuItem('Компот', 100)
  ])
  res.end()
})

module.exports = router;
