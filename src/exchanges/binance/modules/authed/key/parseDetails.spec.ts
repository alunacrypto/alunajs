import { expect } from 'chai'

import { mockParsePermissions } from '../../../../../../test/mocks/exchange/modules/key/mockParsePermissions'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { IBinanceKeySchema } from '../../../schemas/IBinanceKeySchema'
import { BINANCE_KEY_PERMISSIONS } from '../../../test/fixtures/binanceKey'
import * as mockParsePermissionsMod from './parsePermissions'



describe(__filename, () => {

  it('should parse Binance key details just fine', async () => {

    // preparing data
    const rawKey: IBinanceKeySchema = {
      ...BINANCE_KEY_PERMISSIONS,
      permissions: [],
    }

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
      passphrase: 'passphrase',
    }

    const permissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }


    // mocking
    const { parsePermissions } = mockParsePermissions({
      module: mockParsePermissionsMod,
    })

    parsePermissions.returns({ permissions })


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { key } = exchange.key.parseDetails({ rawKey })


    // validating
    expect(key).to.deep.eq({
      accountId: undefined,
      permissions,
      meta: rawKey,
    })

    expect(parsePermissions.callCount).to.be.eq(1)
    expect(parsePermissions.firstCall.args[0]).to.deep.eq({
      rawKey,
    })

  })

})
