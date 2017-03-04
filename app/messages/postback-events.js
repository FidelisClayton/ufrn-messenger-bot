import { SELECT_BUS_STOP } from '../constants'

import {
  getStopPrediction,
} from '../api'

import {
  sendBusPredictions
} from './bus'

export default event => {
  const sender = event.sender.id

  switch(event.postback.payload) {
    default: {
      const [action, payload] = event.postback.payload.split('-')[0]

      switch(action) {
        case SELECT_BUS_STOP:
          getStopPrediction(payload)
            .then(res => sendBusPredictions(res, sender))
            .catch(err => err)
          break

        default:
          break
      }
    }
  }
}
