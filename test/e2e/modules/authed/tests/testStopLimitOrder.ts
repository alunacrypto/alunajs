import BigNumber from 'bignumber.js'
import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../../src/lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../src/lib/enums/AlunaOrderTypesEnum'
import { IAuthedParams } from '../../IAuthedParams'
import { placeStopLimitOrder } from '../helpers/order/placeStopLimitOrder'



export const testStopLimitOrder = (params: IAuthedParams) => {

  const {
    liveData,
    exchangeAuthed,
    exchangeConfigs,
  } = params

  describe('type:stopLimit', () => {

    it('place', async () => {

      const {
        order,
        requestWeight,
      } = await placeStopLimitOrder(params)

      expect(order).to.exist
      expect(order.type).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

      liveData.stopLimitOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair

    })

    it('get:placedOrder', async () => {

      const {
        stopLimitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: stopLimitOrderId!,
      })

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

    })

    it('edit', async () => {

      const {
        stopLimitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        orderAccount,
        orderAmount,
        orderLimitRate,
        orderStopRate,
      } = exchangeConfigs

      const newAmount = new BigNumber(orderAmount).times(1.02).toNumber()

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.edit({
        id: stopLimitOrderId!,
        symbolPair: orderSymbolPair!,
        account: orderAccount || AlunaAccountEnum.EXCHANGE,
        amount: newAmount,
        limitRate: orderLimitRate,
        stopRate: orderStopRate,
        side: AlunaOrderSideEnum.BUY,
        type: AlunaOrderTypesEnum.STOP_LIMIT,
      })

      expect(order).to.exist
      expect(order.amount).to.be.eq(newAmount)

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

      liveData.stopLimitOrderId = order.id!
      liveData.orderSymbolPair = order.symbolPair
      liveData.orderEditedAmount = newAmount

    })

    it('get:editedOrder', async () => {

      const {
        stopLimitOrderId,
        orderSymbolPair,
        orderEditedAmount,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: stopLimitOrderId!,
      })

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
      expect(order.amount).to.be.eq(orderEditedAmount)

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

    })

    it('cancel', async () => {

      const {
        stopLimitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.cancel({
        symbolPair: orderSymbolPair!,
        id: stopLimitOrderId!,
      })

      expect(order).to.exist

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

    })

    it('get:canceledOrder', async () => {

      const {
        stopLimitOrderId,
        orderSymbolPair,
      } = liveData

      const {
        order,
        requestWeight,
      } = await exchangeAuthed.order.get({
        symbolPair: orderSymbolPair!,
        id: stopLimitOrderId!,
      })

      expect(order).to.exist
      expect(order.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

      expect(requestWeight.authed).to.be.greaterThan(0)
      expect(requestWeight.public).to.be.eq(0)

    })

  })

}