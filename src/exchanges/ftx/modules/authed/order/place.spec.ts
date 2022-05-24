import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderPlaceParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { mockEnsureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported.mock'
import { placeOrderParamsSchema } from '../../../../../utils/validation/schemas/placeOrderParamsSchema'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { translateOrderSideToFtx } from '../../../enums/adapters/ftxOrderSideAdapter'
import { translateOrderTypeToFtx } from '../../../enums/adapters/ftxOrderTypeAdapter'
import { FtxAuthed } from '../../../FtxAuthed'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { FTX_RAW_ORDERS } from '../../../test/fixtures/ftxOrders'
import * as getMod from './get'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should place a Ftx limit order just fine', async () => {

    // preparing data
    const mockedRawOrder = FTX_RAW_ORDERS[0]
    const mockedPlacedOrder = PARSED_ORDERS[0]

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.LIMIT

    const translatedOrderSide = translateOrderSideToFtx({ from: side })
    const translatedOrderType = translateOrderTypeToFtx({ from: type })

    const body = {
      market: '',
      price: 0,
      side: translatedOrderSide,
      size: 0.01,
      type: translatedOrderType,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })
    authedRequest.returns(Promise.resolve(mockedRawOrder))

    const { get } = mockGet({ module: getMod })
    get.returns({ order: mockedPlacedOrder })

    const { validateParamsMock } = mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new FtxAuthed({ credentials })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
      side,
      type,
      rate: 0,
    }

    const { order } = await exchange.order.place(params)


    // validating
    expect(order).to.deep.eq(mockedPlacedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      body,
      credentials,
      url: getFtxEndpoints(exchange.settings).order.place,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(validateParamsMock.firstCall.args[0]).to.deep.eq({
      params,
      schema: placeOrderParamsSchema,
    })

  })

  it('should place a Ftx market order just fine', async () => {

    // preparing data

    const mockedRawOrder = FTX_RAW_ORDERS[0]
    const mockPlacedOrder = PARSED_ORDERS[0]

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.MARKET

    const translatedOrderSide = translateOrderSideToFtx({ from: side })
    const translatedOrderType = translateOrderTypeToFtx({ from: type })

    const body = {
      market: '',
      price: null,
      side: translatedOrderSide,
      size: 0.01,
      type: translatedOrderType,
    }

    const params = {
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
      side,
      type,
      rate: 0,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })
    authedRequest.returns(Promise.resolve(mockedRawOrder))

    const { get } = mockGet({ module: getMod })
    get.returns({ order: mockPlacedOrder })

    const { validateParamsMock } = mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new FtxAuthed({ credentials })

    const { order } = await exchange.order.place(params)


    // validating
    expect(order).to.deep.eq(mockPlacedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      body,
      credentials,
      url: getFtxEndpoints(exchange.settings).order.place,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.firstCall.args[0]).to.deep.eq({
      exchangeSpecs: exchange.specs,
      orderPlaceParams: params,
    })

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(validateParamsMock.firstCall.args[0]).to.deep.eq({
      params,
      schema: placeOrderParamsSchema,
    })

  })

  it(
    'should throw error for insufficient funds when placing new ftx order',
    async () => {

      // preparing data
      // const mockedRawOrder = FTX_RAW_ORDERS[0]

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET

      const expectedMessage = 'Account has insufficient balance '
        .concat('for requested action.')
      const expectedCode = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      const alunaError = new AlunaError({
        message: 'Not enough balances',
        code: AlunaOrderErrorCodes.PLACE_FAILED,
        httpStatusCode: 401,
        metadata: {},
      })

      const params = {
        symbolPair: '',
        account: AlunaAccountEnum.SPOT,
        amount: 0.01,
        side,
        type,
        rate: 0,
      }

      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: FtxHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      const { get } = mockGet({ module: getMod })

      const { validateParamsMock } = mockValidateParams()

      const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


      // executing
      const exchange = new FtxAuthed({ credentials })

      const { error } = await executeAndCatch(
        () => exchange.order.place(params),
      )


      // validating

      expect(error instanceof AlunaError).to.be.ok
      expect(error?.code).to.be.eq(expectedCode)
      expect(error?.message).to.be.eq(expectedMessage)

      expect(authedRequest.callCount).to.be.eq(1)

      expect(publicRequest.callCount).to.be.eq(0)

      expect(ensureOrderIsSupported.callCount).to.be.eq(1)
      expect(ensureOrderIsSupported.firstCall.args[0]).to.deep.eq({
        exchangeSpecs: exchange.specs,
        orderPlaceParams: params,
      })

      expect(validateParamsMock.callCount).to.be.eq(1)
      expect(validateParamsMock.firstCall.args[0]).to.deep.eq({
        params,
        schema: placeOrderParamsSchema,
      })

      expect(get.callCount).to.be.eq(0)

    },
  )

  it('should throw an error placing new ftx order', async () => {

    // preparing data
    // const mockedRawOrder = FTX_RAW_ORDERS[0]

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.MARKET

    const expectedMessage = 'dummy-error'
    const expectedCode = AlunaOrderErrorCodes.PLACE_FAILED

    const alunaError = new AlunaError({
      message: 'dummy-error',
      code: AlunaOrderErrorCodes.PLACE_FAILED,
      httpStatusCode: 401,
      metadata: {},
    })

    const params = {
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
      side,
      type,
      rate: Number(0),
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })
    authedRequest.returns(Promise.reject(alunaError))

    const { get } = mockGet({ module: getMod })

    const { validateParamsMock } = mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new FtxAuthed({ credentials })

    const { error } = await executeAndCatch(
      () => exchange.order.place(params),
    )

    // validating
    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(expectedCode)
    expect(error?.message).to.be.eq(expectedMessage)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.firstCall.args[0]).to.deep.eq({
      exchangeSpecs: exchange.specs,
      orderPlaceParams: params,
    })

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(validateParamsMock.firstCall.args[0]).to.deep.eq({
      params,
      schema: placeOrderParamsSchema,
    })

    expect(get.callCount).to.be.eq(0)

  })

})