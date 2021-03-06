import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { getBittrexEndpoints } from '../../../bittrexSpecs'
import { BittrexOrderSideEnum } from '../../../enums/BittrexOrderSideEnum'
import { BittrexOrderTimeInForceEnum } from '../../../enums/BittrexOrderTimeInForceEnum'
import { BittrexOrderTypeEnum } from '../../../enums/BittrexOrderTypeEnum'
import { IBittrexBalanceSchema } from '../../../schemas/IBittrexBalanceSchema'
import { IBittrexKeySchema } from '../../../schemas/IBittrexKeySchema'



const log = debug('alunajs:bittrex/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Bittrex key permissions')

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BittrexHttp(exchange.settings) } = params

  const INVALID_PERMISSION_MESSAGE = 'INVALID_PERMISSION'
  const BAD_REQUEST_MESSAGE = 'BAD_REQUEST'

  const permissions: IBittrexKeySchema = {
    read: false,
    trade: false,
    withdraw: false,
  }

  try {

    await http.authedRequest<any>({
      verb: AlunaHttpVerbEnum.GET,
      url: getBittrexEndpoints(settings).balance.list,
      credentials,
    })

    permissions.read = true

  } catch (error) {

    if (error.metadata?.code === INVALID_PERMISSION_MESSAGE) {

      permissions.read = false

    } else {

      throw error

    }

  }

  try {

    const requestBody = {
      marketSymbol: 'BTCEUR',
      direction: BittrexOrderSideEnum.BUY,
      type: BittrexOrderTypeEnum.MARKET,
      quantity: 0,
      timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
      useAwards: false,
    }

    await http.authedRequest<IBittrexBalanceSchema>({
      verb: AlunaHttpVerbEnum.POST,
      url: getBittrexEndpoints(settings).order.place,
      credentials,
      body: requestBody,
    })

  } catch (error) {

    if (error.metadata?.code === INVALID_PERMISSION_MESSAGE) {

      permissions.trade = false

    } else if (error.metadata?.code === BAD_REQUEST_MESSAGE) {

      permissions.trade = true

    } else {

      throw error

    }

  }

  try {

    const account = await http.authedRequest<IBittrexKeySchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: getBittrexEndpoints(settings).key.account,
      credentials,
    })


    permissions.accountId = account.accountId

  } catch (error) {

    log(error)

    throw error

  }

  const { key } = exchange.key.parseDetails({ rawKey: permissions })

  const { requestWeight } = http

  return {
    key,
    requestWeight,
  }

}
