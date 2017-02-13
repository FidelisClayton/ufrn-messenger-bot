import express from 'express'
import axios from 'axios'
import bodyParser from 'body-parser'

import { selectBus } from './messages/postbacks'

import {
  button as buttonTemplate,
  generic as genericTemplate,
  list as listTemplate
} from './helpers/templates'

import {
  urlButton,
  postbackButton
} from './helpers/buttons'

const app = express()

app.set('port', (process.env.PORT || 3000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hi I am a chatbot')
})

app.get('/webhook/', (req, res) => {
  if(req.query['hub.verify_token'] === process.env.MESSENGER_TOKEN) {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Wrong token')
  }
})

app.post('/webhook/', (req, res) => {
  let messaging_events = req.body.entry[0].messaging

  messaging_events.forEach(event => {
    let sender = event.sender.id

    if(event.message && event.message.text) {
      let text = event.message.text

      var template = buttonTemplate({
        senderId: sender,
        text: "O que deseja fazer?",
        buttons: [
          postbackButton({
            payload: "RESTAURANTE",
            title: "RU"
          }),
          postbackButton({
            payload: "ONIBUS",
            title: "Ônibus"
          })
        ]
      })

      if(text === "Circular") {
        sendText(template)
      }
    }

    if(event.postback) {
      switch(event.postback.payload) {
        case "ONIBUS":
          selectBus(event)
      }
    }
  })

  res.sendStatus(200)
})

export function sendText(data) {
  axios.post("https://graph.facebook.com/v2.6/me/messages", data, {
    params: {
      access_token: process.env.MESSENGER_TOKEN
    }
  })
  .then(res => console.log("RESPONSE: ", JSON.stringify(res.data)))
  // .catch(err => console.log("ERROR: ", console.log(err)))
}

app.listen(app.get('port'), () => {
  console.log(`App running on port ${app.get('port')}`)
})
