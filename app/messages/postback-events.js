import {
  ONIBUS,
  STOP_LIST_PAGE,
  SELECT_BUS_STOP
} from '../constants'

import {
  getStopPrediction,
} from '../api'

import {
  sendBusStops,
  sendBusPredictions
} from './bus'

export default event => {
  const sender = event.sender.id

  switch(event.postback.payload) {
    case ONIBUS: {
      // Não lembro dessa função
      // sendText(selectBus(event))
      break
    }

    default: {
      const action = event.postback.payload.split('[')[0]
      const actionData = event.postback.payload.split('[')[1].split(']')[0]

      switch(action) {
        case STOP_LIST_PAGE:
          sendBusStops(event, actionData)
          break

        case SELECT_BUS_STOP:
          getStopPrediction(actionData)
            .then(res => sendBusPredictions(res, sender))
            .catch(err => err)
          break

        default:
          break
      }
    }
  }
}
