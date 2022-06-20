const dashboardSchema = require("../../models/dashboard");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "/callback",
    run: async (req, res) => {
        if (!req.query.code) res.redirect('/login');
        let oauthData;
        try {
            oauthData = await process.oauth.tokenRequest({
                code: req.query.code,
                scope: "identify",
                grantType: "authorization_code",
            });
        } catch (e) {};
        if (!oauthData) return res.redirect('/login');
        const user = await process.oauth.getUser(oauthData.access_token);

        let data = await dashboardSchema.findOne({
            userId: user.id
        });

        if (!data) data = new dashboardSchema({
            userId: user.id
        });


        const id = data._id.toString();
        data.access_token = oauthData.access_token;
        data.refresh_token = oauthData.refresh_token;
        data.expires_in = oauthData.expires_in;
        data.secretAccessKey = jwt.sign({
            userId: user.id,
            uuid: id
        }, process.env.jwt_secret);

        data.user = {
            id: user.id,
            username: user.username,
            discriminator: user.discriminator,
            avatar: user.avatar,
            pfp: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`
        };

        await data.save();

        res.cookie('token', data.secretAccessKey, {
            maxAge: 86400000
        });

        res.redirect('/dashboard');
    }
}