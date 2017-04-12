import emoji from 'node-emoji'

import { textTemplate } from '../components'
import { sendText } from '../api'
import { capitalizeFirstLetter } from '../helpers/presenters'

export const sendMeal = (meal, senderId) => {
  const lineBreak = '\n'
  let mealTypes = Object.keys(meal)

  let [ proteinas, acompanhamentos, vegetariano ] =
    mealTypes.map(type => {
      let titleEmoji = ''

      switch(type) {
        case 'proteinas':
          titleEmoji = ':poultry_leg:'
          break
        case 'acompanhamentos':
          titleEmoji = ':curry:'
          break
        case 'vegetariano':
          titleEmoji = ':seedling:'
          break
      }

      let message = emoji.emojify(`${lineBreak}${titleEmoji} ${capitalizeFirstLetter(type)}:`)

      meal[type].map(item => {
        message = emoji.emojify(`${message}${lineBreak}:small_blue_diamond: ${item.nome}`)
      })

      return `${message}${lineBreak}`
    })

  return sendText(textTemplate({
    senderId,
    text: `${proteinas}${acompanhamentos}${vegetariano}`
  }))
}
