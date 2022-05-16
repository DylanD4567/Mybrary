const loggedInFunction = require('../../public/javascripts/loggedIn')
const sidepanelType = 'sidebar-panel'

module.exports = {
  name: '/panel',
  run: async (req, res) => {
    const loggedInInfo = await loggedInFunction(req, res)

    const configSchema = require('../../models/config-schema')
    const client = require('../../server').client
    const guildId = loggedInInfo.guildId
    const viewAllMembers = req.query.viewAllMembers || 'false'
    let viewAllMembersBtn = 'View All'

    if (viewAllMembers === 'true') viewAllMembersBtn = 'View Less'

    if (!guildId) return res.redirect('/dashboard');

    if (loggedInInfo.loggedIn === true) {
      let data = loggedInInfo.data
      
      const userId = data.userId;
      const guild = client.guilds.cache.get(guildId)
      const member = guild.members.cache.get(userId)
      const username = member.user.username
      const profilePic = member.displayAvatarURL()

      // TOP 3 CARDS
      const memberCount = guild.members.cache.size
      const channels = guild.channels.cache.size
      const roles = guild.roles.cache.size

      let prefix = ';'
      let members = [];
      let bots = [];
      let searchMembers = [];

      let searchOptions = {}
      if (req.query.search && req.query.search != '') {
        searchOptions.search = new RegExp(req.query.search, 'i')
      }

      const configData = await configSchema.findOne({
        guildId
      })

      if (configData) prefix = configData.prefix

      const members1 = guild.members.cache

      for (const member of members1) {
        let searchApprove = false;

        if (member[1].user.bot === false) {

          if (member[0].match(searchOptions.search) && searchOptions.search) {
            searchApprove = true
          } else if (member[1].user.username.match(searchOptions.search) && searchOptions.search) {
            searchApprove = true
          } else if (member[1].nickname) {
            if (member[1].nickname.match(searchOptions.search) && searchOptions.search) {
              searchApprove = true
            }
          }

          let status = member[1].presence?.status || 'offline'

          if (status === 'online') status = 'Online';

          if (status === 'offline') status = 'Offline';

          if (status === 'dnd') status = 'DND';

          if (status === 'idle') status = 'Idle';

          if (searchApprove === true) {
            searchMembers.push({
              profilePic: member[1].displayAvatarURL(),
              username: member[1].user.username,
              userId: member[0],
              status,
              searched: true
            })
          }

          members.push({
            profilePic: member[1].displayAvatarURL(),
            username: member[1].user.username,
            userId: member[0],
            status,
            searched: false
          })

        } else {
          bots.push({
            profilePic: member[1].displayAvatarURL(),
            username: member[1].user.username
          })
        }
      }

      if (!req.cookies.guildId) {
        res.cookie('guildId', guildId, {
          maxAge: 86400000
        });
      }

      if (searchMembers[0]) {
        members = []
        searchMembers.forEach(member => {
          members.push(member)
        })
      }

      var statusOrder = ["Online", "DND", "Idle", "Offline"];

      members = members.sort(function(a, b){
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      })

      if (member.permissions.has('ADMINISTRATOR')) {
        res.render("panel/panel", {
          sidepanelType,
          loggedIn: loggedInInfo.loggedIn,
          userData: loggedInInfo.data?.user,
          id: guild.id,
          name: guild.name,
          prefix,
          memberCount,
          channels,
          roles,
          username,
          profilePic,
          members,
          bots,
          viewAllMembers,
          viewAllMembersBtn,
          search: req.query.search,
          active: 'dashboard'
        })
      } else res.redirect("/dashboard")
    } else res.redirect("/")

  }
}