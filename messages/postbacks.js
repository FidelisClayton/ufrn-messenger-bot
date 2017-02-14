import axios from 'axios'

import { sendText } from '../services/facebook'

import {
  list as listTemplate,
  button as buttonTemplate,
  generic as genericTemplate
} from '../helpers/templates'

import { postbackButton } from '../helpers/buttons'

import element from '../helpers/elements'

import busStops from '../data/bus-stops'

export const SELECT_BUS = "SELECT_BUS"
export const SELECT_RESTAURANT = "SELECT_RESTAURANT"

export async function sendBusStops(event, page) {
  const nextPage = Number(page) + 1

  let messages = []
  let message = []

  busStops.map((stop, index) => {
    const mod = index % 5

    if(message.length === 5)
      message = []

    if(mod < 5) {
      message.push(element({
        title: stop.title,
        image_url: stop.image,
        buttons: [
          postbackButton({
            payload: `BUS_STOP[${stop.stopId}]`,
            title: "Selecionar"
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

  if(page < messages.length - 1)
    sendText(buttonTemplate({
      senderId: event.sender.id,
      text: "Gostaria de ver mais pontos de ônibus?",
      buttons: [
        postbackButton({
          payload: `STOP_LIST_PAGE[${nextPage}]`,
          title: "Ver mais"
        })
      ]
    }))
}

export async function sendBusPredictions({ busStop, arrival, departure }, sender) {
  const arrivalElements = arrival.map((vehicle, index) => {
    if(index < 3) {
      return {
        title: vehicle.routeMnemonic,
        subtitle: `${vehicle.type === "MESSAGE" ? "À caminho" : "Agendado"} - ${vehicle.serviceMnemonic} - Chegada em ${Math.round(vehicle.prediction / 60)} min.`,
      }
    }
  })

  const departureElements = departure.map((vehicle, index) => {
    if(index < 4) {
      return {
        title: vehicle.routeMnemonic,
        subtitle: `${vehicle.type === "MESSAGE" ? "À caminho" : "Agendado"} - ${vehicle.serviceMnemonic} - Saída em ${Math.round(vehicle.prediction / 60)} min.`,
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

  console.log(listTemplate({
      senderId: sender,
      elements: departureElements.filter(element => !!element),
      topElement: "compact"
  }))

  const message2 = await sendText(listTemplate({
      senderId: sender,
      elements: departureElements.filter(element => !!element),
      topElement: "compact"
  }))

  console.log(message2)
}
