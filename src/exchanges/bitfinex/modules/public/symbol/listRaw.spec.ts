import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Bitfinex } from '../../../Bitfinex'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import {
  BITFINEX_CURRENCIES,
  BITFINEX_CURRENCIES_LABELS,
  BITFINEX_RAW_SYMBOLS,
} from '../../../test/fixtures/bitfinexSymbols'



describe(__filename, () => {

  it('should list Bitfinex raw symbols just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    publicRequest.returns(Promise.resolve([
      BITFINEX_CURRENCIES,
      BITFINEX_CURRENCIES_LABELS,
    ]))


    // executing
    const exchange = new Bitfinex({})

    const {
      rawSymbols,
      requestWeight,
    } = await exchange.symbol.listRaw()


    // validating
    expect(rawSymbols).to.deep.eq(BITFINEX_RAW_SYMBOLS)

    expect(requestWeight).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getBitfinexEndpoints(exchange.settings).symbol.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
