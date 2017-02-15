export function text({senderId, text}) {
  return {
    recipient: {
      id: senderId
    },
    message: {
      text
    }
  }
}

export function button({ senderId, text, buttons = [] }) {
  return {
    recipient: {
      id: senderId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: text,
          buttons: buttons
        }
      }
    }
  }
}

export function generic({ senderId, elements }) {
  return {
    recipient: {
      id: senderId
    },
    message: {
      attachment: {
        type: "template",
        payload:{
          template_type: "generic",
          elements: elements
        }
      }
    }
  }
}

export function list({ senderId, elements, buttons, topElement = "large" }) {
  return {
    recipient: {
      id: senderId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "list",
          elements: elements,
          buttons: buttons,
          top_element_style: topElement
        }
      }
    }
  }
}
