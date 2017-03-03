import { textRequest } from '../api'

import messagingEventHandler from '../messages/message-events'
import postbackEventHandler from '../messages/postback-events'

export default (req, res) => {
  let messaging_events = req.body.entry[0].messaging

  messaging_events.forEach(event => {
    let sender = event.sender.id

    if(event.message && event.message.text) {
      let text = event.message.text

      textRequest(text)
        .then(res => {
          // console.log(res)
          messagingEventHandler(res, event, sender)
        })
    }

    if(event.postback) {
      postbackEventHandler(event)
    }
  })

  res.sendStatus(200)
}
