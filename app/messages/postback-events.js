import log from 'better-log'

import { SELECT_BUS_STOP, NEXT_BUS } from '../constants'

import {
  getStopPrediction,
} from '../api'

import {
  sendBusPredictions
} from './bus'

import { sendText } from '../api'
import { quickReply, quickReplyTemplate } from '../components'

export default event => {
  const sender = event.sender.id
  log(event)

  switch(event.postback.payload) {
    case 'GET_STARTED_PAYLOAD':
      sendText(quickReplyTemplate({
        senderId: sender,
        text: 'Oi, como posso te ajudar?',
        quickReplies: [
          quickReply({
            title: 'Ônibus',
            payload: NEXT_BUS
          }),
          quickReply({
            title: 'Restaurante Universitário',
            payload: 'RU'
          })
        ]
      }))
      break
    default: {
      const [action, payload] = event.postback.payload.split('-')[0]

      switch(action) {
        case SELECT_BUS_STOP:
          getStopPrediction(payload)
            .then(res => sendBusPredictions(res, sender))
            .catch(err => err)
          break

        default:
          break
      }
    }
  }
}
