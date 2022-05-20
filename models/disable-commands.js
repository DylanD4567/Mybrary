const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    command: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('disable-commands', Schema)