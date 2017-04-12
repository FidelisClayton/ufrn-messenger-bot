import chai, { expect } from 'chai'
import buttonTemplate from '../button-template'

describe('button-template', () => {
  const expected = {
    recipient: { id: 1, },
    message: {
      attachment: {
        type: 'template',
        payload: { template_type: 'button', text: 'test', buttons: [] }
      }
    }
  }
  it('should return a object properly passing buttons', () => {
    expect(buttonTemplate({senderId: 1, text: 'test', buttons: []})).to.deep.equal(expected)
  })

  it('should return a object properly not passing buttons', () => {
    expect(buttonTemplate({senderId: 1, text: 'test'})).to.deep.equal(expected)
  })
})
