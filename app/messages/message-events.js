import log from 'better-log'

import {
  NEXT_BUS,
  BUS_LOCAL,
  BUS_IN_PLACE
} from '../constants'

import {
  getStopPrediction,
  sendText
} from '../api'

import {
  selectBusStopByName,
} from '../helpers/selectors'

import {
  sendBusPredictions,
  sendBusStops
} from './bus'

import {
  textTemplate,
  typing
} from '../components'

import busStops from '../../data/bus-stops'

export default async function({action, speech, parameters}, event, senderId) {
  const { locais } = parameters
  log(event)

  switch(action) {
    case NEXT_BUS: {
      sendText(typing({
        senderId,
        typing: true
      }))

      sendBusStops(event)
      break
    }

    case BUS_LOCAL: {
      const selectedStops = selectBusStopByName(locais, busStops)

      await sendText(textTemplate({
        text: 'Um momento, vou verificar.',
        senderId
      }))

      sendText(typing({
        senderId,
        typing: true
      }))

      selectedStops.forEach(stop => {
        getStopPrediction(stop.stopId)
          .then(res => sendBusPredictions(res, senderId))
          .catch(err => log(err))
      })
      break
    }

    case BUS_IN_PLACE: {
      const selectedStops = selectBusStopByName(locais, busStops)

      if(selectedStops.length > 0) {
        await sendText(textTemplate({
          text: 'Um momento, vou verificar.',
          senderId
        }))

        selectedStops.forEach(async function(busStop) {
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
        sendText(textTemplate({
          text: 'Hmmm, por enquanto não encontrei ônibus à caminho :/',
          senderId
        }))
      }

      break
    }
    default: {
      sendText(textTemplate({
        text: speech,
        senderId
      }))

      break
    }
  }
}
