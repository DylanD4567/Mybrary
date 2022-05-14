const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const schema = mongoose.Schema({
    guildId: reqString,
    ServerLogsChannel: reqString,
    ModerationLogsChannel: reqString,
    ChatbotChannel: String,
    WelcomeChannel: reqString,
    WelcomeMessage: reqString,
    JoinRole: Array,
    shiftLength: String,
    SuggestionsChannel: reqString,
    prefix: {
        type: String,
        default: ';'
    }
})

module.exports = mongoose.model('config', schema)