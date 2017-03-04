export default (req, res) => {
  if(req.query['hub.verify_token'] === process.env.MESSENGER_TOKEN) {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Wrong Token')
  }
}
