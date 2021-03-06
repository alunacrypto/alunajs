import { cloneDeep } from 'lodash'

import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import { AlunaWalletEnum } from '../../lib/enums/AlunaWalletEnum'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'



export const BINANCE_PRODUCTION_URL = 'https://api.binance.com'
export const BINANCE_TESTNET_URL = 'https://testnet.binance.vision'



export const binanceExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
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
    type: AlunaOrderTypesEnum.STOP_MARKET,
    supported: true,
    implemented: false,
  },
  {
    type: AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT,
    supported: true,
    implemented: false,
  },
  {
    type: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
    supported: true,
    implemented: false,
  },
]



export const binanceBaseSpecs: IAlunaExchangeSchema = {
  id: 'binance',
  name: 'Binance',
  signupUrl: 'https://accounts.binance.com/en/register',
  connectApiUrl: 'https://www.binance.com/en/my/settings/api-management',
  rateLimitingPerMinute: {
    perApiKey: 300,
    perIp: 300,
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
      orderTypes: binanceExchangeOrderTypes,
      wallet: AlunaWalletEnum.SPOT,
    },
    {
      type: AlunaAccountEnum.MARGIN,
      supported: true,
      implemented: false,
      orderTypes: [],
      wallet: AlunaWalletEnum.MARGIN,
    },
    {
      type: AlunaAccountEnum.DERIVATIVES,
      supported: true,
      implemented: false,
      orderTypes: [],
      wallet: AlunaWalletEnum.DERIVATIVES,
    },
  ],
  settings: {},
}



export const buildBinanceSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(binanceBaseSpecs)

  if (referralCode) {
    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`
  }

  specs.settings = settings

  return specs

}


export const getBinanceEndpoints = (
  settings: IAlunaSettingsSchema,
) => {

  let baseUrl = BINANCE_PRODUCTION_URL

  if (settings.useTestNet) {
    baseUrl = BINANCE_TESTNET_URL
    /*
      throw new AlunaError({
        code: ExchangeErrorCodes.EXCHANGE_DONT_PROVIDE_TESTNET,
        message: 'Binance don't have a testnet.',
      })
    */
  }

  return {
    symbol: {
      list: `${baseUrl}/api/v3/exchangeInfo`,
    },
    market: {
      list: `${baseUrl}/api/v3/ticker/24hr`,
    },
    key: {
      fetchDetails: `${baseUrl}/api/v3/account`,
    },
    balance: {
      list: `${baseUrl}/api/v3/account`,
    },
    order: {
      get: `${baseUrl}/api/v3/order`,
      list: `${baseUrl}/api/v3/openOrders`,
      place: `${baseUrl}/api/v3/order`,
      cancel: `${baseUrl}/api/v3/order`,
    },
  }
}
