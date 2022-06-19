module.exports = {
  name: '/joinMessageAdd',
  run: async (req, res) => {

    const configSchema = require('../../models/config-schema')
    const guildId = req.query.id || req.cookies.guildId;
    const message = req.body.message
    const channelId = req.body.channelId

    if (guildId) {
      await configSchema.findOneAndUpdate({
        guildId
      }, {
        WelcomeChannel: channelId,
        WelcomeMessage: message
      })
    }
  }
}