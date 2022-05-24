import { expect } from 'chai'
import sleep from 'sleep-promise'

import { AlunaOrderSideEnum } from '../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaPositionSideEnum } from '../../../../src/lib/enums/AlunaPositionSideEnum'
import { AlunaPositionStatusEnum } from '../../../../src/lib/enums/AlunaPositionStatusEnum'
import { IAuthedParams } from '../IAuthedParams'
import { placeMarketOrder } from './helpers/order/placeMarketOrder'



export function position(params: IAuthedParams) {

  const {
    exchangeAuthed,
    exchangeConfigs,
    liveData,
  } = params

  const {
    orderAccount,
  } = exchangeConfigs


  before(async () => {

    await placeMarketOrder({
      authed: params,
      side: AlunaOrderSideEnum.BUY,
    })

    await sleep(1000)

  })

  it('listRaw', async () => {

    const {
      rawPositions,
      requestWeight,
    } = await exchangeAuthed.position!.listRaw()

    expect(rawPositions).to.exist

    expect(requestWeight.authed).to.be.greaterThan(0)

  })

  it('list', async () => {

    const {
      positions,
      requestWeight,
    } = await exchangeAuthed.position!.list()

    expect(positions).to.exist
    expect(positions.length).to.greaterThan(0)

    expect(requestWeight.authed).to.be.greaterThan(0)

    liveData.positionId = positions[0].id
    liveData.positionSymbolPair = positions[0].symbolPair

  })

  it('getRaw', async () => {

    const {
      rawPosition,
      requestWeight,
    } = await exchangeAuthed.position!.getRaw({
      id: liveData.positionId,
      symbolPair: liveData.positionSymbolPair,
    })

    expect(rawPosition).to.exist

    expect(requestWeight.authed).to.be.greaterThan(0)

  })

  it('get', async () => {

    const {
      position,
      requestWeight,
    } = await exchangeAuthed.position!.get({
      id: liveData.positionId,
      symbolPair: liveData.positionSymbolPair,
    })

    expect(position).to.exist

    expect(position.symbolPair).to.exist
    expect(position.exchangeId).to.exist
    expect(position.baseSymbolId).to.exist
    expect(position.quoteSymbolId).to.exist
    expect(position.total).to.exist
    expect(position.amount).to.exist
    expect(position.basePrice).to.exist
    expect(position.openPrice).to.exist
    expect(position.quoteSymbolId).to.exist
    expect(position.account).to.be.eq(orderAccount)
    expect(position.status).to.be.eq(AlunaPositionStatusEnum.OPEN)
    expect(position.side).to.be.eq(AlunaPositionSideEnum.LONG)
    expect(position.pl).to.exist
    expect(position.plPercentage).to.exist
    expect(position.openedAt).to.exist
    expect(position.plPercentage).to.exist
    expect(position.meta).to.exist

    expect(requestWeight.authed).to.be.greaterThan(0)

  })

  it('close', async () => {

    const {
      position,
      requestWeight,
    } = await exchangeAuthed.position!.close({
      id: liveData.positionId,
      symbolPair: liveData.positionSymbolPair,
    })

    expect(position).to.exist
    expect(position.closedAt).to.exist
    expect(position.closePrice).to.exist
    expect(position.status).to.be.eq(AlunaPositionStatusEnum.CLOSED)

    expect(requestWeight.authed).to.be.greaterThan(1)

    // Wait to ensure exchange server has processed the operation
    await sleep(1000)

  })

  it('get:closed', async () => {

    const {
      position,
      requestWeight,
    } = await exchangeAuthed.position!.get({
      id: liveData.positionId,
      symbolPair: liveData.positionSymbolPair,
    })

    expect(position).to.exist
    expect(position.closedAt).to.exist
    expect(position.closePrice).to.exist
    expect(position.status).to.be.eq(AlunaPositionStatusEnum.CLOSED)

    expect(requestWeight.authed).to.be.greaterThan(0)

  })

}
