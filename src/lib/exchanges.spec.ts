import { expect } from 'chai'

import { bittrexBaseSpecs } from '../exchanges/bittrex/bittrexSpecs'
import { exchanges } from './exchanges'



describe(__filename, () => {

  it('should reference all implemented exchanges', async () => {

    expect(exchanges[bittrexBaseSpecs.id]).to.be.ok

  })

})
