export default (req, res) => {
  console.log(req.query)
  if(req.query['hub.verify_token'] === process.env.MESSENGER_TOKEN) {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Wrong Token')
  }
}
