import axios from 'axios'

export const FACEBOOK_ENDPOINT = "https://graph.facebook.com/v2.6"

export function sendText(data, token = process.env.MESSENGER_TOKEN) {
  return axios.post(`${FACEBOOK_ENDPOINT}/me/messages`, data, {
    params: {
      access_token: token
    }
  })
  .then(res => res.data)
  .catch(err => err)
}
