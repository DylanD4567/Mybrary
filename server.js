// LIVE WEBSITE LINK //

let disLink = 'https://limitless-dashboardv2.herokuapp.com/callback'


// PRODUCTION INFORMATION //

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  disLink = `http://localhost:${process.env.PORT}/callback`
}


// DISCORD //

const {
  Client,
  Intents
} = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_SCHEDULED_EVENTS,

    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER']
});


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)


  // MODULES //

  const express = require("express")
  const app = express()
  const expressLayouts = require('express-ejs-layouts')
  const bodyParser = require('body-parser')
  const methodOverride = require('method-override')
  const DiscordOauth2 = require("discord-oauth2")
  const cookieParser = require("cookie-parser")
  const fs = require("fs")


  // APP //

  app.set('view engine', 'ejs')
  app.set('views', __dirname + '/views')
  app.set('layout', 'layouts/layout')
  app.use(expressLayouts)
  app.use(methodOverride('_method'))
  app.use(express.static('public'))
  app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
  }))
  app.enable("trust proxy")
  app.set("etag", false)
  app.use(cookieParser())
  app.use(express.json({
    limit: '1mb'
  }))


  // DISCORD SIGN IN LINK //

  process.oauth = new DiscordOauth2({
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    redirectUri: disLink
  })


  // DATABASE //

  const mongoose = require("mongoose")
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })

  const db = mongoose.connection
  db.on('error', error => console.error(error))
  db.once('open', () => console.log('Connected to Mongoose'))


  // ROUTE HANDLERS //

  // GET
  let filesGet = fs.readdirSync("./routes/get").filter(f => f.endsWith(".js"));

  filesGet.forEach(f => {
    const file = require(`./routes/get/${f}`)
    if (file && file.name) {
      app.get(file.name, file.run)
      console.log(`[Dashboard] - (Get) Loaded ${file.name}`);
    }
  })

  // POST
  let filesPost = fs.readdirSync("./routes/post").filter(f => f.endsWith(".js"));

  filesPost.forEach(f => {
    const file = require(`./routes/post/${f}`)
    if (file && file.name) {
      app.post(file.name, file.run)
      console.log(`[Dashboard] - (Post) Loaded ${file.name}`);
    }
  })

  // PUT
  // let filesPut = fs.readdirSync("./routes/put").filter(f => f.endsWith(".js"));

  // filesPut.forEach(f => {
  //   const file = require(`./routes/put/${f}`)
  //   if (file && file.name) {
  //     app.put(file.name, file.run)
  //     console.log(`[Dashboard] - (Put) Loaded ${file.name}`);
  //   }
  // })

  // DELETE
  let filesDelete = fs.readdirSync("./routes/delete").filter(f => f.endsWith(".js"));

  filesDelete.forEach(f => {
    const file = require(`./routes/delete/${f}`)
    if (file && file.name) {
      app.delete(file.name, file.run)
      console.log(`[Dashboard] - (Delete) Loaded ${file.name}`);
    }
  })


  app.listen(process.env.PORT || 3000)

  module.exports.client = client;
})

client.login(process.env.TOKEN)