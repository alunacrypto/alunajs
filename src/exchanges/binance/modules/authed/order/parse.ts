import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { translateOrderSideToAluna } from '../../../enums/adapters/binanceOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/binanceOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/binanceOrderTypeAdapter'
import { IBinanceOrderResponseSchema } from '../../../schemas/IBinanceOrderSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IBinanceOrderResponseSchema>,
): IAlunaOrderParseReturns => {


  const {
    rawOrder: rawOrderRequest,
  } = params

  const {
    rawOrder,
    rawSymbol,
  } = rawOrderRequest

  const {
    baseAsset,
    quoteAsset,
  } = rawSymbol

  const {
    orderId,
    time,
    origQty,
    symbol,
    side,
    price,
    type,
    status,
    updateTime,
    transactTime,
    fills,
  } = rawOrder

  const { symbolMappings } = exchange.settings

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseAsset,
    symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteAsset,
    symbolMappings,
  })

  const updatedAt = updateTime ? new Date(updateTime) : undefined
  const amount = parseFloat(origQty)

  /**
   * It seems Binance does not return the price for filled orders, but it does
   * return a 'fills' prop when the placed order is filled immediately.
   */
  let rate = parseFloat(price)

  if (fills?.length) {

    rate = parseFloat(fills[0].price)


  }

  const orderStatus = translateOrderStatusToAluna({ from: status })
  const orderSide = translateOrderSideToAluna({ from: side })
  const orderType = translateOrderTypeToAluna({ from: type })

  let createdAt: Date
  let filledAt: Date | undefined
  let canceledAt: Date | undefined

  if (time) {

    createdAt = new Date(time)

  } else if (transactTime) {

    createdAt = new Date(transactTime)

  } else {

    createdAt = new Date()

  }

  if (orderStatus === AlunaOrderStatusEnum.CANCELED) {

    canceledAt = updatedAt

  }

  if (orderStatus === AlunaOrderStatusEnum.FILLED) {

    if (fills?.length) {

      filledAt = new Date()

    } else {

      filledAt = updatedAt

    }

  }

  const order: IAlunaOrderSchema = {
    id: orderId.toString(),
    symbolPair: symbol,
    exchangeId: exchange.specs.id,
    baseSymbolId,
    quoteSymbolId,
    rate,
    total: amount * rate,
    amount,
    account: AlunaAccountEnum.SPOT,
    status: orderStatus,
    side: orderSide,
    type: orderType,
    placedAt: new Date(createdAt),
    filledAt,
    canceledAt,
    meta: rawOrder,
  }

  return { order }

}
