module.exports = {
  name: '/logout',
  run: async (req, res) => {
    const schema = require("../../models/dashboard");
    const jwt = require("jsonwebtoken");

    if (req.cookies.token && req.cookies.token.length > 0) {
      let decoded;

      try {
        decoded = jwt.verify(req.cookies.token, process.env.jwt_secret);
      } catch (e) {
        return res.redirect('/');
      }

      if (decoded) {
        await schema.findOneAndDelete({
          _id: decoded.uuid
        })

        res.clearCookie('token')
      }
  
    }

    res.redirect(`/`)
  }
}