import { sendText } from '../api'
import { quickReply, quickReplyTemplate } from '../components'

import {
  USER_PICK_RU,
  USER_PICK_BUS,
  GET_STARTED_PAYLOAD,
} from '../constants'

export default {
  [GET_STARTED_PAYLOAD]: (senderId, text = 'Oi, como posso te ajudar?') => {
    return sendText(quickReplyTemplate({
      senderId,
      text,
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
