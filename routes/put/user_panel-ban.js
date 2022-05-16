const loggedInFunction = require('../../public/javascripts/loggedIn')

module.exports = {
    name: "/user_panel/ban",
    run: async (req, res) => {
        const loggedInInfo = await loggedInFunction(req, res)

        const client = require('../../server').client;
        const userId = req.query.userId;
        const guildId = loggedInInfo.guildId;
        const guild = client.guilds.cache.get(guildId);
        const member = guild.members.cache.get(userId);
        
        if (!userId || !guildId || !member) return res.redirect('/panel')

        if (loggedInInfo.loggedIn === true) {
            if(member.bannable) {
                member.ban()
            } else {
                return res.redirect(`/user_panel?userId=${userId}&errorMessage=Member not bannable!`)
            }

            setTimeout(() => {
                res.redirect(`/panel`)
            }, 1000);
        }
    }
}