import { sendText } from '../api'

import {
  listTemplate,
  buttonTemplate,
  genericTemplate,
  postbackButton,
  element
} from '../components'

import busStops from '../../data/bus-stops'

export async function sendBusStops(event, page) {
  const nextPage = Number(page) + 1

  let messages = []
  let message = []

  busStops.map((stop, index) => {
    const { title, image } = stop
    const mod = index % 5

    if(message.length === 5)
      message = []

    if(mod < 5) {
      message.push(element({
        title,
        image_url: image,
        buttons: [
          postbackButton({
            payload: `SELECT_BUS_STOP[${stop.stopId}]`,
            title
          })
        ]
      }))
    }

    if(mod === 1) {
      messages.push(message)
    }
  })

  await sendText(genericTemplate({
    senderId: event.sender.id,
    elements: messages[page]
  }))

  if(Number(page) < messages.length) {
    sendText(buttonTemplate({
      senderId: event.sender.id,
      text: 'Tem outras paradas, deseja ver?',
      buttons: [
        postbackButton({
          payload: `STOP_LIST_PAGE[${nextPage}]`,
          title: 'Ver mais'
        })
      ]
    }))
  }
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
