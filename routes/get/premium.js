const loggedInFunction = require('../../public/javascripts/loggedIn')
const sidepanelType = 'sidebar'

module.exports = {
    name: "/premium",
    run: async (req, res) => {
        const loggedInInfo = await loggedInFunction(req, res)

        res.render('premium', {
            sidepanelType,
            loggedIn: loggedInInfo.loggedIn,
            userData: loggedInInfo.data?.user
        })
    }
}