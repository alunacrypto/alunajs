import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderPlaceParams,
  IAlunaOrderPlaceReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ensureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported'
import { placeOrderParamsSchema } from '../../../../../utils/validation/schemas/placeOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { translateOrderSideToValr } from '../../../enums/adapters/valrOrderSideAdapter'
import { translateOrderTypeToValr } from '../../../enums/adapters/valrOrderTypeAdapter'
import { ValrOrderTimeInForceEnum } from '../../../enums/ValrOderTimeInForceEnum'
import { ValrOrderStatusEnum } from '../../../enums/ValrOrderStatusEnum'
import { ValrOrderTypeEnum } from '../../../enums/ValrOrderTypeEnum'
import {
  IValrOrderGetResponseSchema,
  IValrOrderPlaceResponseSchema,
} from '../../../schemas/IValrOrderSchema'
import { ValrHttp } from '../../../ValrHttp'
import { getValrEndpoints } from '../../../valrSpecs'



const log = debug('alunajs:valr/order/place')



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
    orderParams: params,
  })

  const {
    amount,
    rate,
    symbolPair,
    side,
    type,
    http = new ValrHttp(settings),
  } = params

  const translatedOrderType = translateOrderTypeToValr({
    from: type,
  })

  const body = {
    side: translateOrderSideToValr({ from: side }),
    pair: symbolPair,
  }

  if (translatedOrderType === ValrOrderTypeEnum.LIMIT) {

    Object.assign(body, {
      quantity: amount,
      price: rate,
      postOnly: false,
      timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
    })

  } else {

    Object.assign(body, {
      baseAmount: amount,
    })

  }

  log('placing new order for Valr')

  const { id } = await http.authedRequest<IValrOrderPlaceResponseSchema>({
    url: getValrEndpoints(settings).order.place(translatedOrderType),
    body,
    credentials,
  })

  const { rawOrder } = await exchange.order.getRaw({
    id,
    symbolPair,
    type: AlunaOrderTypesEnum.LIMIT,
  })

  const { valrOrder } = rawOrder as IValrOrderGetResponseSchema

  const { orderStatusType, failedReason } = valrOrder

  if (orderStatusType === ValrOrderStatusEnum.FAILED) {

    let code = AlunaOrderErrorCodes.PLACE_FAILED
    let httpStatusCode = 500

    if (failedReason === 'Insufficient Balance') {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE
      httpStatusCode = 200

    }

    throw new AlunaError({
      message: failedReason,
      code,
      httpStatusCode,
      metadata: valrOrder,
    })

  }

  const { order } = exchange.order.parse({ rawOrder })

  const { requestWeight } = http

  return {
    order,
    requestWeight,
  }

}
