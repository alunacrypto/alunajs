import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockOrderParse } from '../../../../../../test/mocks/exchange/modules/order/mockOrderParse'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaAccountsErrorCodes } from '../../../../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { BittrexAuthed } from '../../../BittrexAuthed'
import { BittrexHttp } from '../../../BittrexHttp'
import { bittrexBaseSpecs, BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import { translateOrderSideToBittrex } from '../../../enums/adapters/bittrexOrderSideAdapter'
import { translateOrderTypeToBittrex } from '../../../enums/adapters/bittrexOrderTypeAdapter'
import { BittrexOrderTimeInForceEnum } from '../../../enums/BittrexOrderTimeInForceEnum'
import { BITTREX_PARSED_ORDERS, BITTREX_RAW_ORDERS } from '../../../test/fixtures/bittrexOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should place a Bittrex limit order just fine', async () => {

    // preparing data
    const http = new BittrexHttp()

    const mockedRawOrder = BITTREX_RAW_ORDERS[0]
    const mockedParsedOrder = BITTREX_PARSED_ORDERS[0]

    const {
      marketSymbol,
      quantity,
      limit,
    } = mockedRawOrder

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.LIMIT

    const translatedOrderSide = translateOrderSideToBittrex({ from: side })
    const translatedOrderType = translateOrderTypeToBittrex({ from: type })

    const body = {
      direction: translatedOrderSide,
      marketSymbol,
      type: translatedOrderType,
      quantity: Number(quantity),
      limit: Number(limit),
      timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    const { parse } = mockOrderParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()


    // executing
    const exchange = new BittrexAuthed({ credentials })

    const {
      order,
      requestCount,
    } = await exchange.order.place({
      symbolPair: marketSymbol,
      account: AlunaAccountEnum.EXCHANGE,
      amount: Number(quantity),
      side,
      type,
      rate: Number(limit),
    })


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(requestCount).to.deep.eq(http.requestCount)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      body,
      credentials,
      url: `${BITTREX_PRODUCTION_URL}/orders`,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should place a Bittrex market order just fine', async () => {

    // preparing data
    const http = new BittrexHttp()

    const mockedRawOrder = BITTREX_RAW_ORDERS[0]
    const mockedParsedOrder = BITTREX_PARSED_ORDERS[0]

    const {
      marketSymbol,
      quantity,
      limit,
    } = mockedRawOrder

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.MARKET

    const translatedOrderSide = translateOrderSideToBittrex({ from: side })
    const translatedOrderType = translateOrderTypeToBittrex({ from: type })

    const body = {
      direction: translatedOrderSide,
      marketSymbol,
      type: translatedOrderType,
      quantity: Number(quantity),
      timeInForce: BittrexOrderTimeInForceEnum.FILL_OR_KILL,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    const { parse } = mockOrderParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    mockValidateParams()


    // executing
    const exchange = new BittrexAuthed({ credentials })

    const {
      order,
      requestCount,
    } = await exchange.order.place({
      symbolPair: marketSymbol,
      account: AlunaAccountEnum.EXCHANGE,
      amount: Number(quantity),
      side,
      type,
      rate: Number(limit),
    })


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(requestCount).to.deep.eq(http.requestCount)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      body,
      credentials,
      url: `${BITTREX_PRODUCTION_URL}/orders`,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it(
    'should throw an error placing for insufficient funds '
      .concat('placing a new bittrex order'),
    async () => {

      // preparing data
      const mockedRawOrder = BITTREX_RAW_ORDERS[0]

      const {
        marketSymbol,
        quantity,
        limit,
      } = mockedRawOrder

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET

      const expectedMessage = 'Account has insufficient balance '
        .concat('for requested action.')
      const expectedCode = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      const alunaError = new AlunaError({
        message: 'dummy-error',
        code: AlunaOrderErrorCodes.PLACE_FAILED,
        httpStatusCode: 401,
        metadata: {
          code: 'INSUFFICIENT_FUNDS',
        },
      })

      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: BittrexHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()


      // executing
      const exchange = new BittrexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account: AlunaAccountEnum.EXCHANGE,
        amount: Number(quantity),
        side,
        type,
        rate: Number(limit),
      }))


      // validating

      expect(error instanceof AlunaError).to.be.ok
      expect(error?.code).to.be.eq(expectedCode)
      expect(error?.message).to.be.eq(expectedMessage)

      expect(authedRequest.callCount).to.be.eq(1)

      expect(publicRequest.callCount).to.be.eq(0)

    },
  )

  it(
    'should throw an error placing for minimum value '
      .concat('placing a new bittrex order'),
    async () => {

      // preparing data
      const mockedRawOrder = BITTREX_RAW_ORDERS[0]

      const {
        marketSymbol,
        quantity,
        limit,
      } = mockedRawOrder

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET

      const expectedMessage = 'The amount of quote currency involved in '
        .concat('a transaction would be less ')
        .concat('than the minimum limit of 10K satoshis')
      const expectedCode = AlunaGenericErrorCodes.UNKNOWN

      const alunaError = new AlunaError({
        message: 'dummy-error',
        code: AlunaOrderErrorCodes.PLACE_FAILED,
        httpStatusCode: 401,
        metadata: {
          code: 'DUST_TRADE_DISALLOWED_MIN_VALUE',
        },
      })

      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: BittrexHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()


      // executing
      const exchange = new BittrexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account: AlunaAccountEnum.EXCHANGE,
        amount: Number(quantity),
        side,
        type,
        rate: Number(limit),
      }))


      // validating

      expect(error instanceof AlunaError).to.be.ok
      expect(error?.code).to.be.eq(expectedCode)
      expect(error?.message).to.be.eq(expectedMessage)

      expect(authedRequest.callCount).to.be.eq(1)

      expect(publicRequest.callCount).to.be.eq(0)

    },
  )

  it(
    'should throw an error placing for minimum size '
      .concat('placing a new bittrex order'),
    async () => {

      // preparing data
      const mockedRawOrder = BITTREX_RAW_ORDERS[0]

      const {
        marketSymbol,
        quantity,
        limit,
      } = mockedRawOrder

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET

      const expectedMessage = 'The trade was smaller than the min '
        .concat('trade size quantity for the market')
      const expectedCode = AlunaOrderErrorCodes.PLACE_FAILED

      const alunaError = new AlunaError({
        message: 'dummy-error',
        code: AlunaOrderErrorCodes.PLACE_FAILED,
        httpStatusCode: 401,
        metadata: {
          code: 'MIN_TRADE_REQUIREMENT_NOT_MET',
        },
      })

      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: BittrexHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()


      // executing
      const exchange = new BittrexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account: AlunaAccountEnum.EXCHANGE,
        amount: Number(quantity),
        side,
        type,
        rate: Number(limit),
      }))

      // validating

      expect(error instanceof AlunaError).to.be.ok
      expect(error?.code).to.be.eq(expectedCode)
      expect(error?.message).to.be.eq(expectedMessage)

      expect(authedRequest.callCount).to.be.eq(1)

      expect(publicRequest.callCount).to.be.eq(0)

    },
  )

  it(
    'should ensure a valid account is passed',
    async () => {

      // preparing data
      const mockedRawOrder = BITTREX_RAW_ORDERS[0]

      const {
        marketSymbol,
        quantity,
        limit,
      } = mockedRawOrder

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET
      const account = 'unknown' as AlunaAccountEnum

      const expectedMessage = `Account type '${account}' not found`
      const expectedCode = AlunaAccountsErrorCodes.TYPE_NOT_FOUND

      // mocking
      mockValidateParams()

      // executing
      const exchange = new BittrexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account,
        amount: Number(quantity),
        side,
        type,
        rate: Number(limit),
      }))


      // validating

      expect(error instanceof AlunaError).to.be.ok
      expect(error?.message).to.be.eq(expectedMessage)
      expect(error?.code).to.be.eq(expectedCode)
    },
  )

  it(
    'should ensure the account type is implemented/supported',
    async () => {

      // preparing data
      const mockedRawOrder = BITTREX_RAW_ORDERS[0]

      const {
        marketSymbol,
        quantity,
        limit,
      } = mockedRawOrder

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET
      const account = AlunaAccountEnum.MARGIN

      const expectedMessage = `Account type '${account}' not `
        .concat('supported/implemented for Bittrex')
      const expectedCode = AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED

      // mocking
      mockValidateParams()

      // executing
      const exchange = new BittrexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account,
        amount: Number(quantity),
        side,
        type,
        rate: Number(limit),
      }))


      // validating

      expect(error instanceof AlunaError).to.be.ok
      expect(error?.message).to.be.eq(expectedMessage)
      expect(error?.code).to.be.eq(expectedCode)
    },
  )

  it(
    'should ensure the order type is implemented/supported',
    async () => {

      // preparing data
      const mockedRawOrder = BITTREX_RAW_ORDERS[0]

      const {
        marketSymbol,
        quantity,
        limit,
      } = mockedRawOrder

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET
      const account = AlunaAccountEnum.LENDING

      const accountSpecs = bittrexBaseSpecs.accounts.find((a) => {
        return a.type === account
      })

      accountSpecs!.implemented = true

      accountSpecs!.supported = true

      const expectedMessage = `Order type '${type}' not `
        .concat('supported/implemented for Bittrex')
      const expectedCode = AlunaOrderErrorCodes.TYPE_NOT_SUPPORTED

      // mocking
      mockValidateParams()

      // executing
      const exchange = new BittrexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account,
        amount: Number(quantity),
        side,
        type,
        rate: Number(limit),
      }))


      // validating

      expect(error instanceof AlunaError).to.be.ok
      expect(error?.message).to.be.eq(expectedMessage)
      expect(error?.code).to.be.eq(expectedCode)

    },
  )

  it(
    'should ensure the order type is on read mode',
    async () => {

      // preparing data
      const mockedRawOrder = BITTREX_RAW_ORDERS[0]

      const {
        marketSymbol,
        quantity,
        limit,
      } = mockedRawOrder

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.STOP_LIMIT
      const account = AlunaAccountEnum.EXCHANGE

      const expectedMessage = `Order type '${type}' is in read mode`
      const expectedCode = AlunaOrderErrorCodes.TYPE_IS_READ_ONLY

      // mocking
      mockValidateParams()

      // executing
      const exchange = new BittrexAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: marketSymbol,
        account,
        amount: Number(quantity),
        side,
        type,
        rate: Number(limit),
      }))


      // validating

      expect(error instanceof AlunaError).to.be.ok
      expect(error?.message).to.be.eq(expectedMessage)
      expect(error?.code).to.be.eq(expectedCode)

    },
  )

})