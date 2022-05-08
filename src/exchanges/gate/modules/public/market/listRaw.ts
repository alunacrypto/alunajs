import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { GateHttp } from '../../../GateHttp'
import { getGateEndpoints } from '../../../gateSpecs'
import { IGateMarketSchema } from '../../../schemas/IGateMarketSchema'



const log = debug('@alunajs:gate/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IGateMarketSchema[]>> => {

  log('fetching Gate markets')

  const { settings } = exchange

  const { http = new GateHttp(settings) } = params

  // TODO: Implement proper request
  const rawMarkets = await http.publicRequest<IGateMarketSchema[]>({
    url: getGateEndpoints(settings).market.list,
  })

  const { requestCount } = http

  return {
    rawMarkets,
    requestCount,
  }

}