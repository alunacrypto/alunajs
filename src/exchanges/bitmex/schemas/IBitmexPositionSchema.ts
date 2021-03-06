import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'



export interface IBitmexPositionsSchema {
  bitmexPositions: IBitmexPosition[]
  markets: IAlunaMarketSchema[]
}



export interface IBitmexPositionSchema {
  bitmexPosition: IBitmexPosition
  market: IAlunaMarketSchema
}



export interface IBitmexPosition {
  account: number
  symbol: string
  currency: string
  underlying: string
  quoteCurrency: string
  commission: number
  initMarginReq: number
  maintMarginReq: number
  riskLimit: number
  leverage: number
  crossMargin: boolean
  deleveragePercentile: number
  rebalancedPnl: number
  prevRealisedPnl: number
  prevUnrealisedPnl: number
  prevClosePrice: number
  openingTimestamp: string
  openingQty: number
  openingCost: number
  openingComm: number
  openOrderBuyQty: number
  openOrderBuyCost: number
  openOrderBuyPremium: number
  openOrderSellQty: number
  openOrderSellCost: number
  openOrderSellPremium: number
  execBuyQty: number
  execBuyCost: number
  execSellQty: number
  execSellCost: number
  execQty: number
  execCost: number
  execComm: number
  currentTimestamp: string
  currentQty: number
  currentCost: number
  currentComm: number
  realisedCost: number
  unrealisedCost: number
  grossOpenCost: number
  grossOpenPremium: number
  grossExecCost: number
  isOpen: boolean
  markPrice: number
  markValue: number
  riskValue: number
  homeNotional: number
  foreignNotional: number
  posState: string
  posCost: number
  posCost2: number
  posCross: number
  posInit: number
  posComm: number
  posLoss: number
  posMargin: number
  posMaint: number
  posAllowance: number
  taxableMargin: number
  initMargin: number
  maintMargin: number
  sessionMargin: number
  targetExcessMargin: number
  varMargin: number
  realisedGrossPnl: number
  realisedTax: number
  realisedPnl: number
  unrealisedGrossPnl: number
  longBankrupt: number
  shortBankrupt: number
  taxBase: number
  indicativeTaxRate: null
  indicativeTax: number
  unrealisedTax: number
  unrealisedPnl: number
  unrealisedPnlPcnt: number
  unrealisedRoePcnt: number
  simpleQty: null
  simpleCost: null
  simpleValue: null
  simplePnl: null
  simplePnlPcnt: null
  avgCostPrice: number
  avgEntryPrice: number
  breakEvenPrice: number
  marginCallPrice: number
  liquidationPrice: number
  bankruptPrice: number
  timestamp: string
  lastPrice: number
  lastValue: number
}
