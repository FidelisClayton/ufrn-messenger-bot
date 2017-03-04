export default ({ senderId, text, quickReplies }) => ({
  recipient: {
    id: senderId,
  },
  message: {
    text,
    quick_replies: quickReplies
  }
})
