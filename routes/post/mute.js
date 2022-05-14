module.exports = {
  name: '/panel/mute:id',
  run: async (req, res, next) => {
    console.log(req.query.id)
    res.redirect('/panel')

  }
}