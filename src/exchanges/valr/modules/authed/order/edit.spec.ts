import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockOrderCancel } from '../../../../../../test/mocks/exchange/modules/order/mockOrderCancel'
import { mockOrderPlace } from '../../../../../../test/mocks/exchange/modules/order/mockOrderPlace'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderEditParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { VALR_RAW_LIST_RESPONSE_ORDERS } from '../../../test/fixtures/valrOrders'
import { ValrAuthed } from '../../../ValrAuthed'
import { ValrHttp } from '../../../ValrHttp'
import * as cancelMod from './cancel'
import * as placeMod from './place'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should edit a Valr order just fine', async () => {

    // preparing data
    const http = new ValrHttp({})

    const mockedRawOrder = VALR_RAW_LIST_RESPONSE_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const {
      orderId: id,
      originalQuantity: quantity,
    } = mockedRawOrder


    // mocking
    mockHttp({ classPrototype: ValrHttp.prototype })

    const { cancel } = mockOrderCancel({ module: cancelMod })

    const { place } = mockOrderPlace({ module: placeMod })

    place.returns({ order: mockedParsedOrder })

    mockValidateParams()

    // executing
    const exchange = new ValrAuthed({ credentials })

    const params: IAlunaOrderEditParams = {
      id,
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: Number(quantity),
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      rate: 0,
    }

    const {
      order,
      requestWeight,
    } = await exchange.order.edit(params)


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(requestWeight).to.deep.eq(http.requestWeight)

    expect(cancel.callCount).to.be.eq(1)

    expect(cancel.firstCall.args[0]).to.deep.eq({
      http,
      id,
      symbolPair: params.symbolPair,
      type: AlunaOrderTypesEnum.LIMIT,
    })

    expect(place.callCount).to.be.eq(1)

    expect(place.firstCall.args[0]).to.deep.eq({
      http,
      rate: params.rate,
      side: params.side,
      type: params.type,
      amount: params.amount,
      account: params.account,
      symbolPair: params.symbolPair,
    })

  })

})
