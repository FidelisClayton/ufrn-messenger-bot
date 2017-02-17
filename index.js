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
import { getStopPrediction } from './services/cittamobi'
import {
  sendBusStops,
  sendBusPredictions
} from './messages/postbacks'

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

import {
  selectBusStopById,
  selectBusStopByName
} from './helpers/functions'

import element from './helpers/elements'
import busStops from './data/bus-stops'

const app = express()
const tokens = {
  fb: process.env.MESSENGER_TOKEN,
  ai: process.env.API_AI_CLIENT_TOKEN
}

app.set('port', (process.env.PORT || 5000))

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
          console.log(res)
          switch(res.action) {
            case NEXT_BUS:
              console.log(NEXT_BUS)

              sendText(textMessage({
                text: res.speech,
                senderId: sender
              }))

              sendBusStops(event, 0)
              break
            case BUS_LOCAL:
              console.log(BUS_LOCAL)

              sendText(selectBus(event))
              break
            case BUS_IN_PLACE:
              sendText(textMessage({
                text: "Um momento, vou verificar.",
                senderId: sender
              }))

              const { locais } = res.parameters
              console.log(BUS_IN_PLACE)

              const selectedStops = selectBusStopByName(locais, busStops)

              selectedStops.forEach(async function(busStop) {
                const stopPrediction = await getStopPrediction(busStop.stopId)

                // await sendText(textMessage({
                //   text: res.speech,
                //   senderId: sender
                // }))

                console.log(stopPrediction)

                if(stopPrediction.arrival.length > 1 || stopPrediction.departure.length > 1) {
                  console.log("================== SEND BUS =========")
                  sendBusPrediction(stopPrediction, sender)
                } else {
                  console.log("============== N VAI DAR N ============")
                  sendText(textMessage({
                    text: "Hmmm, parece que não tem mais ônibus...",
                    senderId: sender
                  }))
                }
              })

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
      console.log(event.postback)
      switch(event.postback.payload) {
        case "ONIBUS":
          sendText(selectBus(event), tokens.ai)
        default:
          const action = event.postback.payload.split("[")[0]
          const actionData = event.postback.payload.split("[")[1].split("]")[0]

          switch(action) {
            case "STOP_LIST_PAGE":
              sendBusStops(event, actionData)
              break

            case "SELECT_BUS_STOP":
              getStopPrediction(actionData)
                .then(res => sendBusPredictions(res, sender))
                .catch(err => console.log(err))

              break
            default:
              break
          }
      }
    }
  })

  res.sendStatus(200)
})


app.listen(app.get('port'), () => {
  console.log(`App running on port ${app.get('port')}`)
})
