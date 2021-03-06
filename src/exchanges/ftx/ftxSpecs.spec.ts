import { expect } from 'chai'

import { executeAndCatch } from '../../utils/executeAndCatch'
import { getFtxEndpoints } from './ftxSpecs'



describe(__filename, () => {

  it('should get production endpoints', async () => {

    // executing
    const {
      error,
      result,
    } = await executeAndCatch(() => getFtxEndpoints({ useTestNet: false }))

    // validating
    expect(error).not.to.be.ok
    expect(result).to.be.ok

  })

})
