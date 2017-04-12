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

import {
  getStopPrediction,
  sendText,
  getAlmoco,
  getJantar,
} from '../api'

import { selectBusStopByName } from '../helpers/selectors'
import { formatDateToRU } from '../helpers/presenters'

import {
  sendBusPredictions,
  sendBusStops,
} from './bus'

import {
  textTemplate,
  typing,
  quickReplyTemplate,
  quickReply,
} from '../components'

import { sendMeal } from './restaurant'

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

    case RESTAURANT: {
      await sendText(typing({
        senderId,
        typing: true
      }))

      if (parameters.refeicao === PARAMETERS.refeicao.jantar) {
        getJantar(formatDateToRU(new Date()))
          .then(res => sendMeal(res, senderId))
          .then(log)
          .catch(log)
      } else if (parameters.refeicao === PARAMETERS.refeicao.almoco) {
        getAlmoco(formatDateToRU(new Date()))
          .then(res => sendMeal(res, senderId))
          .then(log)
          .catch(log)
      } else {
        sendText(quickReplyTemplate({
          senderId,
          text: 'No Restaurante Universitário temos almoço e jantar, qual você quer consultar?',
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
