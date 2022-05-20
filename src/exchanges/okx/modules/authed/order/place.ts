import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderPlaceParams,
  IAlunaOrderPlaceReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ensureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported'
import { placeOrderParamsSchema } from '../../../../../utils/validation/schemas/placeOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { translateOrderSideToOkx } from '../../../enums/adapters/okxOrderSideAdapter'
import { translateOrderTypeToOkx } from '../../../enums/adapters/okxOrderTypeAdapter'
import { OkxOrderTypeEnum } from '../../../enums/OkxOrderTypeEnum'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { IOkxOrderSchema } from '../../../schemas/IOkxOrderSchema'



const log = debug('alunajs:okx/order/place')



export const place = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderPlaceParams,
): Promise<IAlunaOrderPlaceReturns> => {

  log('placing order', params)

  const {
    specs,
    settings,
    credentials,
  } = exchange

  validateParams({
    params,
    schema: placeOrderParamsSchema,
  })

  ensureOrderIsSupported({
    exchangeSpecs: specs,
    orderPlaceParams: params,
  })

  const {
    amount,
    rate,
    symbolPair,
    side,
    type,
    http = new OkxHttp(settings),
  } = params

  const translatedOrderType = translateOrderTypeToOkx({
    from: type,
  })

  const translatedOrderSide = translateOrderSideToOkx({ from: side })

  const body = {
    side: translatedOrderSide,
    instId: symbolPair,
    ordType: translatedOrderType,
    sz: amount.toString(),
    tdMode: 'cash',
  }
  console.log('🚀 ~ file: place.ts ~ line 71 ~ body', body)

  if (translatedOrderType === OkxOrderTypeEnum.LIMIT) {

    Object.assign(body, {
      px: rate!.toString(),
    })

  }
  console.log('🚀 ~ file: place.ts ~ line 71 ~ body', body)

  log('placing new order for Okx')

  let placedOrder: IOkxOrderSchema

  try {

    const orderResponse = await http.authedRequest<IOkxOrderSchema>({
      url: getOkxEndpoints(settings).order.place,
      body,
      credentials,
    })

    placedOrder = orderResponse

  } catch (err) {

    let {
      code,
      message,
    } = err

    const { metadata } = err

    if (metadata.sCode === '51008') {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      message = 'Account has insufficient balance for requested action.'

    } else {

      code = AlunaOrderErrorCodes.PLACE_FAILED

    }

    throw new AlunaError({
      ...err,
      code,
      message,
    })

  }

  const { order } = exchange.order.parse({ rawOrder: placedOrder })

  const { requestWeight } = http

  return {
    order,
    requestWeight,
  }

}
