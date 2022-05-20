module.exports = {
  name: '/disable-cmd',
  run: async (req, res) => {
    const guildId = req.body.guildId
    const active = req.body.active
    const command = req.body.command

    const cmdSchema = require('../../models/disable-commands')

    if (active === true) {
      await cmdSchema.findOneAndDelete({
        guildId,
        command
      })
    } else {
      await cmdSchema.findOneAndUpdate({
        guildId,
        command
      }, {
        guildId,
        command
      }, {
        upsert: true
      })
    }

  }
}