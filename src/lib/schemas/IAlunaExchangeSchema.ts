import { AlunaAccountEnum } from '../enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../enums/AlunaOrderTypesEnum'
import { AlunaWalletEnum } from '../enums/AlunaWalletEnum'
import { IAlunaSettingsSchema } from './IAlunaSettingsSchema'



export interface IAlunaExchangeSchema {
  id: string
  name: string
  signupUrl: string
  connectApiUrl: string
  rateLimitingPerMinute: {
    perApiKey: number
    perIp: number
  }
  features: {
    offersPositionId?: boolean
    offersOrderEditing?: boolean
  }
  accounts: IAlunaExchangeAccountSpecsSchema[]
  settings: IAlunaSettingsSchema
}

export interface IAlunaExchangeAccountSpecsSchema {
  type: AlunaAccountEnum
  supported: boolean // supported by the exchange
  implemented?: boolean // implemented by aluna
  wallet: AlunaWalletEnum
  orderTypes: IAlunaExchangeOrderSpecsSchema[] // TODO: check prop requirement
}

export interface IAlunaExchangeOrderSpecsSchema {
  type: AlunaOrderTypesEnum
  supported: true // supported by the exchange
  implemented: boolean // implemented by aluna
}

export interface IAlunaExchangeOrderOptionsSchema {

  rate?: number
  amount?: number
  limitRate?: number
  leverage?: number

  /*
    Options not yet implemented:

    trailingRate?: number
    triggerRate?: number
    distance?: number
    trigger?: string | TriggerEnum | TriggerEnum[]
    closeOnTrigger?: boolean
    oco?: number
    hidden?: boolean
    postOnly?: boolean
    reduceOnly?: boolean
    tif?: boolean | string | TimeInForceEnum | TimeInForceEnum[]
    understandConfirmation?: boolean

  */

}
