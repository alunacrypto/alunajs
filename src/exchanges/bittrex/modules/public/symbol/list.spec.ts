import { expect } from 'chai'

import { mockSymbolListRaw } from '../../../../../../test/helpers/exchange/modules/symbol/listRaw'
import { mockSymbolParseMany } from '../../../../../../test/helpers/exchange/modules/symbol/parseMany'
import { Bittrex } from '../../../Bittrex'
import { mockBittrexHttp } from '../../../BittrexHttp.mock'
import { IBittrexSymbolSchema } from '../../../schemas/IBittrexSymbolSchema'
import {
  BITTREX_PARSED_SYMBOLS,
  BITTREX_RAW_SYMBOLS,
} from '../../../test/fixtures/bittrexSymbols'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  it('should list Bittrex parsed symbols just fine', async () => {


    const { listRaw } = mockSymbolListRaw<IBittrexSymbolSchema[]>({
      module: listRawMod,
      returns: {
        rawSymbols: BITTREX_RAW_SYMBOLS,
        requestCount: {
          authed: 0,
          public: 0,
        },
      },
    })

    const { parseMany } = mockSymbolParseMany({
      module: parseManyMod,
      returns: {
        symbols: BITTREX_PARSED_SYMBOLS,
      },
    })

    const exchange = new Bittrex({ settings: {} })

    const {
      authedRequest,
      publicRequest,
      requestCount,
    } = mockBittrexHttp()


    const { symbols } = await exchange.symbol.list()

    expect(symbols).to.deep.eq(BITTREX_PARSED_SYMBOLS)

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.args[0][0]).to.deep.eq({
      http: {
        authedRequest,
        publicRequest,
        requestCount,
      },
    })

    expect(parseMany.callCount).to.be.eq(1)

  })

})