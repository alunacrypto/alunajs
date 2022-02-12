import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import {
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../../../lib/schemas/IAlunaKeySchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { IBitfinexKey } from '../schemas/IBitfinexKeySchema'



export class BitfinexKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public async fetchDetails (): Promise<IAlunaKeySchema> {

    BitfinexLog.info('fetching Bitfinex key details')

    const { keySecret } = this.exchange

    let rawKey: IBitfinexKey

    try {

      rawKey = await BitfinexHttp.privateRequest<IBitfinexKey>({
        url: 'https://api.bitfinex.com/v2/auth/r/permissions',
        keySecret,
      })

    } catch (error) {

      const { message } = error
      let { code, httpStatusCode } = error

      if (['apikey: invalid', 'apikey: digest invalid'].includes(message)) {

        code = AlunaKeyErrorCodes.INVALID
        httpStatusCode = 200

      }

      throw new AlunaError({
        code,
        message: error.message,
        httpStatusCode,
        metadata: error,
      })


    }

    const details = this.parseDetails({ rawKey })

    return details

  }

  public parseDetails (params: {
    rawKey: IBitfinexKey,
  }): IAlunaKeySchema {

    BitfinexLog.info('parsing Bitfinex key details')

    const {
      rawKey,
    } = params

    this.details = {
      meta: rawKey,
      accountId: undefined,
      permissions: this.parsePermissions({ rawKey }),
    }

    return this.details

  }

  public parsePermissions (params: {
    rawKey: IBitfinexKey,
  }): IAlunaKeyPermissionSchema {

    BitfinexLog.info('parsing Bitfinex key permissions')

    const { rawKey } = params

    const [
      _accountScope,
      ordersScope,
      _fundingScope,
      _settingsScope,
      walletsScope,
      withdrawScope,
    ] = rawKey

    const canReadBalances = walletsScope[1] === 1

    const canReadOrders = ordersScope[1] === 1
    const canCreateOrders = ordersScope[2] === 1

    const canWithdraw = withdrawScope[2] === 1

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: canReadBalances && canReadOrders,
      trade: canCreateOrders,
      withdraw: canWithdraw,
    }

    return alunaPermissions

  }

}
