import { cloneDeep } from 'lodash'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import { AlunaWalletEnum } from '../../lib/enums/AlunaWalletEnum'
import { AlunaExchangeErrorCodes } from '../../lib/errors/AlunaExchangeErrorCodes'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'



export const BITTREX_PRODUCTION_URL = 'https://api.bittrex.com/v3'



export const bittrexExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
  {
    type: AlunaOrderTypesEnum.LIMIT,
    supported: true,
    implemented: true,
  },
  {
    type: AlunaOrderTypesEnum.MARKET,
    supported: true,
    implemented: true,
  },
  {
    type: AlunaOrderTypesEnum.STOP_LIMIT,
    supported: true,
    implemented: false,
  },
  {
    type: AlunaOrderTypesEnum.TRAILING_STOP,
    supported: true,
    implemented: false,
  },
]



export const bittrexBaseSpecs: IAlunaExchangeSchema = {
  id: 'bittrex',
  name: 'Bittrex',
  signupUrl: 'https://global.bittrex.com/account/register',
  connectApiUrl: 'https://global.bittrex.com/Manage?view=api',
  rateLimitingPerMinute: {
    perApiKey: 60,
    perIp: 60,
  },
  features: {
    offersOrderEditing: false,
    offersPositionId: false,
  },
  accounts: [
    {
      type: AlunaAccountEnum.SPOT,
      supported: true,
      implemented: true,
      orderTypes: bittrexExchangeOrderTypes,
      wallet: AlunaWalletEnum.SPOT,
    },
  ],
  settings: {},
}



export const buildBittrexSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(bittrexBaseSpecs)

  if (referralCode) {

    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`

  }

  specs.settings = settings

  return specs

}



export const getBittrexEndpoints = (settings: IAlunaSettingsSchema) => {

  const baseUrl = BITTREX_PRODUCTION_URL

  if (settings.useTestNet) {
    throw new AlunaError({
      code: AlunaExchangeErrorCodes.EXCHANGE_DONT_HAVE_TESTNET,
      message: 'Bittrex don\'t have a testnet.',
    })
  }

  return {
    symbol: {
      list: `${baseUrl}/currencies`,
    },
    market: {
      markets: `${baseUrl}/markets`,
      summaries: `${baseUrl}/markets/summaries`,
      tickers: `${baseUrl}/markets/tickers`,
    },
    key: {
      account: `${baseUrl}/account`,
    },
    balance: {
      list: `${baseUrl}/balances`,
    },
    order: {
      get: (id: string) => `${baseUrl}/orders/${id}`,
      list: `${baseUrl}/orders/open`,
      place: `${baseUrl}/orders`,
      cancel: (id: string) => `${baseUrl}/orders/${id}`,
    },
  }
}
