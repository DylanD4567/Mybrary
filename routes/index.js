const express = require("express");
const router = express.Router()

const sidepanelType = 'sidebar'

router.get('/', async (req, res) => {
  
  res.render('index', {
    sidepanelType
  })
})

module.exports = router