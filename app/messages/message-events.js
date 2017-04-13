import {
  NEXT_BUS,
  BUS_LOCAL,
  BUS_IN_PLACE,
  RESTAURANT,
  UNKNOWN,
  GET_STARTED_PAYLOAD,
} from '../constants'

import { sendText } from '../api'
import { typing, textTemplate } from '../components'

import generalActions from '../actions/general'
import busActions from '../actions/bus'
import restaurantActions from '../actions/restaurant'

import busStops from '../../data/bus-stops'

export default async function({action, speech, parameters}, event, senderId) {
  const { locais } = parameters

  await sendText(typing({
    senderId,
    typing: true
  }))

  switch(action) {
    case NEXT_BUS:
      return busActions[NEXT_BUS](senderId, event)

    case BUS_LOCAL:
      return busActions[BUS_LOCAL](senderId, locais, busStops)

    case BUS_IN_PLACE:
      return busActions[BUS_IN_PLACE](senderId, locais, busStops)

    case RESTAURANT:
      return restaurantActions[RESTAURANT](senderId, parameters)

    case UNKNOWN:
      return generalActions[GET_STARTED_PAYLOAD](senderId, speech)

    default:
      return sendText(textTemplate({ text: speech, senderId }))
  }
}
