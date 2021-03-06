import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaPositionStatusEnum } from '../../../../../lib/enums/AlunaPositionStatusEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { bitfinexBaseSpecs } from '../../../bitfinexSpecs'
import { translatePositionSideToAluna } from '../../../enums/adapters/bitfinexPositionSideAdapter'
import { BitfinexPositionStatusEnum } from '../../../enums/BitfinexPositionStatusEnum'
import { IBitfinexPositionSchema } from '../../../schemas/IBitfinexPositionSchema'
import { BITFINEX_RAW_POSITIONS } from '../../../test/fixtures/bitfinexPosition'
import { mockSplitSymbolPair } from '../../public/market/helpers/splitSymbolPair.mock'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse Bitfinex position just fine (OPEN)', async () => {

    // preparing data
    const rawPosition = cloneDeep(BITFINEX_RAW_POSITIONS[0])
    rawPosition[1] = BitfinexPositionStatusEnum.ACTIVE


    // executing
    runTest(rawPosition)

  })


  it('should parse Bitfinex position just fine (CLOSED)', async () => {

    // preparing data
    const rawPosition = cloneDeep(BITFINEX_RAW_POSITIONS[0])
    rawPosition[1] = BitfinexPositionStatusEnum.CLOSED


    // executing
    runTest(rawPosition)

  })

  it('should parse Bitfinex position just fine (AMOUNT ZEROED)', async () => {

    // preparing data
    const rawPosition = cloneDeep(BITFINEX_RAW_POSITIONS[0])
    rawPosition[2] = 0


    // executing
    runTest(rawPosition)

  })

  it('should parse Bitfinex position just fine (PLs NOT NULL)', async () => {

    // preparing data
    const rawPosition = cloneDeep(BITFINEX_RAW_POSITIONS[0])
    rawPosition[6] = 5
    rawPosition[7] = 10
    rawPosition[8] = 15
    rawPosition[9] = 20


    // executing
    runTest(rawPosition)

  })

  it('should parse Bitfinex position just fine (mtsCreate NULL)', async () => {

    // preparing data
    const rawPosition = cloneDeep(BITFINEX_RAW_POSITIONS[0])
    rawPosition[12] = null


    // executing
    runTest(rawPosition)

  })

  it('should parse Bitfinex position just fine (meta.trade_price UNDEFINED)', async () => {

    // preparing data
    const rawPosition = cloneDeep(BITFINEX_RAW_POSITIONS[0])
    rawPosition[19].trade_price = undefined


    // executing
    runTest(rawPosition)

  })

  it('should parse Bitfinex position just fine (meta.trade_amount UNDEFINED)', async () => {

    // preparing data
    const rawPosition = cloneDeep(BITFINEX_RAW_POSITIONS[0])
    rawPosition[2] = 0
    rawPosition[19].trade_amount = undefined


    // executing
    runTest(rawPosition)

  })



  const runTest = (rawPosition: IBitfinexPositionSchema) => {

    // preparing data
    const mockedBaseSymbolId = 'BTC'
    const mockedQuoteSymbolId = 'ETH'


    // mocking
    const { splitSymbolPair } = mockSplitSymbolPair({
      baseSymbolId: mockedBaseSymbolId,
      quoteSymbolId: mockedQuoteSymbolId,
    })

    const mockedDate = new Date(Date.now())

    function fakeDateConstructor() {

      return mockedDate

    }

    ImportMock.mockOther(
      global,
      'Date',
      fakeDateConstructor as any,
    )


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { position } = exchange.position!.parse({
      rawPosition,
    })



    // validating
    const {
      expectedAmount,
      expectedBasePrice,
      expectedClosePrice,
      expectedClosedAt,
      expectedLeverage,
      expectedLiquidationPrice,
      expectedOpenPrice,
      expectedOpenedAt,
      expectedPl,
      expectedPlPercentage,
      expectedSide,
      expectedStatus,
      expectedTotal,
    } = getExpectedPositionsProps(rawPosition)


    expect(position.exchangeId).to.be.eq(bitfinexBaseSpecs.id)

    expect(position.id).to.be.eq(rawPosition[11].toString())

    expect(position.symbolPair).to.be.eq(rawPosition[0])
    expect(position.baseSymbolId).to.be.eq(mockedBaseSymbolId)
    expect(position.quoteSymbolId).to.be.eq(mockedQuoteSymbolId)

    expect(position.status).to.be.eq(expectedStatus)
    expect(position.side).to.be.eq(expectedSide)

    expect(position.basePrice).to.be.eq(expectedBasePrice)
    expect(position.openPrice).to.be.eq(expectedOpenPrice)
    expect(position.amount).to.be.eq(expectedAmount)
    expect(position.total).to.be.eq(expectedTotal)

    expect(position.pl).to.be.eq(expectedPl)
    expect(position.plPercentage).to.be.eq(expectedPlPercentage)
    expect(position.liquidationPrice).to.be.eq(expectedLiquidationPrice)
    expect(position.leverage).to.be.eq(expectedLeverage)

    expect(position.openedAt).to.deep.eq(expectedOpenedAt)
    expect(position.closedAt).to.deep.eq(expectedClosedAt)
    expect(position.closePrice).to.deep.eq(expectedClosePrice)

    expect(splitSymbolPair.callCount).to.be.eq(1)
    expect(splitSymbolPair.firstCall.args[0]).to.deep.eq({
      symbolPair: rawPosition[0],
    })

  }

  const getExpectedPositionsProps = (
    rawPosition: IBitfinexPositionSchema,
  ) => {

    // validating
    const [
      _symbol,
      status,
      amount,
      basePrice,
      _funding,
      _fundingType,
      pl,
      plPerc,
      priceLiq,
      leverage,
      _placeholder1,
      _positionId,
      mtsCreate,
      mtsUpdate,
      _placeholder2,
      _type,
      _placeholder3,
      _collateral,
      _collateralMin,
      meta,
    ] = rawPosition

    const expectedStatus = status === BitfinexPositionStatusEnum.ACTIVE
      ? AlunaPositionStatusEnum.OPEN
      : AlunaPositionStatusEnum.CLOSED

    let expectedAmount

    if (amount === 0) {

      expectedAmount = meta.trade_amount
        ? Math.abs(Number(meta.trade_amount))
        : 0

    } else {

      expectedAmount = Math.abs(amount)

    }

    const expectedBasePrice = Number(basePrice)
    const expectedOpenPrice = meta.trade_price
      ? Number(meta.trade_price)
      : basePrice


    const expectedTotal = expectedAmount * expectedBasePrice

    const expectedPl = pl !== null ? pl : 0
    const expectedPlPercentage = plPerc !== null ? plPerc : 0
    const expectedLiquidationPrice = priceLiq !== null ? priceLiq : 0
    const expectedLeverage = leverage !== null ? leverage : 0

    const expectedOpenedAt = mtsCreate
      ? new Date(mtsCreate)
      : new Date()

    let expectedClosedAt
    let expectedClosePrice

    if (mtsUpdate && (expectedStatus === AlunaPositionStatusEnum.CLOSED)) {

      expectedClosedAt = new Date(mtsUpdate)

      expectedClosePrice = Number(expectedBasePrice)

    }

    const expectedSide = translatePositionSideToAluna({
      amount,
    })

    return {
      expectedStatus,
      expectedAmount,
      expectedBasePrice,
      expectedOpenPrice,
      expectedTotal,
      expectedPl,
      expectedPlPercentage,
      expectedLiquidationPrice,
      expectedLeverage,
      expectedOpenedAt,
      expectedClosedAt,
      expectedClosePrice,
      expectedSide,
    }

  }

})
