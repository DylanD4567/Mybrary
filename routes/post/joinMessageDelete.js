module.exports = {
  name: '/joinMessageDelete',
  run: async (req, res) => {

    const configSchema = require('../../models/config-schema')
    const guildId = req.query.id || req.cookies.guildId;

    if (guildId) {
      await configSchema.findOneAndUpdate({
        guildId
      }, {
        WelcomeChannel: null,
        WelcomeMessage: ''
      })
    }
  }
}