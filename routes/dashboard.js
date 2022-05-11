const express = require("express");
const router = express.Router()

const sidepanelType = 'sidebar'

router.get('/', async (req, res) => {

  const jwt = require('jsonwebtoken')
  const dashboardSchema = require('../models/dashboard')
  const client = require('../server').client
  const guildId = req.query.id || req.body.id || req.cookies.guildId

  if (req.query.id) {
    if (req.cookies.guildId) {
      if (req.query.id !== req.cookies.guildId) {
        res.cookie('guildId', guildId, 0);
      }
    }
  }


  if (!req.cookies.token) return res.redirect('login')

  let decoded;
  let loggedIn = false;

  try {
    decoded = jwt.verify(req.cookies.token, process.env.jwt_secret);
  } catch (e) {}

  if (decoded) {
    let data = await dashboardSchema.findOne({
      _id: decoded.uuid
    });

    loggedIn = true;

    res.render('dashboard', {
      sidepanelType,
      loggedIn
    })
  } else res.redirect("/")
})

module.exports = router