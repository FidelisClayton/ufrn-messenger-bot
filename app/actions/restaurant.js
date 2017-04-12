import log from 'better-log'

import { formatDateToRU } from '../helpers/presenters'
import { sendText, getAlmoco, getJantar } from '../api'
import { sendMeal } from '../messages/restaurant'
import { quickReply, quickReplyTemplate } from '../components'

import {
  USER_PICK_RU,
  USER_PICK_ALMOCO,
  USER_PICK_JANTAR,
  RESTAURANT,
  PARAMETERS,
} from '../constants'

export default {
  [USER_PICK_RU]: (senderId) => {
    return sendText(quickReplyTemplate({
      senderId,
      text: 'Almoço ou Jantar?',
      quickReplies: [
        quickReply({ title: 'Almoço', payload: USER_PICK_ALMOCO }),
        quickReply({ title: 'Jantar', payload: USER_PICK_JANTAR })
      ]
    }))
  },

  [USER_PICK_ALMOCO]: (senderId) => {
    return getAlmoco(formatDateToRU(new Date()))
      .then(res => sendMeal(res, senderId))
      .then(log)
      .catch(log)
  },

  [USER_PICK_JANTAR]: (senderId) => {
    return getJantar(formatDateToRU(new Date()))
      .then(res => sendMeal(res, senderId))
  },

  [RESTAURANT]: (senderId, parameters) => {
    if (parameters.refeicao === PARAMETERS.refeicao.jantar) {
      return getJantar(formatDateToRU(new Date()))
        .then(res => sendMeal(res, senderId))
        .then(log)
        .catch(log)
    } else if (parameters.refeicao === PARAMETERS.refeicao.almoco) {
      return getAlmoco(formatDateToRU(new Date()))
        .then(res => sendMeal(res, senderId))
        .then(log)
        .catch(log)
    } else {
      return sendText(quickReplyTemplate({
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
  }
}
