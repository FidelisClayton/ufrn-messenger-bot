import log from 'better-log'

import { getStopPrediction, sendText } from '../api'

import {
  sendBusStops,
  sendBusPredictions
} from './bus'

import {
  REMAINING_BUS_STOPS,
  SELECT_BUS_STOP,
} from '../constants'

import { typing } from '../components'

import { selectBusStopById } from '../helpers/selectors'

import busStops from '../../data/bus-stops'

export default (res, event, senderId) => {
  const replyPayload = event.message.quick_reply.payload

  const [action, payload] = replyPayload.split('-')

  switch(action) {
    case REMAINING_BUS_STOPS: {
      sendText(typing({
        senderId,
        typing: true
      }))

      sendBusStops(event, 10)
        .catch(err => log(err))
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
        .catch(err => log(err))
    }
  }
}
