import { FtxOrderStatusEnum } from '../enums/FtxOrderStatusEnum'
import { FtxOrderTypeEnum } from '../enums/FtxOrderTypeEnum'
import { FtxSideEnum } from '../enums/FtxSideEnum'



export interface IFtxOrderSchema {
  createdAt: string
  filledSize: number
  future: string
  id: number
  market: string
  price: number | null
  avgFillPrice: number | null
  remainingSize: number
  side: FtxSideEnum
  size: number
  status: FtxOrderStatusEnum
  type: FtxOrderTypeEnum
  reduceOnly: boolean
  ioc: boolean
  postOnly: boolean
  clientId: number
}

export interface IFtxOrderRequest {
  market: string
  side: FtxSideEnum
  type: FtxOrderTypeEnum
  size: number
  price: number | null
}
