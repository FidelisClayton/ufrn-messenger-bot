import axios from 'axios'

import { groupServicesByPredictionType } from './helpers/presenters'
import { selectBusStopById } from './helpers/selectors'
import busStops from '../data/bus-stops'

const API_AI_ENDPOINT = 'https://api.api.ai/api'
const CITTAMOBI_ENDPOINT = 'http://api.plataforma.cittati.com.br'
const FACEBOOK_ENDPOINT = 'https://graph.facebook.com/v2.6'
const RESTAURANT_ENDPOINT = 'http://www.ru.ufrn.br/cardapio'

export const textRequest = (query, sessionId, token = process.env.API_AI_CLIENT_TOKEN) => {
  return axios.get(`${API_AI_ENDPOINT}/query`, {
    params: {
      query,
      lang: 'pt-br',
      sessionId
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => res.data.result)
  .catch(err => err)
}

export const getStopPrediction = stopId => {
  return axios.get(`${CITTAMOBI_ENDPOINT}/m3p/js/prediction/stop/${stopId}`)
      .then(res => res.data)
      .then(res => ({
        busStop: selectBusStopById(stopId, busStops),
        ...groupServicesByPredictionType(res.services)
      }))
}

export const sendText = (data, token = process.env.MESSENGER_TOKEN) => {
  return axios.post(`${FACEBOOK_ENDPOINT}/me/messages`, data, {
    params: {
      access_token: token
    }
  })
  .then(res => res.data)
  .catch(err => err)
}

export const getAlmoco = date => {
  return axios.get(`${RESTAURANT_ENDPOINT}/almoco${date}.json`)
    .then(res => res.data)
    .catch(err => err)
}

export const getJantar = date =>
  axios.get(`${RESTAURANT_ENDPOINT}/jantar${date}.json`)
  .then(res => res.data)
  .catch(err => err)
