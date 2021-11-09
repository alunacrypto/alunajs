import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import {
  IGateIOMarketSchema,
  IGateIOTickerSchema,
} from '../../../schemas/IGateIOMarketSchema'



export const GATEIO_RAW_TICKERS: IGateIOTickerSchema[] = [
  {
    currency_pair: 'IHT_ETH',
    last: '1',
    lowest_ask: '1',
    highest_bid: '1',
    change_percentage: '1',
    base_volume: '1',
    quote_volume: '1',
    high_24h: '1',
    low_24h: '1',
    etf_net_value: '1',
    etf_pre_net_value: '1',
    etf_pre_timestamp: 1,
    etf_leverage: '1',
  },
  {
    currency_pair: 'AME_ETH',
    last: '1',
    lowest_ask: '1',
    highest_bid: '1',
    change_percentage: '1',
    base_volume: '1',
    quote_volume: '1',
    high_24h: '1',
    low_24h: '1',
    etf_net_value: '1',
    etf_pre_net_value: '1',
    etf_pre_timestamp: 1,
    etf_leverage: '1',
  },
  {
    currency_pair: 'ALEPH_USDT',
    last: '1',
    lowest_ask: '1',
    highest_bid: '1',
    change_percentage: '1',
    base_volume: '1',
    quote_volume: '1',
    high_24h: '1',
    low_24h: '1',
    etf_net_value: '1',
    etf_pre_net_value: '1',
    etf_pre_timestamp: 1,
    etf_leverage: '1',
  },
]

export const GATEIO_RAW_MARKETS: IGateIOMarketSchema[] = [
  {
    id: 'IHT_ETH',
    base: 'IHT',
    quote: 'ETH',
    fee: '0.2',
    min_quote_amount: '0.001',
    min_base_amount: '0.001',
    amount_precision: 1,
    precision: 9,
    trade_status: 'tradable',
    sell_start: 0,
    buy_start: 0,
    ticker: GATEIO_RAW_TICKERS[0],
  },
  {
    id: 'AME_ETH',
    base: 'AME',
    quote: 'ETH',
    fee: '0.2',
    min_quote_amount: '0.001',
    min_base_amount: '0.001',
    amount_precision: 3,
    precision: 8,
    trade_status: 'tradable',
    sell_start: 0,
    buy_start: 0,
    ticker: GATEIO_RAW_TICKERS[1],
  },
  {
    id: 'ALEPH_USDT',
    base: 'ALEPH',
    quote: 'USDT',
    fee: '0.2',
    min_quote_amount: '1',
    min_base_amount: '0.001',
    amount_precision: 3,
    precision: 4,
    trade_status: 'tradable',
    sell_start: 0,
    buy_start: 0,
    ticker: GATEIO_RAW_TICKERS[2],
  },
]


export const GATEIO_PARSED_MARKETS: IAlunaMarketSchema[] = [
  {
    pairSymbol: 'IHTETH',
    baseSymbolId: 'IHT',
    quoteSymbolId: 'ETH',
    ticker: {
      high: 0.00043926,
      low: 0.00038734,
      bid: 0.00039291,
      ask: 0.00039334,
      last: 0.00039266,
      date: new Date('2021-05-31T03:00:00.000Z'),
      change: -0.0616,
      baseVolume: 0,
      quoteVolume: 0,
    },
    spotEnabled: false,
    marginEnabled: false,
    derivativesEnabled: false,
  },
  {
    pairSymbol: 'AMEETH',
    baseSymbolId: 'AME',
    quoteSymbolId: 'ETH',
    ticker: {
      high: 533499,
      low: 490999,
      bid: 528027,
      ask: 528862,
      last: 528422,
      date: new Date('2021-05-31T03:00:00.000Z'),
      change: 0.0296,
      baseVolume: 262.38179134,
      quoteVolume: 0,
    },
    spotEnabled: false,
    marginEnabled: false,
    derivativesEnabled: false,
  },
  {
    pairSymbol: 'ALEPHUSDT',
    baseSymbolId: 'ALEPH',
    quoteSymbolId: 'USDT',
    ticker: {
      high: 36973,
      low: 32890,
      bid: 36306,
      ask: 36350,
      last: 36349,
      date: new Date('2021-05-31T03:00:00.000Z'),
      change: 0.0528,
      baseVolume: 675.16130937,
      quoteVolume: 0,
    },
    spotEnabled: false,
    marginEnabled: false,
    derivativesEnabled: false,
  },
]
