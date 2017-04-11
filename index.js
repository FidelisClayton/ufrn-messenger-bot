import express from 'express'
import session from 'express-session'
import uuidV1 from 'uuid'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import {
  messageEvents,
  tokenVerify
} from './app/handlers'

const app = express()

const sessionOptions = {
  secret: 'oudri-kanda-larrai',
  saveUninitialized: true,
  resave: true,
  genid: () => uuidV1(),
  cookie: {
    maxAge: 60 * 1000,
    secure: false,
  }
}

app.set('port', (process.env.PORT || 5000))

app.use(cookieParser())
app.use(session(sessionOptions))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hi I am a chatbot')
})

app.get('/webhook/', tokenVerify)
app.post('/webhook/', messageEvents)

app.listen(app.get('port'))
