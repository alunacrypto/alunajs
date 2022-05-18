import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { IOkxOrderSchema } from '../../../schemas/IOkxOrderSchema'



const log = debug('alunajs:okx/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IOkxOrderSchema[]>> => {

  log('fetching Okx open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new OkxHttp(settings) } = params

  // TODO: Implement proper request
  const rawOrders = await http.authedRequest<IOkxOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getOkxEndpoints(settings).order.list,
    credentials,
  })

  const { requestWeight } = http

  return {
    rawOrders,
    requestWeight,
  }

}