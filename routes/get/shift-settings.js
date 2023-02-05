const loggedInFunction = require('../../public/javascripts/loggedIn')
const configSchema = require('../../models/config-schema')
const sidepanelType = 'sidebar-panel'

module.exports = {
  name: '/shift-settings',
  run: async (req, res) => {
    const loggedInInfo = await loggedInFunction(req, res)

    const client = require('../../server').client
    const guildId = loggedInInfo.guildId

    if (!guildId) return res.redirect('/dashboard');

    if (loggedInInfo.loggedIn === true) {
      let data = loggedInInfo.data
      
      const userId = data.userId;
      const guild = client.guilds.cache.get(guildId)
      const member = guild.members.cache.get(userId)

      if (!req.cookies.guildId) {
        res.cookie('guildId', guildId, {
          maxAge: 86400000
        });
      }


      if (member.permissions.has('ADMINISTRATOR')) {
        res.render("modules/shift-settings", {
          sidepanelType,
          loggedIn: loggedInInfo.loggedIn,
          userData: loggedInInfo.data?.user,
          name: guild.name,
          search: req.query.search,

          id: guild.id,
        })
      } else res.redirect("/dashboard")
    } else res.redirect("/")

  }
}