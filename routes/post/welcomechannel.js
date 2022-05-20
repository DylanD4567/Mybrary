module.exports = {
  name: '/welcomechannel',
  run: async (req, res) => {

    const configSchema = require('../../models/config-schema')
    const client = require('../../server').client

    const channelId = req.body.welcomeChannelId;
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
          WelcomeChannel: null
        })
      } else {
        await configSchema.findOneAndUpdate({
          guildId
        }, {
          WelcomeChannel: channelId
        }, {
          upsert: true
        })
      }
    }

    res.redirect(`/configuration`)
  }
}