import log from 'better-log'

import {
  element,
  listTemplate,
  textTemplate
} from '../components'

import {
  sendText,
} from '../api'

export async function sendMeal(meal, senderId) {
  log("function: sendMeal")
  let mealTypes = Object.keys(meal)
  log(mealTypes)

  let [proteinas, acompanhamentos, vegetariano] =
    mealTypes.map(type => {
      return meal[type].map(item => element({
        title: item.nome,
        image_url: `http://www.ru.ufrn.br/icones/${item.icon}`
      }))
    })

  await sendText(textTemplate({
    senderId,
    text: 'Proteínas: '
  }))

  log(await sendText(listTemplate({
    senderId,
    elements: proteinas,
    topElement: 'compact'
  })))

  await sendText(textTemplate({
    senderId,
    text: 'Acompanhamentos: '
  }))

  await sendText(listTemplate({
    senderId,
    elements: acompanhamentos,
    topElement: 'compact'
  }))

  await sendText(textTemplate({
    senderId,
    text: 'Vegetariano: '
  }))

  await sendText(listTemplate({
    senderId,
    elements: vegetariano,
    topElement: 'compact'
  }))
}
