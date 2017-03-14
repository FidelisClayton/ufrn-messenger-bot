import log from 'better-log'

import { textTemplate } from '../components'
import { sendText } from '../api'
import { capitalizeFirstLetter } from '../helpers/presenters'

export async function sendMeal(meal, senderId) {
  const lineBreak = '\n'
  let mealTypes = Object.keys(meal)

  let [proteinas, acompanhamentos, vegetariano] =
    mealTypes.map(type => {
      let message = `${capitalizeFirstLetter(type)}:${lineBreak}`

      meal[type].map(item => {
        message = message + lineBreak + item.nome
      })

      return message
    })

  await sendText(textTemplate({
    senderId,
    text: proteinas ? proteinas : 'Não encontrei proteínas pra hoje :/'
  }))

  await sendText(textTemplate({
    senderId,
    text: acompanhamentos ? acompanhamentos : 'Não encontrei acompanhamentos para hoje :('
  }))

  await sendText(textTemplate({
    senderId,
    text: vegetariano ? vegetariano : 'Hmm, não encontrei o cardápio vegetariano.'
  }))
}
