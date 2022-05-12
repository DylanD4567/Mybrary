const express = require("express");
const router = express.Router();

const loggedInFunction = require('../public/javascripts/loggedIn')
const sidepanelType = 'sidebar'

router.get('/', async (req, res) => {
  const loggedInInfo = await loggedInFunction(req, res)

  res.render('index', {
    sidepanelType,
    loggedIn: loggedInInfo.loggedIn,
    userData: loggedInInfo.data
  })
})

module.exports = router