import express from 'express'
import bodyParser from 'body-parser'

import {
  messageEvents,
  tokenVerify
} from './app/handlers'

const app = express()

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hi I am a chatbot')
})

app.get('/webhook/', tokenVerify)
app.post('/webhook/', messageEvents)


app.listen(app.get('port'))
