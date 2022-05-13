const loggedInFunction = require('../../public/javascripts/loggedIn')
const sidepanelType = 'sidebar'
const {
    Permissions
} = require('discord.js')

module.exports = {
    name: "/dashboard",
    run: async (req, res) => {

        const client = require('../../server').client
        const loggedInInfo = await loggedInFunction(req, res)

        if (loggedInInfo.loggedIn === false) return res.redirect('/login')

        let guildArray = await process.oauth.getUserGuilds(loggedInInfo.data.access_token)
        let mutualArray = [];

        guildArray.forEach(g => {
            if (g.icon == null) {
                g.avatar = `https://discord.com/assets/f9bb9c4af2b9c32a2c5ee0014661546d.png`
            } else g.avatar = `https://sdn.discordapp.com/icons/${g.id}/${g.icon}.png`;
            

            if (client.guilds.cache.get(g.id)) {
                const bitPermissions = new Permissions(g.permissions_new);

                if (bitPermissions.has(Permissions.FLAGS.MANAGE_GUILD) || bitPermissions.has(Permissions.FLAGS.ADMINISTRATOR || client.guilds.cache.get(g.id).ownerId == loggedInInfo.data.user.id)) g.hasPerm = true
                mutualArray.push(g);
            } else g.hasPerm = false;
        })

        
            res.render('dashboard', {
                sidepanelType,
                loggedIn: loggedInInfo.loggedIn,
                userData: loggedInInfo.data?.user,
                guilds: mutualArray
            })
        
    }
}