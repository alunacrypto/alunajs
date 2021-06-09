import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/abstracts/IAlunaExchange'
import { AccountEnum } from '../../../lib/enums/AccountEnum'
import { OrderTypesEnum } from '../../../lib/enums/OrderTypeEnum'
import { SideEnum } from '../../../lib/enums/SideEnum'
import { ValrOrderTimeInForceEnum } from '../enums/ValrOrderTimeInForceEnum'
import { ValrSideEnum } from '../enums/ValrSideEnum'
import { ValrHttp } from '../ValrHttp'
import { ValrOrderWriteModule } from './ValrOrderWriteModule'



describe('ValrOrderWriteModule', () => {

  const valrOrderWriteModule = ValrOrderWriteModule.prototype

  const keySecret = {
    key: '',
    secret: '',
  }

  const placedOrderId = 'placed-order-id'

  const placedOrder = 'placed-order'



  it('should place a new Valr limit order just fine', async () => {

    ImportMock.mockOther(
      valrOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      { id: placedOrderId },
    )

    const getMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'get',
      placedOrder,
    )

    const placeOrderParams = {
      amount: '0.001',
      rate: '10000',
      symbolPair: 'ETHZAR',
      side: SideEnum.LONG,
      type: OrderTypesEnum.LIMIT,
      account: AccountEnum.EXCHANGE,
    }

    const requestBody = {
      side: ValrSideEnum.BUY,
      pair: placeOrderParams.symbolPair,
      quantity: placeOrderParams.amount,
      price: placeOrderParams.rate,
      postOnly: false,
      timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
    }


    // place long limit order
    const placeResponse1 = await valrOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: 'https://api.valr.com/v1/orders/limit',
      body: requestBody,
      keySecret,
    })).to.be.true


    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: placeOrderParams.symbolPair,
    })).to.be.true

    expect(placeResponse1).to.deep.eq(getMock.returnValues[0])


    // place short limit order
    const placeResponse2 = await valrOrderWriteModule.place({
      ...placeOrderParams,
      side: SideEnum.SHORT,
    })


    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: 'https://api.valr.com/v1/orders/limit',
      body: {
        ...requestBody,
        side: ValrSideEnum.SELL,
      },
      keySecret,
    })).to.be.true

    expect(getMock.callCount).to.be.eq(2)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: placeOrderParams.symbolPair,
    })).to.be.true

    expect(placeResponse2).to.deep.eq(getMock.returnValues[1])

  })



  it('should place a new Valr market order just fine', async () => {

    ImportMock.mockOther(
      valrOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      { id: placedOrderId },
    )

    const getMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'get',
      placedOrder,
    )

    const params = {
      amount: '0.001',
      rate: '0',
      symbolPair: 'ETHZAR',
      side: SideEnum.LONG,
      type: OrderTypesEnum.MARKET,
      account: AccountEnum.EXCHANGE,
    }

    const requestBody = {
      side: ValrSideEnum.BUY,
      pair: params.symbolPair,
      baseAmount: params.amount,
    }


    // place long market order
    const placeResponse1 = await valrOrderWriteModule.place(params)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: 'https://api.valr.com/v1/orders/market',
      body: requestBody,
      keySecret,
    })).to.be.true

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: params.symbolPair,
    })).to.be.true

    expect(placeResponse1).to.deep.eq(getMock.returnValues[0])


    // place short market order
    const placeResponse2 = await valrOrderWriteModule.place({
      ...params,
      side: SideEnum.SHORT,
    })


    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: 'https://api.valr.com/v1/orders/market',
      body: {
        ...requestBody,
        side: ValrSideEnum.SELL,
      },
      keySecret,
    })).to.be.true

    expect(getMock.callCount).to.be.eq(2)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: params.symbolPair,
    })).to.be.true

    expect(placeResponse2).to.deep.eq(getMock.returnValues[1])

  })

})
