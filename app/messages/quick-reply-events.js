import log from 'better-log'

import { getStopPrediction } from '../api'

import {
  sendBusStops,
  sendBusPredictions
} from './bus'

import {
  REMAINING_BUS_STOPS,
  SELECT_BUS_STOP,
} from '../constants'

import { selectBusStopById } from '../helpers/selectors'

import busStops from '../../data/bus-stops'

export default (res, event, senderId) => {
  const replyPayload = event.message.quick_reply.payload

  const [action, payload] = replyPayload.split('-')

  switch(action) {
    case REMAINING_BUS_STOPS: {
      sendBusStops(event, 10)
        .catch(err => log(err))
      break
    }

    case SELECT_BUS_STOP: {
      const selectedStop = selectBusStopById(payload, busStops)

      getStopPrediction(selectedStop.stopId)
        .then(res => sendBusPredictions(res, senderId))
        .catch(err => log(err))
    }
  }
}
