import express from 'express'
import axios from 'axios'
import bodyParser from 'body-parser'

import {
  textRequest,
  BUS_LOCAL,
  BUS_ACTION_PLACE,
  BUS_IN_PLACE,
  NEXT_BUS
} from './services/api-ai'

import { sendText  } from './services/facebook'
import { selectBus } from './messages/postbacks'

import {
  button as buttonTemplate,
  generic as genericTemplate,
  list as listTemplate,
  text as textMessage
} from './helpers/templates'

import {
  urlButton,
  postbackButton
} from './helpers/buttons'

const app = express()
const tokens = {
  fb: process.env.MESSENGER_TOKEN,
  ai: process.env.API_AI_CLIENT_TOKEN
}

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

      textRequest(text)
        .then(res => {
          switch(res.action) {
            case NEXT_BUS:
              sendText(textMessage({
                text: res.speech,
                senderId: sender
              }))

              sendText(selectBus(event))
              break
            case BUS_LOCAL:
              console.log(BUS_LOCAL)
              sendText(selectBus(event))
              break
            default:
              console.log("FALLBACK")
              sendText(textMessage({
                text: res.speech,
                senderId: sender
              }))
              break
          }
        })
    }

    if(event.postback) {
      switch(event.postback.payload) {
        case "ONIBUS":
          sendText(selectBus(event), tokens.ai)
      }
    }
  })

  res.sendStatus(200)
})

app.listen(app.get('port'), () => {
  console.log(`App running on port ${app.get('port')}`)
})
