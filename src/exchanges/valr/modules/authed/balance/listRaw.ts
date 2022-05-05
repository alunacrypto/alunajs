import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'
import { IValrBalanceSchema } from '../../../schemas/IValrBalanceSchema'



const log = debug('@alunajs:valr/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IValrBalanceSchema>> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new ValrHttp() } = params

  // TODO: Implement balance 'listRaw'
  const rawBalances = await http.authedRequest<IValrBalanceSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: valrEndpoints.balance.list,
    credentials,
  })

  const { requestCount } = http

  return {
    rawBalances,
    requestCount,
  }

}