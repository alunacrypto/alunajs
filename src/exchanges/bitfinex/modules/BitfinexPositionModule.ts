import { IAlunaPositionModule } from '../../..'
import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import {
  IAlunaPositionCloseParams,
  IAlunaPositionGetParams,
  IAlunaPositionListParams,
} from '../../../lib/modules/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../lib/schemas/IAlunaPositionSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { IBitfinexPositionSchema } from '../schemas/IBitfinexPositionSchema'
import { BitfinexPositionParser } from '../schemas/parsers/BitfinexPositionParser'



export class BitfinexPositionModule extends AAlunaModule implements IAlunaPositionModule {

  async list (
    params?: IAlunaPositionListParams,
  ): Promise<IAlunaPositionSchema[]> {

    const rawPositions = await this.listRaw(params)

    const parsedPositions = this.parseMany({ rawPositions })

    return parsedPositions

  }

  async listRaw (
    params?: IAlunaPositionListParams,
  ): Promise<IBitfinexPositionSchema[]> {

    let url = 'https://api.bitfinex.com/v2/auth/r/positions'

    const body: Record<string, any> = {}

    if (params) {

      const {
        end,
        start,
        openPositionsOnly,
        limit,
      } = params

      if (!openPositionsOnly) {

        body.start = start
        body.end = end
        body.status = limit

        url = 'https://api.bitfinex.com/v2/auth/r/positions/hist'

      }

    }

    const { privateRequest } = BitfinexHttp

    const rawPositions = await privateRequest<IBitfinexPositionSchema[]>({
      url,
      body,
      keySecret: this.exchange.keySecret,
    })

    return rawPositions

  }

  async get (params: IAlunaPositionGetParams): Promise<IAlunaPositionSchema> {

    const rawPosition = await this.getRaw(params)

    const parsedPosition = this.parse({ rawPosition })

    return parsedPosition

  }

  async getRaw (
    params: IAlunaPositionGetParams,
  ): Promise<IBitfinexPositionSchema> {

    const { id } = params

    const { privateRequest } = BitfinexHttp

    const rawPosition = await privateRequest<IBitfinexPositionSchema>({
      url: 'https://api.bitfinex.com/v2/auth/r/positions/audit',
      body: { id: [id], limit: 1 },
      keySecret: this.exchange.keySecret,
    })

    return rawPosition

  }

  close (params: IAlunaPositionCloseParams): Promise<IAlunaPositionSchema> {

    throw new Error('Method not implemented.')

  }

  parse (params: {
    rawPosition: IBitfinexPositionSchema,
  }): IAlunaPositionSchema {

    const { rawPosition } = params

    const parsedPosition = BitfinexPositionParser.parse({
      rawPosition,
    })

    return parsedPosition

  }

  parseMany (params: {
    rawPositions: IBitfinexPositionSchema[],
  }): IAlunaPositionSchema[] {

    const { rawPositions } = params

    const parsedPositions = rawPositions.reduce((acc, rawPosition) => {

      // skipping derivative positions for now
      if (rawPosition[14] === 1) {

        return acc

      }

      const parsedPosition = this.parse({ rawPosition })

      acc.push(parsedPosition)

      return acc

    }, [] as IAlunaPositionSchema[])

    return parsedPositions

  }

}
