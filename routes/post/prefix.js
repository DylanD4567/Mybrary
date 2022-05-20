module.exports = {
  name: '/prefix',
  run: async (req, res) => {

    const configSchema = require('../../models/config-schema')
    const client = require('../../server').client

    const prefix = req.body.prefix;
    const guildId = req.query.id || req.cookies.guildId;
    let name = '';

    if (prefix === '') return res.redirect(`/configuration`)

    if (guildId) {
      const guild = client.guilds.cache.get(guildId)
      name = guild.name;

      await configSchema.findOneAndUpdate({
        guildId
      }, {
        prefix
      }, {
        upsert: true
      })
    }

    res.redirect(`/configuration`)
  }
}