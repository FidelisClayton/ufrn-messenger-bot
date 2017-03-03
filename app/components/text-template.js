export default ({ senderId, text }) => ({
  recipient: {
    id: senderId
  },
  message: {
    text
  }
})
