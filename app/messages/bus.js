import { sendText } from '../api'

import {
  listTemplate,
  quickReplyTemplate,
  quickReply
} from '../components'

import {
  REMAINING_BUS_STOPS,
  MAX_QUICK_REPLIES,
  SELECT_BUS_STOP
} from '../constants'

import busStops from '../../data/bus-stops'

export function sendBusStops(event, offset = 0) {
  const quickReplies = busStops.reduce((previous, { title, stopId }, index) => {
    if (index >= offset && previous.length < MAX_QUICK_REPLIES - 1) {
      previous.push(quickReply({
        title,
        payload: `${SELECT_BUS_STOP}-${stopId}`
      }))
    }

    return previous
  }, [])

  if (quickReplies.length === MAX_QUICK_REPLIES - 1)
    quickReplies.push(quickReply({
      title: 'Outras',
      payload: REMAINING_BUS_STOPS
    }))

  const messageBody = quickReplyTemplate({
    senderId: event.sender.id,
    text: 'Escolha a parada que você quer pegar o ônibus',
    quickReplies
  })

  return sendText(messageBody)
    .then(res => res)
    .catch(err => err)
}

export async function sendBusPredictions(res, sender) {
  const { busStop, arrival, departure } = res
  const arrivalElements = arrival.map((vehicle, index) => {
    if(index < 3) {
      return {
        title: vehicle.routeMnemonic,
        subtitle: `${vehicle.type === 'MESSAGE' ? 'À caminho' : 'Agendado'} - ${vehicle.serviceMnemonic} - Chegada em ${Math.round(vehicle.prediction / 60)} min.`,
      }
    }
  })

  if(arrivalElements.length === 1)
    arrivalElements.push({
      title: 'Apenas 1 veiculo disponivel'
    })

  const departureElements = departure.map((vehicle, index) => {
    if(index < 4) {
      return {
        title: vehicle.routeMnemonic,
        subtitle: `${vehicle.type === 'MESSAGE' ? 'À caminho' : 'Agendado'} - ${vehicle.serviceMnemonic} - Saída em ${Math.round(vehicle.prediction / 60)} min.`,
      }
    }
  })

  await sendText(listTemplate({
    senderId: sender,
    elements: [
      {
        title: busStop.title,
        image_url: busStop.image
      },
      ...arrivalElements.filter(element => !!element)
    ]
  }))

  await sendText(listTemplate({
    senderId: sender,
    elements: departureElements.filter(element => !!element),
    topElement: 'compact'
  }))
}
