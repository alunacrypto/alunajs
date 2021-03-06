import { expect } from 'chai'
import {
  each,
  entries,
} from 'lodash'
import sleep from 'sleep-promise'

import { AlunaError } from '../../../../src/lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaPositionSideEnum } from '../../../../src/lib/enums/AlunaPositionSideEnum'
import { AlunaPositionStatusEnum } from '../../../../src/lib/enums/AlunaPositionStatusEnum'
import { AlunaGenericErrorCodes } from '../../../../src/lib/errors/AlunaGenericErrorCodes'
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

  const { id } = exchangeAuthed

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

  const hasLeverage = exchangeAuthed.position!.getLeverage

  if (hasLeverage) {

    const {
      leverageToSet,
      defaultLeverage,
      symbolPair,
    } = exchangeConfigs

    const leverageProps = {
      defaultLeverage,
      leverageToSet,
    }

    each(entries(leverageProps), ([key, value]) => {

      if (!value) {

        throw new AlunaError({
          code: AlunaGenericErrorCodes.PARAM_ERROR,
          message: `e2e config prop '${key}' is required for exchange ${id}`,
        })

      }

    })

    it('leverage:get', async () => {

      const {
        leverage,
        requestWeight,
      } = await exchangeAuthed.position!.getLeverage!({
        id: liveData.positionId,
        symbolPair,
      })

      expect(leverage).to.exist

      expect(requestWeight.authed).to.be.greaterThan(0)

    })

    it('leverage:set', async () => {

      const {
        leverage,
        requestWeight,
      } = await exchangeAuthed.position!.setLeverage!({
        leverage: leverageToSet!,
        symbolPair,
        id: liveData.positionId,
      })

      expect(leverage).to.exist
      expect(leverage).to.be.eq(leverageToSet)

      expect(requestWeight.authed).to.be.greaterThan(0)

    })

    it('leverage:get:setted', async () => {

      const {
        leverage,
        requestWeight,
      } = await exchangeAuthed.position!.getLeverage!({
        id: liveData.positionId,
        symbolPair,
      })

      expect(leverage).to.exist
      expect(leverage).to.be.eq(leverageToSet)

      expect(requestWeight.authed).to.be.greaterThan(0)

    })

    it('leverage:set:revert', async () => {

      const {
        leverage,
        requestWeight,
      } = await exchangeAuthed.position!.setLeverage!({
        leverage: defaultLeverage!,
        symbolPair,
        id: liveData.positionId,
      })

      expect(leverage).to.exist
      expect(leverage).to.be.eq(defaultLeverage)

      expect(requestWeight.authed).to.be.greaterThan(0)

    })

  }

}
