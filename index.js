import express from 'express'
import axios from 'axios'
import bodyParser from 'body-parser'

const app = express()

app.set('port', (process.env.PORT || 3000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hi I am a chatbot')
})

app.get('/webhook/', (req, res) => {
  if(req.query['hub.verify_token'] === "") {
    res.send(req.query['hub.challenge'])
  }

  res.send('Wrong token')
})

app.listen(app.get('port'), () => {
  console.log(`App running on port ${app.get('port')}`)
})
