export default ({ senderId, elements }) => ({
  recipient: {
    id: senderId
  },
  message: {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements
      }
    }
  }
})
