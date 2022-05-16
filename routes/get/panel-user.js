const loggedInFunction = require('../../public/javascripts/loggedIn')
const sidepanelType = 'sidebar-panel'

module.exports = {
  name: '/user_panel',
  run: async (req, res) => {
    const loggedInInfo = await loggedInFunction(req, res)

    const client = require('../../server').client
    const guildId = loggedInInfo.guildId


    if (!guildId) return res.redirect('/dashboard');

    if (loggedInInfo.loggedIn === true) {
      let data = loggedInInfo.data
    
      // VIEWER INFO
      const userId = data.userId;
      const guild = client.guilds.cache.get(guildId)
      const member = guild.members.cache.get(userId)

      // USER INFO
      const userIdPage = req.query.userId
      if (!userIdPage) return res.redirect('/panel')
      
      const errorMessage = req.query.errorMessage
      const memberPage = guild.members.cache.get(userIdPage)
      const usernamePage = memberPage.user.username
      const profilePicPage = memberPage.displayAvatarURL()
      let timedout = 'Timeout';
      let statusPage = memberPage.presence?.status || 'offline'

      if (statusPage === 'online') statusPage = 'circle online';
      if (statusPage === 'offline') statusPage = 'circle offline';
      if (statusPage === 'dnd') statusPage = 'minus-circle';
      if (statusPage === 'idle') statusPage = 'moon';

      if (memberPage.communicationDisabledUntilTimestamp !== null) timedout = 'Remove Timeout'

      const pageData = {
        username: usernamePage,
        userId: userIdPage,
        profilePic: profilePicPage,
        status: statusPage,
        timedout
      }

      // USER ROLES
      const allRoles = memberPage.roles.cache;
      let roles = [];
      allRoles.forEach(role => {
        roles.push({
          name: role.name,
          color: role.hexColor
        })
      })

      if (!req.cookies.guildId) {
        res.cookie('guildId', guildId, {
          maxAge: 86400000
        });
      }

      if (member.permissions.has('ADMINISTRATOR')) {
        res.render("panel/user_panel", {
          sidepanelType,
          loggedIn: loggedInInfo.loggedIn,
          userData: loggedInInfo.data?.user,
          id: guild.id,
          name: guild.name,
          pageData,
          search: '',
          roles,
          errorMessage
        })
      } else res.redirect("/dashboard")
    } else res.redirect("/")

  }
}