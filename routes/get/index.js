const loggedInFunction = require('../../public/javascripts/loggedIn')
const sidepanelType = 'sidebar'

module.exports = {
    name: "/",
    run: async (req, res) => {
        const loggedInInfo = await loggedInFunction(req, res)

        res.render('index', {
            sidepanelType,
            loggedIn: loggedInInfo.loggedIn,
            userData: loggedInInfo.data?.user
        })
    }
}