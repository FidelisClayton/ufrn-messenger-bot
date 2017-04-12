import log from 'better-log'

import {
  NEXT_BUS,
  BUS_LOCAL,
  BUS_IN_PLACE,
  RESTAURANT,
  PARAMETERS,
  USER_PICK_ALMOCO,
  USER_PICK_JANTAR,
} from '../constants'

import { sendText } from '../api'
import { typing, textTemplate } from '../components'
import busActions from '../actions/bus'

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

    default:
      return sendText(textTemplate({ text: speech, senderId }))
  }
}
