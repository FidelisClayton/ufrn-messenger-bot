import log from 'better-log'

import {
  getStopPrediction,
  sendText,
  getAlmoco,
  getJantar,
} from '../api'

import {
  sendBusStops,
  sendBusPredictions
} from './bus'

import { sendMeal } from './restaurant'

import {
  REMAINING_BUS_STOPS,
  SELECT_BUS_STOP,
  USER_PICK_BUS,
  USER_PICK_RU,
  USER_PICK_ALMOCO,
  USER_PICK_JANTAR
} from '../constants'

import {
  typing,
  quickReply,
  quickReplyTemplate
} from '../components'

import { selectBusStopById } from '../helpers/selectors'
import { formatDateToRU } from '../helpers/presenters'

import busStops from '../../data/bus-stops'

log.setConfig({depth: 2})

export default async function(res, event, senderId) {
  const replyPayload = event.message.quick_reply.payload
  log(event)

  const [action, payload] = replyPayload.split('-')

  switch(action) {
    case USER_PICK_RU: {
      sendText(quickReplyTemplate({
        senderId,
        text: 'Almoço ou Jantar?',
        quickReplies: [
          quickReply({
            title: 'Almoço',
            payload: USER_PICK_ALMOCO
          }),
          quickReply({
            title: 'Jantar',
            payload: USER_PICK_JANTAR
          })
        ]
      }))
      break
    }

    case USER_PICK_BUS: {
      sendText(typing({
        senderId,
        typing: true
      }))

      sendBusStops(event)
      break
    }

    case REMAINING_BUS_STOPS: {
      sendText(typing({
        senderId,
        typing: true
      }))

      sendBusStops(event, 10)
        .catch(log)
      break
    }

    case SELECT_BUS_STOP: {
      const selectedStop = selectBusStopById(payload, busStops)

      sendText(typing({
        senderId,
        typing: true
      }))

      getStopPrediction(selectedStop.stopId)
        .then(res => sendBusPredictions(res, senderId))
        .catch(log)

      break
    }

    case USER_PICK_ALMOCO: {

      sendText(typing({
        senderId,
        typing: true
      }))

      getAlmoco(formatDateToRU(new Date()))
        .then(res => sendMeal(res, senderId))
        .then(log)
        .catch(log)
      break

    }

    case USER_PICK_JANTAR: {
      sendText(typing({
        senderId,
        typing: true
      }))

      getJantar(formatDateToRU(new Date()))
        .then(res => sendMeal(res, senderId))
        .then(log)
        .catch(log)
    }
  }
}
