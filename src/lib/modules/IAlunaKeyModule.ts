import { IAlunaModule } from '../core/IAlunaModule'
import { IAlunaApiRequestSchema } from '../schemas/IAlunaApiRequestSchema'
import {
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../schemas/IAlunaKeySchema'



export interface IAlunaKeyModule extends IAlunaModule {

  /* eslint-disable max-len */

  fetchDetails (): Promise<IAlunaKeyFetchDetailsReturns>
  parseDetails (params: IAlunaKeyParseDetailsParams): IAlunaKeyParseDetailsReturns
  parsePermissions (params: IAlunaKeyParsePermissionsParams): IAlunaKeyParsePermissionsReturns

  /* eslint-enable max-len */

}



/**
 * Parse
 */

export interface IAlunaKeyParseDetailsParams {
  rawKey: any
}

export interface IAlunaKeyParseDetailsReturns extends IAlunaApiRequestSchema {
  key: IAlunaKeySchema
}



export interface IAlunaKeyParsePermissionsParams<T> {
  rawKey: T
}

export interface IAlunaKeyParsePermissionsReturns extends IAlunaApiRequestSchema {
  key: IAlunaKeyPermissionSchema
}



/**
 * Fetch
 */

export interface IAlunaKeyFetchDetailsReturns extends IAlunaApiRequestSchema {
  key: IAlunaKeySchema
}
