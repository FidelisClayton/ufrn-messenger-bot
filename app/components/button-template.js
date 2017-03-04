export default ({ senderId, text, buttons = [] }) => ({
  recipient: {
    id: senderId
  },
  message: {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: text,
        buttons: buttons
      }
    }
  }
})
