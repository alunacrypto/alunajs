import { IAlunaHttp } from '../../../lib/core/IAlunaHttp'
import { IAlunaCredentialsSchema } from '../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../../lib/schemas/IAlunaSettingsSchema'
import { PoloniexOrderSideEnum } from '../enums/PoloniexOrderSideEnum'
import { PoloniexOrderStatusEnum } from '../enums/PoloniexOrderStatusEnum'



export interface IPoloniexOrderInfo {
  orderNumber: string
  type: PoloniexOrderSideEnum
  rate: string
  startingAmount: string
  amount: string
  total: string
  date: string
  margin: number
  clientOrderId: string
}

export interface IPoloniexOrderSchema extends IPoloniexOrderInfo {
  currencyPair: string
  baseCurrency: string
  quoteCurrency: string
}

export interface IPoloniexOrderResponseSchema {
  [key: string]: IPoloniexOrderInfo[]
}

export interface IPoloniexOrderPlaceResponseSchema {
  orderNumber: string
  resultingTrades: IPoloniexOrderInfo[]
  fee: string
  clientOrderId: string
  currencyPair: string
  error?: string
}

export interface IPoloniexOrderStatusInfoSchema extends IPoloniexOrderInfo {
  status: PoloniexOrderStatusEnum
  currencyPair: string
}

export interface IPoloniexFetchOrderDetailsParams {
  id: string
  http: IAlunaHttp
  credentials: IAlunaCredentialsSchema
  settings: IAlunaSettingsSchema
}

export interface IPoloniexOrderErrorResultSchema {
  result: { error: string }
}

export interface IPoloniexOrderStatusSchema {
  result: {
    [key: string]: IPoloniexOrderStatusInfoSchema
  }
}

export type TGetOrderStatusResponse =
  IPoloniexOrderStatusSchema | IPoloniexOrderErrorResultSchema

export type TGetOrderTradesResponse =
  IPoloniexOrderInfo[] | { error: string }
