const loggedInFunction = require('../../public/javascripts/loggedIn')
const cmdSchema = require('../../models/disable-commands')
const configSchema = require('../../models/config-schema')
const sidepanelType = 'sidebar-panel'

module.exports = {
  name: '/commands',
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
      const username = member.user.username
      const profilePic = member.displayAvatarURL()

      const configData = await configSchema.findOne({
        guildId
      })

      if (configData) prefix = configData.prefix


      if (!req.cookies.guildId) {
        res.cookie('guildId', guildId, {
          maxAge: 86400000
        });
      }

      // Find Disabled Cmds
      const disabledCmdResults = await cmdSchema.find({
        guildId
      })

      let disabledCmds = []

      disabledCmdResults.forEach(cmdResult => {
        disabledCmds.push(cmdResult.command)
      });

      if (member.permissions.has('ADMINISTRATOR')) {
        res.render("commands", {
          sidepanelType,
          loggedIn: loggedInInfo.loggedIn,
          userData: loggedInInfo.data?.user,
          id: guild.id,
          name: guild.name,
          prefix,
          username,
          profilePic,
          search: req.query.search,
          disabledCmds,
          active: 'commands'
        })
      } else res.redirect("/dashboard")
    } else res.redirect("/")

  }
}