import {
  REMAINING_BUS_STOPS,
  SELECT_BUS_STOP,
  USER_PICK_BUS,
  USER_PICK_RU,
  USER_PICK_ALMOCO,
  USER_PICK_JANTAR
} from '../constants'

import { sendText } from '../api'
import { typing } from '../components'

import busActions from '../actions/bus'
import restaurantActions from '../actions/restaurant'
import busStops from '../../data/bus-stops'

export default async function(event) {
  const { message, sender } = event
  const senderId = sender.id

  const replyPayload = message.quick_reply.payload
  const [action, payload] = replyPayload.split('-')

  await sendText(typing({
    senderId,
    typing: true
  }))

  switch(action) {
    case USER_PICK_BUS:
      return busActions[USER_PICK_BUS](senderId, event)

    case REMAINING_BUS_STOPS:
      return busActions[REMAINING_BUS_STOPS](senderId, event)

    case SELECT_BUS_STOP:
      return busActions[SELECT_BUS_STOP](senderId, payload, busStops)

    case USER_PICK_RU:
      return restaurant[USER_PICK_RU](senderId)

    case USER_PICK_ALMOCO:
      return restaurantActions[USER_PICK_ALMOCO](senderId)

    case USER_PICK_JANTAR:
      return restaurantActions[USER_PICK_JANTAR](senderId)
  }
}
