import { expect } from 'chai'

import { AlunaExchangeErrorCodes } from '../../lib/errors/AlunaExchangeErrorCodes'
import { executeAndCatch } from '../../utils/executeAndCatch'
import { getBittrexEndpoints } from './bittrexSpecs'



describe(__filename, () => {

  it('should get production endpoints', async () => {

    // executing
    const {
      error,
      result,
    } = await executeAndCatch(() => getBittrexEndpoints({ useTestNet: false }))

    // validating
    expect(error).not.to.be.ok
    expect(result).to.be.ok

  })

  it('should warn about testnet unavaiability', async () => {

    // executing
    const {
      error,
      result,
    } = await executeAndCatch(() => getBittrexEndpoints({ useTestNet: true }))

    // validating
    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error?.code).to.eq(AlunaExchangeErrorCodes.EXCHANGE_DONT_HAVE_TESTNET)
    expect(error?.message).to.eq('Bittrex don\'t have a testnet.')

  })

})
