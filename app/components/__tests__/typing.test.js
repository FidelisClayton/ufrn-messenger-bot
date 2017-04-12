import chai, { expect } from 'chai'
import typing from '../typing'

describe('typing', () => {
  it('sender_action should be typing_on', () => {
    const expected = {
      recipient: { id: 1 },
      sender_action: 'typing_on'
    }

    expect(typing({senderId: 1, typing: true})).to.deep.equal(expected)
  })

  it('sender_action should be typing_off', () => {
    const expected = {
      recipient: { id: 1 },
      sender_action: 'typing_off'
    }

    expect(typing({senderId: 1, typing: false})).to.deep.equal(expected)
  })
})
