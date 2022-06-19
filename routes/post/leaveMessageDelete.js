module.exports = {
  name: '/leaveMessageDelete',
  run: async (req, res) => {

    const configSchema = require('../../models/config-schema')
    const guildId = req.query.id || req.cookies.guildId;

    if (guildId) {
      await configSchema.findOneAndUpdate({
        guildId
      }, {
        LeaveChannel: null,
        LeaveMessage: ''
      })
    }
  }
}