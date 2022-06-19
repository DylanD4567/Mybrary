const loggedInFunction = require('../../public/javascripts/loggedIn')
const configSchema = require('../../models/config-schema')
const sidepanelType = 'sidebar-panel'

module.exports = {
  name: '/join-leave-settings',
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

      let channels = []
      const channels1 = guild.channels.cache

      for (const channel of channels1) {
        if (channel[1].type === 'GUILD_TEXT') {
          channels.push({
            id: channel[0],
            name: channel[1].name
          })
        }
      }

      if (!req.cookies.guildId) {
        res.cookie('guildId', guildId, {
          maxAge: 86400000
        });
      }



      const configData = await configSchema.findOne({
        guildId
      })

      let joinMessageActive = false
      if (configData?.WelcomeChannel) joinMessageActive = true

      let welcomeChannel = ''
      if (configData) welcomeChannel = configData.WelcomeChannel

      let welcomeMessage = ''
      if (configData) welcomeMessage = configData.WelcomeMessage

      let leaveMessageActive = false
      if (configData?.LeaveChannel) leaveMessageActive = true

      let leaveChannel = ''
      if (configData) leaveChannel = configData.LeaveChannel

      let leaveMessage = ''
      if (configData) leaveMessage = configData.LeaveMessage



      if (member.permissions.has('ADMINISTRATOR')) {
        res.render("modules/join-leave-settings", {
          sidepanelType,
          loggedIn: loggedInInfo.loggedIn,
          userData: loggedInInfo.data?.user,
          name: guild.name,
          search: req.query.search,

          id: guild.id,
          channels,
          welcomeMessage,
          welcomeChannel,
          joinMessageActive,
          leaveMessage,
          leaveChannel,
          leaveMessageActive
        })
      } else res.redirect("/dashboard")
    } else res.redirect("/")

  }
}