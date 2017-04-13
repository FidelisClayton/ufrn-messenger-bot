// Message Events
export const BUS_ACTION_PLACE = 'BUS_ACTION_PLACE'
export const BUS_IN_PLACE = 'BUS_IN_PLACE'
export const BUS_LOCAL = 'BUS_LOCAL'
export const NEXT_BUS = 'NEXT_BUS'
export const ONIBUS = 'ONIBUS'
export const RESTAURANT = 'RESTAURANT'
export const STOP_LIST_PAGE = 'STOP_LIST_PAGE'
export const GET_STARTED_PAYLOAD = 'GET_STARTED_PAYLOAD'
export const UNKNOWN = 'UNKNOWN'

// Quick Replies
export const USER_PICK_ALMOCO = 'USER_PICK_ALMOCO'
export const USER_PICK_JANTAR = 'USER_PICK_JANTAR'
export const USER_PICK_RU = 'USER_PICK_RU'
export const USER_PICK_BUS = 'USER_PICK_BUS'
export const REMAINING_BUS_STOPS = 'REMAINING_BUS_STOPS'
export const SELECT_BUS_STOP = 'SELECT_BUS_STOP'
export const SELECT_RESTAURANT = 'SELECT_RESTAURANT'
export const SELECT_BUS = 'SELECT_BUS'

export const PARAMETERS = Object.freeze({
  refeicao: {
    jantar: 'jantar',
    almoco: 'almoço',
  },
})

export const MAX_QUICK_REPLIES = 11
