import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import {
  IBitfinexMarketsSchema,
  IBitfinexTicker,
  TBitfinexPairInfo,
} from '../../../schemas/IBitfinexMarketSchema'



const log = debug('alunajs:bitfinex/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IBitfinexMarketsSchema>> => {

  log('fetching Bitfinex markets')

  const { settings } = exchange

  const { http = new BitfinexHttp(settings) } = params

  const urls = getBitfinexEndpoints(settings)

  const tickers = await http.publicRequest<IBitfinexTicker[]>({
    url: urls.market.tickers,
  })

  const [
    enabledMarginCurrencies,
    pairsInfo,
  ] = await http.publicRequest<[string[][], Array<TBitfinexPairInfo>]>({
    url: urls.market.marginAndPairsInfo,
  })

  const rawMarkets: IBitfinexMarketsSchema = {
    tickers,
    enabledMarginCurrencies,
    pairsInfo,
  }

  const { requestWeight } = http

  return {
    rawMarkets,
    requestWeight,
  }

}
