import { expect } from 'chai'
import {
  clone,
  each,
} from 'lodash'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Ftx } from '../../../Ftx'
import {
  FTX_RAW_FUTURE_MARKET,
  FTX_RAW_MARKETS,
} from '../../../test/fixtures/ftxMarket'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Ftx raw markets just fine', async () => {

    // preparing data
    const rawMarkets = [
      clone(FTX_RAW_FUTURE_MARKET),
      ...FTX_RAW_MARKETS,
    ]

    rawMarkets[0].name = 'WEARDNAME'
    rawMarkets[0].underlying = 'USD'


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_MARKETS, (market, index) => {
      parse.onCall(index).returns({ market })
    })


    // executing
    const exchange = new Ftx({})

    const { markets } = exchange.market.parseMany({
      rawMarkets,
    })


    // validating
    expect(parse.callCount).to.be.eq(PARSED_MARKETS.length)
    expect(markets).to.deep.eq(PARSED_MARKETS)

  })

})
