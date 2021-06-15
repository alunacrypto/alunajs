import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderPlaceParams,
  IAlunaOrderWriteModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { ValrOrderTypeAdapter } from '../enums/adapters/ValrOrderTypeAdapter'
import { ValrSideAdapter } from '../enums/adapters/ValrSideAdapter'
import { ValrOrderStatusEnum } from '../enums/ValrOrderStatusEnum'
import { ValrOrderTimeInForceEnum } from '../enums/ValrOrderTimeInForceEnum'
import { ValrOrderTypesEnum } from '../enums/ValrOrderTypesEnum'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'
import { ValrSpecs } from '../ValrSpecs'
import { ValrOrderReadModule } from './ValrOrderReadModule'



interface IValrPlaceOrderResponse {
  id: string
}



export class ValrOrderWriteModule extends ValrOrderReadModule implements IAlunaOrderWriteModule {

  public async place (
    params: IAlunaOrderPlaceParams,
  ): Promise<IAlunaOrderSchema> {

    const {
      amount,
      rate,
      symbolPair,
      side,
      type,
      account,
    } = params

    try {

      const accountSpecs = ValrSpecs.accounts.find((a) => a.type === account)

      if (!accountSpecs) {

        throw new AlunaError({
          message: `Account type '${account}' not found`,
        })

      }

      const {
        supported,
        implemented,
        orderTypes: supportedOrderTypes,
      } = accountSpecs

      if (!supported || !implemented || !supportedOrderTypes) {

        throw new AlunaError({
          message:
            `Account type '${account}' not supported/implemented for Varl`,
        })

      }

      const orderType = supportedOrderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          message: `Order type '${type}' not supported/implemented for Varl`,
        })

      }

      if (orderType.mode !== AlunaFeaturesModeEnum.WRITE) {

        throw new AlunaError({
          message: `Order type '${type}' is in read mode`,
        })

      }

    } catch (error) {

      const err = error instanceof AlunaError
        ? error
        : new AlunaError({
          message: `Account type '${account}' is not in Valr specs`,
        })

      ValrLog.error(err)

      throw err

    }

    const body = {
      side: ValrSideAdapter.translateToValr({ from: side }),
      pair: symbolPair,
    }

    const translatedOrderType = ValrOrderTypeAdapter.translateToValr({
      from: type,
    })

    if (translatedOrderType === ValrOrderTypesEnum.LIMIT) {

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

    ValrLog.info('placing new order for valr')

    const { id } = await ValrHttp.privateRequest<IValrPlaceOrderResponse>({
      url: `https://api.valr.com/v1/orders/${translatedOrderType}`,
      body,
      keySecret: this.exchange.keySecret,
    })

    return this.get({
      id,
      symbolPair,
    })

  }



  public async cancel (
    params: IAlunaOrderCancelParams,
  ): Promise<IAlunaOrderSchema> {

    ValrLog.info('canceling order for Valr')

    await ValrHttp.privateRequest<void>({
      verb: AlunaHttpVerbEnum.DELETE,
      url: 'https://api.valr.com/v1/orders/order',
      keySecret: this.exchange.keySecret,
      body: {
        orderId: params.id,
        pair: params.symbolPair,
      },
    })

    const ensuredCancelled = await this.getRaw(params)

    if (ensuredCancelled.orderStatusType !== ValrOrderStatusEnum.CANCELLED) {

      const error = new AlunaError({
        message: 'Something went wrong, order not canceled',
        statusCode: 500,
      })

      ValrLog.error(error)

      throw error

    }

    return this.parse({
      rawOrder: ensuredCancelled,
    })

  }

}
