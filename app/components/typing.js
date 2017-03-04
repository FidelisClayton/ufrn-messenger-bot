export default ({senderId, typing }) => ({
  recipient: {
    id: senderId
  },
  sender_action: typing ? 'typing_on' : 'typing_off'
})
