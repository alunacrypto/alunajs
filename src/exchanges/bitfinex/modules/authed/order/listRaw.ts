import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { IBitfinexOrderSchema } from '../../../schemas/IBitfinexOrderSchema'



const log = debug('@alunajs:bitfinex/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IBitfinexOrderSchema>> => {

  log('fetching Bitfinex open orders', params)

  const { credentials } = exchange

  const { http = new BitfinexHttp() } = params

  // TODO: Implement proper request
  const rawOrders = await http.authedRequest<IBitfinexOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: bitfinexEndpoints.order.list,
    credentials,
  })

  const { requestCount } = http

  return {
    rawOrders,
    requestCount,
  }

}