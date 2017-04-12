import { textRequest } from '../api'

import messagingEventHandler from '../messages/message-events'
import quickReplyEventHandler from '../messages/quick-reply-events'
import postbackEventHandler from '../messages/postback-events'

export default (req, res) => {
  let messaging_events = req.body.entry[0].messaging
  messaging_events.forEach(event => {
    let sender = event.sender.id

    if(event.message && event.message.text && !!!event.message.quick_reply) {
      let { text } = event.message

      textRequest(text, req.sessionID)
        .then(res => {
          messagingEventHandler(res, event, sender)
        })
    }

    if(event.message && event.message.quick_reply) {
      quickReplyEventHandler(event)
    }

    if(event.postback) {
      postbackEventHandler(event)
    }
  })

  res.sendStatus(200)
}
