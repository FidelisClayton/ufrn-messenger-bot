import log from 'better-log'

import { getStopPrediction, sendText } from '../api'
import { sendBusStops, sendBusPredictions } from '../messages/bus'
import { typing, quickReply, quickReplyTemplate, textTemplate } from '../components'
import { selectBusStopByName, selectBusStopsById } from '../helpers/selectors'

import {
  BUS_IN_PLACE,
  BUS_LOCAL,
  NEXT_BUS,
  REMAINING_BUS_STOPS,
  SELECT_BUS_STOP,
  USER_PICK_BUS,
} from '../constants'

export default {
  [USER_PICK_BUS]: (senderId, event) => {
    return sendBusStops(event)
  },

  [REMAINING_BUS_STOPS]: (senderId, event) => {
    return sendBusStops(event, 10)
  },

  [SELECT_BUS_STOP]: (senderId, payload, busStops) => {
    return getStopPrediction(payload)
      .then(res => sendBusPredictions(res, senderId))
      .catch(log)
  },

  [NEXT_BUS]: (senderId, event) => {
    return sendBusStops(event)
  },

  [BUS_LOCAL]: async (senderId, locals, busStops) => {
    const selectedStops = selectBusStopByName(locals, busStops)

    await sendText(textTemplate({
      text: 'Um momento, vou verificar.',
      senderId
    }))

    return selectedStops.forEach(stop => {
      getStopPrediction(stop.stopId)
        .then(res => sendBusPredictions(res, senderId))
        .catch(err => log(err))
    })
  },

  [BUS_IN_PLACE]: async (senderId, locals, busStops) => {
    const selectedStops = selectBusStopByName(locals, busStops)

    if(selectedStops.length > 0) {
      await sendText(textTemplate({
        text: 'Um momento, vou verificar.',
        senderId
      }))

      return selectedStops.forEach(async function(busStop) {
        sendText(typing({
          senderId,
          typing: true
        }))

        const stopPrediction = await getStopPrediction(busStop.stopId)

        if(stopPrediction.arrival.length > 1 || stopPrediction.departure.length > 1) {
          sendBusPredictions(stopPrediction, senderId)
        } else {
          sendText(textTemplate({
            text: 'Hmmm, parece que não tem mais ônibus...',
            senderId
          }))
        }
      })
    } else {
      return sendText(textTemplate({
        text: 'Hmmm, por enquanto não encontrei ônibus à caminho :/',
        senderId
      }))
    }
  }
}
