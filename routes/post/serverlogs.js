module.exports = {
  name: '/serverlogs',
  run: async (req, res) => {

    const configSchema = require('../../models/config-schema')
    const client = require('../../server').client

    const channelId = req.body.serverLogsChannelId;
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
          ServerLogsChannel: null
        })
      } else {
        await configSchema.findOneAndUpdate({
          guildId
        }, {
          ServerLogsChannel: channelId
        }, {
          upsert: true
        })
      }
    }

    res.redirect(`/configuration`)
  }
}