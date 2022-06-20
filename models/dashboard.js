const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    userId: String,
    access_token: String,
    refresh_token: String,
    expires_in: Number,
    secretAccessKey: String,
    user: {
        id: String,
        username: String,
        discriminator: String,
        avatar: String,
        pfp: String
    },
    lastUpdate: {
        type: Number,
        default: Date.now()
    }
})

module.exports = mongoose.model('dashboard', Schema)