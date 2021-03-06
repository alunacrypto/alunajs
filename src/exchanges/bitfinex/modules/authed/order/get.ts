import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BitfinexHttp } from '../../../BitfinexHttp'



const log = debug('alunajs:bitfinex/order/get')



export const get = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetReturns> => {

  log('getting order', params)

  const {
    id,
    symbolPair,
    http = new BitfinexHttp(exchange.settings),
    type,
  } = params

  const { rawOrder } = await exchange.order.getRaw({
    id,
    symbolPair,
    http,
    type,
  })

  const { order } = exchange.order.parse({ rawOrder })

  const { requestWeight } = http

  return {
    order,
    requestWeight,
  }

}
