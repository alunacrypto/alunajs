import { cloneDeep } from 'lodash'

import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import { AlunaWalletEnum } from '../../lib/enums/AlunaWalletEnum'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'



export const FTX_PRODUCTION_URL = 'https://ftx.com/api'



export const ftxExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
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



export const ftxBaseSpecs: IAlunaExchangeSchema = {
  id: 'ftx',
  name: 'Ftx',
  signupUrl: 'https://ftx.com/onboarding/signup',
  connectApiUrl: 'https://ftx.com/settings/api',
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
      orderTypes: ftxExchangeOrderTypes,
      wallet: AlunaWalletEnum.DEFAULT,
    },
    {
      type: AlunaAccountEnum.DERIVATIVES,
      supported: true,
      implemented: true,
      orderTypes: ftxExchangeOrderTypes,
      wallet: AlunaWalletEnum.DEFAULT,
    },
    {
      type: AlunaAccountEnum.LENDING,
      supported: true,
      implemented: false,
      orderTypes: [],
      wallet: AlunaWalletEnum.DEFAULT,
    },
  ],
  settings: {},
}



export const buildFtxSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(ftxBaseSpecs)

  if (referralCode) {
    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`
  }

  specs.settings = settings

  return specs

}


export const getFtxEndpoints = (
  _settings: IAlunaSettingsSchema,
) => {

  const baseUrl = FTX_PRODUCTION_URL

  return {
    symbol: {
      list: `${baseUrl}/markets`,
    },
    market: {
      list: `${baseUrl}/markets`,
    },
    key: {
      fetchDetails: `${baseUrl}/login_status`,
    },
    balance: {
      list: `${baseUrl}/wallet/balances`,
      account: `${baseUrl}/account`,
    },
    order: {
      get: (id: string) => `${baseUrl}/orders/${id}`,
      list: `${baseUrl}/orders`,
      listTriggerOrders: `${baseUrl}/conditional_orders`,
      listTriggerOrdersHistory: `${baseUrl}/conditional_orders/history`,
      place: `${baseUrl}/orders`,
      placeTriggerOrder: `${baseUrl}/conditional_orders`,
      cancel: (id: string) => `${baseUrl}/orders/${id}`,
      cancelTriggerOrder: (id: string) => `${baseUrl}/conditional_orders/${id}`,
      edit: (id: string) => `${baseUrl}/orders/${id}/modify`,
      editTrigger: (id: string) => `${baseUrl}/conditional_orders/${id}/modify`,
    },
    position: {
      list: `${baseUrl}/positions`,
      setLeverage: `${baseUrl}/account/leverage`,
    },
  }
}
