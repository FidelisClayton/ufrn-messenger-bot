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
  textTemplate
} from '../components'

import busStops from '../../data/bus-stops'

export default ({action, speech, parameters}, event, senderId) => {
  const { locais } = parameters

  switch(action) {
    case NEXT_BUS: {
      sendText(textTemplate({
        text: speech,
        senderId
      }))

      sendBusStops(event, 0)
      break
    }

    case BUS_LOCAL: {
      const selectedStops = selectBusStopByName(locais, busStops)

      selectedStops.forEach(stop => {
        getStopPrediction(stop.stopId)
          .then(res => sendBusPredictions(res, senderId))
          .catch(err => console.log(err))
      })
      break
    }

    case BUS_IN_PLACE: {
      sendText(textTemplate({
        text: 'Um momento, vou verificar.',
        senderId
      }))

      const selectedStops = selectBusStopByName(locais, busStops)

      selectedStops.forEach(async function(busStop) {
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
