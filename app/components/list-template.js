export default ({ senderId, elements, buttons, topElement = "large" }) => ({
  recipient: {
    id: senderId
  },
  message: {
    attachment: {
      type: "template",
      payload: {
        template_type: "list",
        elements,
        buttons,
        top_element_style: topElement
      }
    }
  }
})
