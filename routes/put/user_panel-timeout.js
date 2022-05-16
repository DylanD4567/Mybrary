const loggedInFunction = require('../../public/javascripts/loggedIn')

module.exports = {
    name: "/user_panel/timeout",
    run: async (req, res) => {
        const loggedInInfo = await loggedInFunction(req, res)

        const client = require('../../server').client;
        const userId = req.query.userId;
        const guildId = loggedInInfo.guildId;
        const guild = client.guilds.cache.get(guildId);
        const member = guild.members.cache.get(userId);
        
        if (!userId || !guildId || !member) return res.redirect('/panel')

        if (loggedInInfo.loggedIn === true) {
            if(member.moderatable) {
                if (member.communicationDisabledUntilTimestamp === null) {
                    member.timeout(604800000)
                } else {
                    member.timeout(null)
                }
            } else {
                return res.redirect(`/user_panel?userId=${userId}&errorMessage=Member not moderatable!`)
            }

            setTimeout(() => {
                res.redirect(`/user_panel?userId=${userId}`)
            }, 1000);
        }
    }
}