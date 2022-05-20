const loggedInFunction = require('../../public/javascripts/loggedIn')
const configSchema = require('../../models/config-schema')
const sidepanelType = 'sidebar-panel'

module.exports = {
  name: '/configuration',
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

      let channels = []
      let prefix = ';'
      let serverLogsChannel = 'Not Set'
      let moderationLogsChannel = 'Not Set'
      let welcomeChannel = 'Not Set'
      let chatbotChannel = 'Not Set'

      // Bot Prefix
      if (configData) prefix = configData.prefix

      // Server Logs Channel
      if (configData) {
        const serverLogsChannelId = configData.ServerLogsChannel;
        if (serverLogsChannelId) {
          serverLogsChannel = `#${guild.channels.cache.get(serverLogsChannelId)?.name}` || 'Channel Not Found';
        }
      }

      // Moderation Logs Channel
      if (configData) {
        const modLogsChannelId = configData.ModerationLogsChannel;
        if (modLogsChannelId) {
          moderationLogsChannel = `#${guild.channels.cache.get(modLogsChannelId)?.name}` || 'Channel Not Found';
        }
      }

      // Welcome Channel
      if (configData) {
        const welcomeChannelId = configData.WelcomeChannel;
        if (welcomeChannelId) {
          welcomeChannel = `#${guild.channels.cache.get(welcomeChannelId)?.name}` || 'Channel Not Found';
        }
      }

      // Chatbot Channel
      if (configData) {
        const chatbotChannelId = configData.ChatbotChannel;
        if (chatbotChannelId) {
          chatbotChannel = `#${guild.channels.cache.get(chatbotChannelId)?.name}` || 'Channel Not Found';
        }
      }

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

      if (member.permissions.has('ADMINISTRATOR')) {
        res.render("configuration", {
          sidepanelType,
          loggedIn: loggedInInfo.loggedIn,
          userData: loggedInInfo.data?.user,
          id: guild.id,
          name: guild.name,
          username,
          profilePic,
          search: req.query.search,
          active: 'configuration',
          
          prefix,
          channels,
          serverLogsChannel,
          moderationLogsChannel,
          welcomeChannel,
          chatbotChannel,
        })
      } else res.redirect("/dashboard")
    } else res.redirect("/")

  }
}