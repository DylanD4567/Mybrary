module.exports = {
  name: '/chatbotchannel',
  run: async (req, res) => {

    const configSchema = require('../../models/config-schema')
    const client = require('../../server').client
    
    const channelId = req.body.chatbotChannelId;
    const guildId = req.query.id || req.cookies.guildId;

    if (channelId === '') return res.redirect(`/configuration`)

    if (guildId) {
      const guild = client.guilds.cache.get(guildId)
      let name = '';
      name = guild.name;

      if (channelId === 'None Set') {
        await configSchema.findOneAndUpdate({
          guildId
        }, {
          ChatbotChannel: null
        })
      } else {
        await configSchema.findOneAndUpdate({
          guildId
        }, {
          ChatbotChannel: channelId
        }, {
          upsert: true
        })
      }
    }

    res.redirect(`/configuration`)
  }
}