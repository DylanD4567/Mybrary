const jwt = require('jsonwebtoken')
const dashboardSchema = require('../../models/dashboard')

async function loggedInInfo(req, res) {
  const guildId = req.query.id || req.body.id || req.cookies.guildId

  if (req.query.id) {
    if (req.cookies.guildId) {
      if (req.query.id !== req.cookies.guildId) {
        res.cookie('guildId', guildId, 0);
      }
    }
  }

  let decoded;
  let loggedIn = false;
  let data;

  try {
    decoded = jwt.verify(req.cookies.token, process.env.jwt_secret);
  } catch (e) {}

  if (decoded) {
    data = await dashboardSchema.findOne({
      _id: decoded.uuid
    });

    loggedIn = true;
  }

  console.log(data.access_token)

  return {
    loggedIn,
    _id: decoded?.uuid,
    guildId,
    data
  }
}

module.exports = loggedInInfo