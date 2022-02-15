import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../lib/enums/AlunaSideEnum'
import { AlunaBalanceErrorCodes } from '../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaExchangeOrderOptionsSchema } from '../../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { BinanceHttp } from '../BinanceHttp'
import {
  BinanceSpecs,
  exchangeOrderTypes as binanceExchangeOrderTypes,
  PROD_BINANCE_URL,
} from '../BinanceSpecs'
import { BinanceOrderStatusEnum } from '../enums/BinanceOrderStatusEnum'
import { BinanceOrderTimeInForceEnum } from '../enums/BinanceOrderTimeInForceEnum'
import { BinanceOrderTypeEnum } from '../enums/BinanceOrderTypeEnum'
import { BinanceSideEnum } from '../enums/BinanceSideEnum'
import {
  IBinanceOrderRequest,
  IBinanceOrderSchema,
} from '../schemas/IBinanceOrderSchema'
import { BINANCE_RAW_ORDER } from '../test/fixtures/binanceOrder'
import { BinanceOrderWriteModule } from './BinanceOrderWriteModule'



describe('BinanceOrderWriteModule', () => {

  const binanceOrderWriteModule = BinanceOrderWriteModule.prototype

  const keySecret = {
    key: '',
    secret: '',
  }

  const placedOrder = 'placed-order'


  it('should place a new Binance limit order just fine', async () => {

    ImportMock.mockOther(
      binanceOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      Promise.resolve(placedOrder),
    )

    const parseMock = ImportMock.mockFunction(
      binanceOrderWriteModule,
      'parse',
      Promise.resolve(placedOrder),
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 10000,
      symbolPair: 'ETHZAR',
      side: AlunaSideEnum.LONG,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IBinanceOrderRequest = {
      side: BinanceSideEnum.BUY,
      symbol: placeOrderParams.symbolPair,
      quantity: placeOrderParams.amount,
      price: placeOrderParams.rate,
      type: BinanceOrderTypeEnum.LIMIT,
      timeInForce: BinanceOrderTimeInForceEnum.GOOD_TIL_CANCELED,
    }


    // place long limit order
    const placeResponse1 = await binanceOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      body: requestBody,
      keySecret,
    })).to.be.ok


    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      rawOrder: placedOrder,
    })).to.be.ok

    expect(placeResponse1).to.deep.eq(placedOrder)


    // place short limit order
    const placeResponse2 = await binanceOrderWriteModule.place({
      ...placeOrderParams,
      type: AlunaOrderTypesEnum.MARKET,
      side: AlunaSideEnum.SHORT,
    })

    const requestBody2: IBinanceOrderRequest = {
      side: BinanceSideEnum.SELL,
      symbol: placeOrderParams.symbolPair,
      type: BinanceOrderTypeEnum.MARKET,
      quantity: placeOrderParams.amount,
    }

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      body: requestBody2,
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(2)
    expect(parseMock.calledWith({
      rawOrder: placeResponse2,
    })).to.be.ok

    expect(placeResponse2).to.deep.eq(placedOrder)

  })

  it('should throw an error for insufficient balance when placing new order',
    async () => {

      ImportMock.mockOther(
        binanceOrderWriteModule,
        'exchange',
      { keySecret } as IAlunaExchange,
      )

      const mockedError: AlunaError = new AlunaError({
        code: 'request-error',
        message: 'Account has insufficient balance for requested action.',
        metadata: {
          code: -2010,
          msg: 'Account has insufficient balance for requested action.',
        },
        httpStatusCode: 400,
      })

      const requestMock = ImportMock.mockFunction(
        BinanceHttp,
        'privateRequest',
        Promise.reject(mockedError),
      )

      const placeOrderParams: IAlunaOrderPlaceParams = {
        amount: 0.001,
        rate: 10000,
        symbolPair: 'ETHZAR',
        side: AlunaSideEnum.LONG,
        type: AlunaOrderTypesEnum.LIMIT,
        account: AlunaAccountEnum.EXCHANGE,
      }

      const requestBody: IBinanceOrderRequest = {
        side: BinanceSideEnum.BUY,
        symbol: placeOrderParams.symbolPair,
        quantity: placeOrderParams.amount,
        price: placeOrderParams.rate,
        type: BinanceOrderTypeEnum.LIMIT,
        timeInForce: BinanceOrderTimeInForceEnum.GOOD_TIL_CANCELED,
      }

      let result
      let error

      try {

        result = await binanceOrderWriteModule.place(placeOrderParams)

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(requestMock.callCount).to.be.eq(1)
      expect(requestMock.calledWith({
        url: `${PROD_BINANCE_URL}/api/v3/order`,
        body: requestBody,
        keySecret,
      })).to.be.ok

      expect(error.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
      expect(error.message)
        .to.be.eq('Account has insufficient balance for requested action.')
      expect(error.httpStatusCode).to.be.eq(400)

    })

  it('should throw an error if a new limit order is placed without rate',
    async () => {

      let result
      let error

      ImportMock.mockOther(
        binanceOrderWriteModule,
        'exchange',
      { keySecret } as IAlunaExchange,
      )

      const placeOrderParams: IAlunaOrderPlaceParams = {
        amount: 0.001,
        symbolPair: 'ETHZAR',
        side: AlunaSideEnum.LONG,
        type: AlunaOrderTypesEnum.LIMIT,
        account: AlunaAccountEnum.EXCHANGE,
        // without rate
      }

      try {

        await binanceOrderWriteModule.place(placeOrderParams)

      } catch (err) {

        error = err

      }

      expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
      expect(error.message)
        .to.be.eq('A rate is required for limit orders')
      expect(error.httpStatusCode).to.be.eq(401)

    })

  it('should throw an request error when placing new order', async () => {

    ImportMock.mockOther(
      binanceOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const mockedError: AlunaError = new AlunaError({
      code: 'request-error',
      message: 'Something went wrong.',
      metadata: {
        code: -1000,
        msg: 'Something went wrong.',
      },
      httpStatusCode: 500,
    })

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      Promise.reject(mockedError),
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 10000,
      symbolPair: 'ETHZAR',
      side: AlunaSideEnum.LONG,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IBinanceOrderRequest = {
      side: BinanceSideEnum.BUY,
      symbol: placeOrderParams.symbolPair,
      quantity: placeOrderParams.amount,
      price: placeOrderParams.rate,
      type: BinanceOrderTypeEnum.LIMIT,
      timeInForce: BinanceOrderTimeInForceEnum.GOOD_TIL_CANCELED,
    }

    let result
    let error

    try {

      result = await binanceOrderWriteModule.place(placeOrderParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error.message).to.be.eq('Something went wrong.')
    expect(error.httpStatusCode).to.be.eq(500)

  })



  it('should place a new Binance market order just fine', async () => {

    ImportMock.mockOther(
      binanceOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      Promise.resolve(placedOrder),
    )

    const parseMock = ImportMock.mockFunction(
      binanceOrderWriteModule,
      'parse',
      placedOrder,
    )

    const placeOrderParams: IAlunaOrderPlaceParams = {
      amount: 0.001,
      rate: 0,
      symbolPair: 'ETHZAR',
      side: AlunaSideEnum.LONG,
      type: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody: IBinanceOrderRequest = {
      side: BinanceSideEnum.BUY,
      symbol: placeOrderParams.symbolPair,
      type: BinanceOrderTypeEnum.MARKET,
      quantity: placeOrderParams.amount,
    }


    // place long market order
    const placeResponse1 = await binanceOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      body: requestBody,
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      rawOrder: placedOrder,
    })).to.be.ok

    expect(placeResponse1).to.deep.eq(parseMock.returnValues[0])


    // place short market order
    const placeResponse2 = await binanceOrderWriteModule.place({
      ...placeOrderParams,
      side: AlunaSideEnum.SHORT,
    })

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      body: {
        ...requestBody,
        side: BinanceSideEnum.SELL,
      },
      keySecret,
    })).to.be.ok

    expect(parseMock.callCount).to.be.eq(2)
    expect(parseMock.calledWith({
      rawOrder: placedOrder,
    })).to.be.ok

    expect(placeResponse2).to.deep.eq(placedOrder)

  })



  it('should ensure given account is one of AlunaAccountEnum', async () => {

    ImportMock.mockOther(
      BinanceSpecs,
      'accounts',
      [],
    )

    const account = 'nonexistent'

    let result
    let error

    try {

      result = await binanceOrderWriteModule.place({
        account,
      } as unknown as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Account type '${account}' not found`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given account is supported', async () => {

    ImportMock.mockOther(
      BinanceSpecs,
      'accounts',
      [
        {
          type: AlunaAccountEnum.EXCHANGE,
          supported: false,
          implemented: true,
          orderTypes: [],
        },
      ],
    )

    const account = AlunaAccountEnum.EXCHANGE

    let result
    let error

    try {

      result = await binanceOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Account type '${account}' not supported/implemented for Binance`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given account is implemented', async () => {

    ImportMock.mockOther(
      BinanceSpecs,
      'accounts',
      [
        {
          type: AlunaAccountEnum.EXCHANGE,
          supported: true,
          implemented: false,
          orderTypes: [],
        },
      ],
    )

    const account = AlunaAccountEnum.EXCHANGE

    let result
    let error

    try {

      result = await binanceOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Account type '${account}' not supported/implemented for Binance`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure account orderTypes has given order type', async () => {

    const accountIndex = BinanceSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    const limitOrderType = binanceExchangeOrderTypes[0]

    ImportMock.mockOther(
      BinanceSpecs.accounts[accountIndex],
      'orderTypes',
      [
        limitOrderType,
      ],
    )

    const type = 'unsupported-type'

    let result
    let error


    try {

      result = await binanceOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type: type as AlunaOrderTypesEnum,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Order type '${type}' not supported/implemented for Binance`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given order type is supported', async () => {

    const accountIndex = BinanceSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      BinanceSpecs.accounts[accountIndex],
      'orderTypes',
      [
        {
          type: AlunaOrderTypesEnum.LIMIT,
          supported: false,
          implemented: true,
          mode: AlunaFeaturesModeEnum.WRITE,
          options: {} as IAlunaExchangeOrderOptionsSchema,
        },
      ],
    )

    const type = AlunaOrderTypesEnum.LIMIT

    let result
    let error

    try {

      result = await binanceOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Order type '${type}' not supported/implemented for Binance`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given order type is implemented', async () => {

    const accountIndex = BinanceSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      BinanceSpecs.accounts[accountIndex],
      'orderTypes',
      [
        {
          type: AlunaOrderTypesEnum.LIMIT,
          supported: true,
          implemented: false,
          mode: AlunaFeaturesModeEnum.WRITE,
          options: {} as IAlunaExchangeOrderOptionsSchema,
        },
      ],
    )

    const type = AlunaOrderTypesEnum.LIMIT

    let error
    let result

    try {

      result = await binanceOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Order type '${type}' not supported/implemented for Binance`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure given order type has write mode', async () => {

    const accountIndex = BinanceSpecs.accounts.findIndex(
      (e) => e.type === AlunaAccountEnum.EXCHANGE,
    )

    ImportMock.mockOther(
      BinanceSpecs.accounts[accountIndex],
      'orderTypes',
      [
        {
          type: AlunaOrderTypesEnum.LIMIT,
          supported: true,
          implemented: true,
          mode: AlunaFeaturesModeEnum.READ,
          options: {} as IAlunaExchangeOrderOptionsSchema,
        },
      ],
    )

    const type = AlunaOrderTypesEnum.LIMIT

    let result
    let error

    try {

      result = await binanceOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Order type '${type}' is in read mode`

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(msg)

  })



  it('should ensure an order was canceled', async () => {

    ImportMock.mockOther(
      binanceOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const mockedError: AlunaError = new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: 'Something went wrong, order not canceled',
      metadata: {},
      httpStatusCode: 500,
    })

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      Promise.reject(mockedError),
    )

    const cancelParams: IAlunaOrderCancelParams = {
      id: 'order-id',
      symbolPair: 'symbol-pair',
    }

    let result
    let error

    try {

      result = await binanceOrderWriteModule.cancel(cancelParams)

    } catch (err) {

      error = err


    }

    expect(result).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      verb: AlunaHttpVerbEnum.DELETE,
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      keySecret,
      body: {
        orderId: cancelParams.id,
        symbol: cancelParams.symbolPair,
      },
    })).to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq('Something went wrong, order not canceled')
    expect(error.httpStatusCode).to.be.eq(500)
    expect(error.code).to.be.eq(AlunaOrderErrorCodes.CANCEL_FAILED)

  })



  it('should cancel an open order just fine', async () => {

    ImportMock.mockOther(
      binanceOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const canceledOrderResponse = {
      status: BinanceOrderStatusEnum.CANCELED,
    } as IBinanceOrderSchema

    ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      canceledOrderResponse,
    )

    const parseMock = ImportMock.mockFunction(
      binanceOrderWriteModule,
      'parse',
      { status: AlunaOrderStatusEnum.CANCELED } as IAlunaOrderSchema,
    )

    const cancelParams: IAlunaOrderCancelParams = {
      id: 'order-id',
      symbolPair: 'symbol-pair',
    }

    let canceledOrder
    let error

    try {

      canceledOrder = await binanceOrderWriteModule.cancel(cancelParams)

    } catch (err) {

      error = err

    }

    expect(error).to.be.undefined

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      rawOrder: canceledOrderResponse,
    })).to.be.ok

    expect(canceledOrder).to.be.ok
    expect(canceledOrder).to.deep.eq(parseMock.returnValues[0])
    expect(canceledOrder?.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

  })

  it('should edit a binance order just fine', async () => {

    const cancelMock = ImportMock.mockFunction(
      binanceOrderWriteModule,
      'cancel',
      Promise.resolve(true),
    )

    const placeMock = ImportMock.mockFunction(
      binanceOrderWriteModule,
      'place',
      Promise.resolve(BINANCE_RAW_ORDER),
    )

    const editOrderParams: IAlunaOrderEditParams = {
      id: 'originalOrderId',
      amount: 0.001,
      rate: 0,
      symbolPair: 'LTCBTC',
      side: AlunaSideEnum.LONG,
      type: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const newOrder = await binanceOrderWriteModule.edit(editOrderParams)

    expect(newOrder).to.deep.eq(BINANCE_RAW_ORDER)

    expect(cancelMock.callCount).to.be.eq(1)
    expect(placeMock.callCount).to.be.eq(1)

  })

})
