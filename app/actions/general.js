
import log from 'better-log'

import { formatDateToRU } from '../helpers/presenters'
import { sendText, getAlmoco, getJantar } from '../api'
import { sendMeal } from '../messages/restaurant'
import { typing, quickReply, quickReplyTemplate } from '../components'

import {
  USER_PICK_RU,
  USER_PICK_BUS,
  GET_STARTED_PAYLOAD,
} from '../constants'

export default {
  [GET_STARTED_PAYLOAD]: (senderId) => {
    return sendText(quickReplyTemplate({
      senderId,
      text: 'Oi, como posso te ajudar?',
      quickReplies: [
        quickReply({
          title: 'Ônibus',
          payload: USER_PICK_BUS
        }),
        quickReply({
          title: 'Cardápio do RU',
          payload: USER_PICK_RU
        })
      ]
    }))
  },
}
