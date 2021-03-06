import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Gate } from '../../../Gate'
import { GateHttp } from '../../../GateHttp'
import { getGateEndpoints } from '../../../gateSpecs'
import { GATE_RAW_MARKETS } from '../../../test/fixtures/gateMarket'



describe(__filename, () => {

  it('should list Gate raw markets just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: GateHttp.prototype })

    publicRequest.returns(Promise.resolve(GATE_RAW_MARKETS))


    // executing
    const exchange = new Gate({})

    const {
      rawMarkets,
      requestWeight,
    } = await exchange.market.listRaw()


    // validating
    expect(rawMarkets).to.deep.eq(GATE_RAW_MARKETS)

    expect(requestWeight).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getGateEndpoints(exchange.settings).market.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
