import axios from 'axios'

export const API_AI_ENDPOINT = 'https://api.api.ai/api'

export const BUS_LOCAL = 'BUS_LOCAL'
export const BUS_ACTION_PLACE = 'BUS_ACTION_PLACE'
export const BUS_IN_PLACE = 'BUS_IN_PLACE'
export const NEXT_BUS = 'NEXT_BUS'

function generateRandomSessionId() {
  return `${Math.floor(Math.random() * 100)}-${Date.now()}`
}

export function textRequest(query, token = process.env.API_AI_CLIENT_TOKEN) {
  return axios.get(`${API_AI_ENDPOINT}/query`, {
    params: {
      query,
      lang: 'pt-br',
      sessionId: generateRandomSessionId()
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => res.data.result)
  .catch(err => err)
}
