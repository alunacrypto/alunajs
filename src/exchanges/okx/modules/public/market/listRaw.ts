import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { IOkxMarketSchema } from '../../../schemas/IOkxMarketSchema'



const log = debug('alunajs:okx/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IOkxMarketSchema[]>> => {

  const { settings } = exchange

  const { http = new OkxHttp(settings) } = params

  log('fetching Okx markets')

  // TODO: Implement proper request
  const rawMarkets = await http.publicRequest<IOkxMarketSchema[]>({
    url: getOkxEndpoints(settings).market.list,
  })

  const { requestWeight } = http

  return {
    rawMarkets,
    requestWeight,
  }

}