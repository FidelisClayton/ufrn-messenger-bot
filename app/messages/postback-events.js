import log from 'better-log'

import {
  SELECT_BUS_STOP,
  GET_STARTED_PAYLOAD,
} from '../constants'

import { getStopPrediction, sendText } from '../api'
import { sendBusPredictions } from './bus'
import { quickReply, quickReplyTemplate, typing } from '../components'

import busStops from '../../data/bus-stops'
import busActions from '../actions/bus'
import generalActions from '../actions/general'

export default async event => {
  const senderId = event.sender.id

  await sendText(typing({
    senderId,
    typing: true
  }))

  switch(event.postback.payload) {
    case GET_STARTED_PAYLOAD:
      return generalActions[GET_STARTED_PAYLOAD](senderId)

    default: {
      const [action, payload] = event.postback.payload.split('-')[0]

      switch(action) {
        case SELECT_BUS_STOP:
          return busActions[SELECT_BUS_STOP](senderId, payload, busStops)

        default:
          break
      }
    }
  }
}
