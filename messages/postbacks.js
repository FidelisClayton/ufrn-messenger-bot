import axios from 'axios'

import { sendText } from '../index'

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

export function selectBus(event) {
  let elements = busStops.map((stop, index) => {
    if (index < 5) {
      return element({
        title: stop.title,
        image_url: stop.image,
        buttons: [
          postbackButton({
            payload: `BUS_STOP[${stop.stopId}]`,
            title: "Selecionar"
          })
        ]
      })
    }
  })
  .filter(stop => !!stop)

  return genericTemplate({
    senderId: event.sender.id,
    elements
  })
}
