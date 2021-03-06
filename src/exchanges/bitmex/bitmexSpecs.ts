import { cloneDeep } from 'lodash'

import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import { AlunaWalletEnum } from '../../lib/enums/AlunaWalletEnum'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'



export const BITMEX_PRODUCTION_URL = 'https://www.bitmex.com/api/v1'
export const BITMEX_TESTNET_URL = 'https://testnet.bitmex.com/api/v1'



export const bitmexExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
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
    implemented: true,
  },
  {
    type: AlunaOrderTypesEnum.STOP_MARKET,
    supported: true,
    implemented: true,
  },
]



export const bitmexBaseSpecs: IAlunaExchangeSchema = {
  id: 'bitmex',
  name: 'Bitmex',
  signupUrl: 'https://www.bitmex.com/register',
  connectApiUrl: 'https://www.bitmex.com/app/apiKeys',
  rateLimitingPerMinute: {
    perApiKey: 120,
    perIp: 5,
  },
  features: {
    offersOrderEditing: true,
    offersPositionId: true,
  },
  accounts: [
    {
      type: AlunaAccountEnum.DERIVATIVES,
      supported: true,
      implemented: true,
      orderTypes: bitmexExchangeOrderTypes,
      wallet: AlunaWalletEnum.DEFAULT,
    },
    {
      type: AlunaAccountEnum.SPOT,
      supported: true,
      implemented: false,
      orderTypes: [],
      wallet: AlunaWalletEnum.DEFAULT,
    },
  ],
  settings: {},
}



export const buildBitmexSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(bitmexBaseSpecs)

  if (referralCode) {
    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`
  }

  specs.settings = settings

  return specs

}


export const getBitmexEndpoints = (
  settings: IAlunaSettingsSchema,
) => {

  let baseUrl = BITMEX_PRODUCTION_URL

  if (settings.useTestNet) {
    baseUrl = BITMEX_TESTNET_URL
  }

  return {
    symbol: {
      list: `${baseUrl}/instrument/active`,
    },
    market: {
      get: (symbolPair: string) => `${baseUrl}/instrument?symbol=${symbolPair}`,
      list: `${baseUrl}/instrument/active`,
    },
    key: {
      fetchDetails: `${baseUrl}/apiKey`,
    },
    balance: {
      assets: `${baseUrl}/user/margin`,
      assetsDetails: `${baseUrl}/wallet/assets`,
    },
    order: {
      get: `${baseUrl}/order`,
      list: `${baseUrl}/order`,
      place: `${baseUrl}/order`,
      cancel: `${baseUrl}/order`,
      edit: `${baseUrl}/order`,
    },
    position: {
      list: `${baseUrl}/position`,
      get: `${baseUrl}/position`,
      close: `${baseUrl}/order`,
      getLeverage: `${baseUrl}/<desired-method>`,
      setLeverage: `${baseUrl}/position/leverage`,
    },
  }
}
