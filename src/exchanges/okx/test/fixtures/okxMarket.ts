import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { IOkxMarketWithCurrency } from '../../schemas/IOkxMarketSchema'



export const OKX_RAW_MARKETS: IOkxMarketWithCurrency[] = [
  {
    instType: 'SPOT',
    instId: 'BTC-USDT',
    last: '41731.5',
    lastSz: '0.01201826',
    askPx: '41731.6',
    askSz: '1.972391',
    bidPx: '41731.5',
    bidSz: '0.06468108',
    open24h: '41524.1',
    high24h: '42207.4',
    low24h: '41173.8',
    volCcy24h: '203402708.53788367',
    vol24h: '4886.88830413',
    ts: '1650464219049',
    sodUtc0: '41489.3',
    sodUtc8: '41447.1',
    baseCurrency: 'BTC',
    quoteCurrency: 'USDT',
  },
  {
    instType: 'SPOT',
    instId: 'ETH-USDT',
    last: '3109.74',
    lastSz: '0.004685',
    askPx: '3109.58',
    askSz: '1.780076',
    bidPx: '3109.57',
    bidSz: '0.645996',
    open24h: '3115.65',
    high24h: '3168.68',
    low24h: '3066.65',
    volCcy24h: '177823447.502698',
    vol24h: '57002.622196',
    ts: '1650464218941',
    sodUtc0: '3101.7',
    sodUtc8: '3110.2',
    baseCurrency: 'ETH',
    quoteCurrency: 'USDT',
  },
  {
    instType: 'SPOT',
    instId: 'DOGE-USDT',
    last: '0.142245',
    lastSz: '10000',
    askPx: '0.14226',
    askSz: '549.80489',
    bidPx: '0.142259',
    bidSz: '47656.463242',
    open24h: '0.1422',
    high24h: '0.1467',
    low24h: '0.140509',
    volCcy24h: '95103538.54248',
    vol24h: '662129472.622064',
    ts: '1650463466504',
    sodUtc0: '0.142577',
    sodUtc8: '0.142842',
    baseCurrency: 'DOGE',
    quoteCurrency: 'USDT',
  },
]

export const OKX_PARSED_MARKETS: IAlunaMarketSchema[] = [
  {
    exchangeId: 'okx',
    symbolPair: 'BTC-USDT',
    baseSymbolId: 'BTC',
    quoteSymbolId: 'USDT',
    ticker: {
      high: 42207.4,
      low: 41173.8,
      bid: 41731.5,
      ask: 41731.6,
      last: 41731.5,
      date: new Date('2022-04-20T14:19:40.795Z'),
      change: -207.40000000000146,
      baseVolume: 4886.88830413,
      quoteVolume: 203402708.53788367,
    },
    spotEnabled: true,
    marginEnabled: false,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: {},
  },
  {
    exchangeId: 'okx',
    symbolPair: 'ETH-USDT',
    baseSymbolId: 'ETH',
    quoteSymbolId: 'USDT',
    ticker: {
      high: 3168.68,
      low: 3066.65,
      bid: 3109.57,
      ask: 3109.58,
      last: 3109.74,
      date: new Date('2022-04-20T14:19:40.795Z'),
      change: 5.910000000000309,
      baseVolume: 57002.622196,
      quoteVolume: 177823447.502698,
    },
    spotEnabled: true,
    marginEnabled: false,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: {},
  },
  {
    exchangeId: 'okx',
    symbolPair: 'DOGE-USDT',
    baseSymbolId: 'DOGE',
    quoteSymbolId: 'USDT',
    ticker: {
      high: 0.1467,
      low: 0.140509,
      bid: 0.142259,
      ask: 0.14226,
      last: 0.142245,
      date: new Date('2022-04-20T14:19:40.795Z'),
      change: -0.00004500000000001725,
      baseVolume: 662129472.622064,
      quoteVolume: 95103538.54248,
    },
    spotEnabled: true,
    marginEnabled: false,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: {},
  },
]
