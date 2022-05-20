import { OkxOrderSideEnum } from '../../enums/OkxOrderSideEnum'
import { OkxOrderStatusEnum } from '../../enums/OkxOrderStatusEnum'
import { OkxOrderTypeEnum } from '../../enums/OkxOrderTypeEnum'
import { IOkxOrderSchema } from '../../schemas/IOkxOrderSchema'



// TODO: Review fixtures
export const OKX_RAW_ORDERS: IOkxOrderSchema[] = [
  {
    instType: 'SPOT',
    instId: 'BTC-USD',
    ccy: 'BTC',
    ordId: '312269865356374016',
    clOrdId: 'b1',
    tag: '',
    px: '999',
    sz: '3',
    pnl: '5',
    ordType: OkxOrderTypeEnum.LIMIT,
    side: OkxOrderSideEnum.BUY,
    posSide: 'long',
    tdMode: 'isolated',
    accFillSz: '0',
    fillPx: '0',
    tradeId: '0',
    fillSz: '0',
    fillTime: '0',
    state: OkxOrderStatusEnum.LIVE,
    avgPx: '0',
    lever: '20',
    tpTriggerPx: '',
    tpTriggerPxType: 'last',
    tpOrdPx: '',
    slTriggerPx: '',
    slTriggerPxType: 'last',
    slOrdPx: '',
    feeCcy: '',
    fee: '',
    rebateCcy: '',
    rebate: '',
    tgtCcy: 'USD',
    category: '',
    uTime: '1597026383085',
    cTime: '1597026383085',
  },
  {
    instType: 'SPOT',
    instId: 'BTC-USD',
    ccy: 'BTC',
    ordId: '312269865356374016',
    clOrdId: 'b1',
    tag: '',
    px: '999',
    sz: '3',
    pnl: '5',
    ordType: OkxOrderTypeEnum.MARKET,
    side: OkxOrderSideEnum.BUY,
    posSide: 'long',
    tdMode: 'isolated',
    accFillSz: '0',
    fillPx: '0',
    tradeId: '0',
    fillSz: '0',
    fillTime: '0',
    state: OkxOrderStatusEnum.LIVE,
    avgPx: '0',
    lever: '20',
    tpTriggerPx: '',
    tpTriggerPxType: 'last',
    tpOrdPx: '',
    slTriggerPx: '',
    slTriggerPxType: 'last',
    slOrdPx: '',
    feeCcy: '',
    fee: '',
    rebateCcy: '',
    rebate: '',
    tgtCcy: 'USD',
    category: '',
    uTime: '1597026383085',
    cTime: '1597026383085',
  },
]
