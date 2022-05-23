import debug from 'debug'
import { map } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IHuobiMarketSchema } from '../../../schemas/IHuobiMarketSchema'



const log = debug('alunajs:huobi/market/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseManyParams<IHuobiMarketSchema[]>,
): IAlunaMarketParseManyReturns => {

  const { rawMarkets } = params

  // TODO: Review implementation
  const markets = map(rawMarkets, (rawMarket) => {

    const { market } = exchange.market.parse({
      rawMarket,
    })

    return market

  })

  log(`parsed ${markets.length} markets for Huobi`)

  return { markets }

}
