export function urlButton({ url, title }) {
  return {
    type: "web_url",
    url: url,
    title: title
  }
}

export function postbackButton({ payload, title }) {
  return {
    type: "postback",
    payload: payload,
    title: title
  }
}
