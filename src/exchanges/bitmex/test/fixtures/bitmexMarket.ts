import { BitmexInstrumentStateEnum } from '../../enums/BitmexInstrumentStateEnum'
import { IBitmexMarketSchema } from '../../schemas/IBitmexMarketSchema'



export const BITMEX_RAW_MARKETS: IBitmexMarketSchema[] = [
  {
    symbol: 'XBTUSD',
    rootSymbol: 'XBT',
    state: 'Open' as BitmexInstrumentStateEnum,
    typ: 'FFWCSX',
    listing: '2016-05-13T12:00:00.000Z',
    front: '2016-05-13T12:00:00.000Z',
    expiry: null,
    settle: null,
    listedSettle: null,
    relistInterval: null,
    inverseLeg: '',
    sellLeg: '',
    buyLeg: '',
    optionStrikePcnt: null,
    optionStrikeRound: null,
    optionStrikePrice: null,
    optionMultiplier: null,
    positionCurrency: 'USD',
    underlying: 'XBT',
    quoteCurrency: 'USD',
    underlyingSymbol: 'XBT=',
    reference: 'BMEX',
    referenceSymbol: '.BXBT',
    calcInterval: null,
    publishInterval: null,
    publishTime: null,
    maxOrderQty: 10000000,
    maxPrice: 1000000,
    lotSize: 100,
    tickSize: 0.5,
    multiplier: -100000000,
    settlCurrency: 'XBt',
    underlyingToPositionMultiplier: null,
    underlyingToSettleMultiplier: -100000000,
    quoteToSettleMultiplier: 1,
    isQuanto: false,
    isInverse: true,
    initMargin: 0.01,
    maintMargin: 0.0035,
    riskLimit: 20000000000,
    riskStep: 15000000000,
    limit: null,
    capped: false,
    taxed: true,
    deleverage: true,
    makerFee: -0.0001,
    takerFee: 0.0005,
    settlementFee: 0,
    insuranceFee: 0,
    fundingBaseSymbol: '.XBTBON8H',
    fundingQuoteSymbol: '.USDBON8H',
    fundingPremiumSymbol: '.XBTUSDPI8H',
    fundingTimestamp: '2022-02-18T20:00:00.000Z',
    fundingInterval: '2000-01-01T08:00:00.000Z',
    fundingRate: -0.000131,
    indicativeFundingRate: 0.0001,
    rebalanceTimestamp: null,
    rebalanceInterval: null,
    openingTimestamp: '2022-02-18T13:00:00.000Z',
    closingTimestamp: '2022-02-18T14:00:00.000Z',
    sessionInterval: '2000-01-01T01:00:00.000Z',
    prevClosePrice: 40200.59,
    limitDownPrice: null,
    limitUpPrice: null,
    bankruptLimitDownPrice: null,
    bankruptLimitUpPrice: null,
    prevTotalVolume: 3414952023489,
    totalVolume: 3414970143289,
    volume: 18119800,
    volume24h: 975004000,
    prevTotalTurnover: 36271097502508344,
    totalTurnover: 36271142413770240,
    turnover: 44911261895,
    turnover24h: 2370812574686,
    homeNotional24h: 23708.125746859918,
    foreignNotional24h: 975004000,
    prevPrice24h: 42607.5,
    vwap: 41125.3542,
    highPrice: 42607.5,
    lowPrice: 40066,
    lastPrice: 40376.5,
    lastPriceProtected: 40376.5,
    lastTickDirection: 'ZeroPlusTick',
    lastChangePcnt: -0.0524,
    bidPrice: 40376,
    midPrice: 40376.25,
    askPrice: 40376.5,
    impactBidPrice: 40376,
    impactMidPrice: 40376.25,
    impactAskPrice: 40376.6332,
    hasLiquidity: true,
    openInterest: 342379800,
    openValue: 847653637446,
    fairMethod: 'FundingRate',
    fairBasisRate: -0.14344500000000002,
    fairBasis: -4.19,
    fairPrice: 40391.49,
    markMethod: 'FairPrice',
    markPrice: 40391.49,
    indicativeTaxRate: 0,
    indicativeSettlePrice: 40395.68,
    optionUnderlyingPrice: null,
    settledPriceAdjustmentRate: null,
    settledPrice: null,
    timestamp: '2022-02-18T13:40:43.534Z',
  },
  {
    symbol: 'XBTEUR',
    rootSymbol: 'XBT',
    state: 'Open' as BitmexInstrumentStateEnum,
    typ: 'FFWCSX',
    listing: '2021-06-16T04:00:00.000Z',
    front: '2021-06-16T04:00:00.000Z',
    expiry: null,
    settle: null,
    listedSettle: null,
    relistInterval: null,
    inverseLeg: '',
    sellLeg: '',
    buyLeg: '',
    optionStrikePcnt: null,
    optionStrikeRound: null,
    optionStrikePrice: null,
    optionMultiplier: null,
    positionCurrency: 'EUR',
    underlying: 'XBT',
    quoteCurrency: 'EUR',
    underlyingSymbol: 'XBTEUR=',
    reference: 'BMEX',
    referenceSymbol: '.BXBTEUR',
    calcInterval: null,
    publishInterval: null,
    publishTime: null,
    maxOrderQty: 10000000,
    maxPrice: 1000000,
    lotSize: 100,
    tickSize: 0.5,
    multiplier: -100000000,
    settlCurrency: 'XBt',
    underlyingToPositionMultiplier: null,
    underlyingToSettleMultiplier: -100000000,
    quoteToSettleMultiplier: 1,
    isQuanto: false,
    isInverse: true,
    initMargin: 0.02,
    maintMargin: 0.01,
    riskLimit: 5000000000,
    riskStep: 5000000000,
    limit: null,
    capped: false,
    taxed: true,
    deleverage: true,
    makerFee: -0.0001,
    takerFee: 0.0005,
    settlementFee: 0,
    insuranceFee: 0,
    fundingBaseSymbol: '.XBTBON8H',
    fundingQuoteSymbol: '.EURBON8H',
    fundingPremiumSymbol: '.XBTEURPI8H',
    fundingTimestamp: '2022-02-18T20:00:00.000Z',
    fundingInterval: '2000-01-01T08:00:00.000Z',
    fundingRate: 0.000037,
    indicativeFundingRate: 0.0001,
    rebalanceTimestamp: null,
    rebalanceInterval: null,
    openingTimestamp: '2022-02-18T13:00:00.000Z',
    closingTimestamp: '2022-02-18T14:00:00.000Z',
    sessionInterval: '2000-01-01T01:00:00.000Z',
    prevClosePrice: 35401.83,
    limitDownPrice: null,
    limitUpPrice: null,
    bankruptLimitDownPrice: null,
    bankruptLimitUpPrice: null,
    prevTotalVolume: 1241908900,
    totalVolume: 1241958700,
    volume: 49800,
    volume24h: 1873200,
    prevTotalTurnover: 3219501533330,
    totalTurnover: 3219641583246,
    turnover: 140049916,
    turnover24h: 5185080640,
    homeNotional24h: 51.85080640000001,
    foreignNotional24h: 1873200,
    prevPrice24h: 37178.5,
    vwap: 36126.7761,
    highPrice: 37329,
    lowPrice: 35236,
    lastPrice: 35567.5,
    lastPriceProtected: 35567.5,
    lastTickDirection: 'ZeroMinusTick',
    lastChangePcnt: -0.0433,
    bidPrice: 35584.5,
    midPrice: 35593.75,
    askPrice: 35603,
    impactBidPrice: 35584.276,
    impactMidPrice: 35607.25,
    impactAskPrice: 35630.0461,
    hasLiquidity: true,
    openInterest: 1167700,
    openValue: 3276169182,
    fairMethod: 'FundingRate',
    fairBasisRate: 0.040514999999999995,
    fairBasis: 1,
    fairPrice: 35642.26,
    markMethod: 'FairPrice',
    markPrice: 35642.26,
    indicativeTaxRate: null,
    indicativeSettlePrice: 35641.26,
    optionUnderlyingPrice: null,
    settledPriceAdjustmentRate: null,
    settledPrice: null,
    timestamp: '2022-02-18T13:55:25.000Z',
  },
  {
    symbol: 'LTCUSDT',
    rootSymbol: 'LTC',
    state: 'Open' as BitmexInstrumentStateEnum,
    typ: 'FFWCSX',
    listing: '2021-11-10T04:00:00.000Z',
    front: '2021-11-10T04:00:00.000Z',
    expiry: null,
    settle: null,
    listedSettle: null,
    relistInterval: null,
    inverseLeg: '',
    sellLeg: '',
    buyLeg: '',
    optionStrikePcnt: null,
    optionStrikeRound: null,
    optionStrikePrice: null,
    optionMultiplier: null,
    positionCurrency: 'LTC',
    underlying: 'LTC',
    quoteCurrency: 'USDT',
    underlyingSymbol: 'LTCT=',
    reference: 'BMEX',
    referenceSymbol: '.BLTCT',
    calcInterval: null,
    publishInterval: null,
    publishTime: null,
    maxOrderQty: 1000000000,
    maxPrice: 1000000,
    lotSize: 1000,
    tickSize: 0.01,
    multiplier: 100,
    settlCurrency: 'USDt',
    underlyingToPositionMultiplier: 10000,
    underlyingToSettleMultiplier: null,
    quoteToSettleMultiplier: 1000000,
    isQuanto: false,
    isInverse: false,
    initMargin: 0.03,
    maintMargin: 0.015,
    riskLimit: 1000000000000,
    riskStep: 1000000000000,
    limit: null,
    capped: false,
    taxed: true,
    deleverage: true,
    makerFee: -0.0001,
    takerFee: 0.0005,
    settlementFee: 0,
    insuranceFee: 0,
    fundingBaseSymbol: '.LTCBON8H',
    fundingQuoteSymbol: '.USDTBON8H',
    fundingPremiumSymbol: '.LTCUSDTPI8H',
    fundingTimestamp: '2022-02-18T20:00:00.000Z',
    fundingInterval: '2000-01-01T08:00:00.000Z',
    fundingRate: 0.0001,
    indicativeFundingRate: 0.0001,
    rebalanceTimestamp: null,
    rebalanceInterval: null,
    openingTimestamp: '2022-02-18T13:00:00.000Z',
    closingTimestamp: '2022-02-18T14:00:00.000Z',
    sessionInterval: '2000-01-01T01:00:00.000Z',
    prevClosePrice: 118.644,
    limitDownPrice: null,
    limitUpPrice: null,
    bankruptLimitDownPrice: null,
    bankruptLimitUpPrice: null,
    prevTotalVolume: 18220636000,
    totalVolume: 18230624000,
    volume: 9988000,
    volume24h: 212227000,
    prevTotalTurnover: 300455038304000,
    totalTurnover: 300575202570000,
    turnover: 120164266000,
    turnover24h: 2525786894000,
    homeNotional24h: 21222.700000000008,
    foreignNotional24h: 2525786.894,
    prevPrice24h: 123.27,
    vwap: 119.01346,
    highPrice: 123.87,
    lowPrice: 115.21,
    lastPrice: 120,
    lastPriceProtected: 120,
    lastTickDirection: 'MinusTick',
    lastChangePcnt: -0.0265,
    bidPrice: 120.34,
    midPrice: 120.455,
    askPrice: 120.57,
    impactBidPrice: 120.34,
    impactMidPrice: 120.455,
    impactAskPrice: 120.57,
    hasLiquidity: true,
    openInterest: 33529000,
    openValue: 404047920300,
    fairMethod: 'FundingRate',
    fairBasisRate: 0.1095,
    fairBasis: 0.009,
    fairPrice: 120.507,
    markMethod: 'FairPrice',
    markPrice: 120.507,
    indicativeTaxRate: null,
    indicativeSettlePrice: 120.498,
    optionUnderlyingPrice: null,
    settledPriceAdjustmentRate: null,
    settledPrice: null,
    timestamp: '2022-02-18T13:56:00.000Z',
  },
  {
    symbol: 'UNI_USDT',
    rootSymbol: 'UNI',
    state: 'Open' as BitmexInstrumentStateEnum,
    typ: 'FFWCSX',
    listing: '2021-11-10T04:00:00.000Z',
    front: '2021-11-10T04:00:00.000Z',
    expiry: null,
    settle: null,
    listedSettle: null,
    relistInterval: null,
    inverseLeg: '',
    sellLeg: '',
    buyLeg: '',
    optionStrikePcnt: null,
    optionStrikeRound: null,
    optionStrikePrice: null,
    optionMultiplier: null,
    positionCurrency: 'LTC',
    underlying: 'LTC',
    quoteCurrency: 'USDT',
    underlyingSymbol: 'LTCT=',
    reference: 'BMEX',
    referenceSymbol: '.BLTCT',
    calcInterval: null,
    publishInterval: null,
    publishTime: null,
    maxOrderQty: 1000000000,
    maxPrice: 1000000,
    lotSize: 1000,
    tickSize: 0.01,
    multiplier: 100,
    settlCurrency: '',
    underlyingToPositionMultiplier: 10000,
    underlyingToSettleMultiplier: null,
    quoteToSettleMultiplier: 1000000,
    isQuanto: false,
    isInverse: false,
    initMargin: 0.03,
    maintMargin: 0.015,
    riskLimit: 1000000000000,
    riskStep: 1000000000000,
    limit: null,
    capped: false,
    taxed: true,
    deleverage: true,
    makerFee: -0.0001,
    takerFee: 0.0005,
    settlementFee: 0,
    insuranceFee: 0,
    fundingBaseSymbol: '.LTCBON8H',
    fundingQuoteSymbol: '.USDTBON8H',
    fundingPremiumSymbol: '.LTCUSDTPI8H',
    fundingTimestamp: '2022-02-18T20:00:00.000Z',
    fundingInterval: '2000-01-01T08:00:00.000Z',
    fundingRate: 0.0001,
    indicativeFundingRate: 0.0001,
    rebalanceTimestamp: null,
    rebalanceInterval: null,
    openingTimestamp: '2022-02-18T13:00:00.000Z',
    closingTimestamp: '2022-02-18T14:00:00.000Z',
    sessionInterval: '2000-01-01T01:00:00.000Z',
    prevClosePrice: 118.644,
    limitDownPrice: null,
    limitUpPrice: null,
    bankruptLimitDownPrice: null,
    bankruptLimitUpPrice: null,
    prevTotalVolume: 18220636000,
    totalVolume: 18230624000,
    volume: 9988000,
    volume24h: 212227000,
    prevTotalTurnover: 300455038304000,
    totalTurnover: 300575202570000,
    turnover: 120164266000,
    turnover24h: 2525786894000,
    homeNotional24h: 21222.700000000008,
    foreignNotional24h: 2525786.894,
    prevPrice24h: 123.27,
    vwap: 119.01346,
    highPrice: 123.87,
    lowPrice: 115.21,
    lastPrice: 120,
    lastPriceProtected: 120,
    lastTickDirection: 'MinusTick',
    lastChangePcnt: -0.0265,
    bidPrice: 120.34,
    midPrice: 120.455,
    askPrice: 120.57,
    impactBidPrice: 120.34,
    impactMidPrice: 120.455,
    impactAskPrice: 120.57,
    hasLiquidity: true,
    openInterest: 33529000,
    openValue: 404047920300,
    fairMethod: 'FundingRate',
    fairBasisRate: 0.1095,
    fairBasis: 0.009,
    fairPrice: 120.507,
    markMethod: 'FairPrice',
    markPrice: 120.507,
    indicativeTaxRate: null,
    indicativeSettlePrice: 120.498,
    optionUnderlyingPrice: null,
    settledPriceAdjustmentRate: null,
    settledPrice: null,
    timestamp: '2022-02-18T13:56:00.000Z',
  },
  {
    symbol: 'LINK_USDT',
    rootSymbol: 'LINK',
    state: 'Unlisted' as BitmexInstrumentStateEnum,
    typ: 'FFWCSX',
    listing: '2021-11-10T04:00:00.000Z',
    front: '2021-11-10T04:00:00.000Z',
    expiry: null,
    settle: null,
    listedSettle: null,
    relistInterval: null,
    inverseLeg: '',
    sellLeg: '',
    buyLeg: '',
    optionStrikePcnt: null,
    optionStrikeRound: null,
    optionStrikePrice: null,
    optionMultiplier: null,
    positionCurrency: 'LTC',
    underlying: 'LTC',
    quoteCurrency: 'USDT',
    underlyingSymbol: 'LINK=',
    reference: 'BMEX',
    referenceSymbol: '.LINK',
    calcInterval: null,
    publishInterval: null,
    publishTime: null,
    maxOrderQty: 1000000000,
    maxPrice: 1000000,
    lotSize: 1000,
    tickSize: 0.01,
    multiplier: 100,
    settlCurrency: '',
    underlyingToPositionMultiplier: 10000,
    underlyingToSettleMultiplier: null,
    quoteToSettleMultiplier: 1000000,
    isQuanto: false,
    isInverse: false,
    initMargin: 0.03,
    maintMargin: 0.015,
    riskLimit: 1000000000000,
    riskStep: 1000000000000,
    limit: null,
    capped: false,
    taxed: true,
    deleverage: true,
    makerFee: -0.0001,
    takerFee: 0.0005,
    settlementFee: 0,
    insuranceFee: 0,
    fundingBaseSymbol: '.LTCBON8H',
    fundingQuoteSymbol: '.USDTBON8H',
    fundingPremiumSymbol: '.LTCUSDTPI8H',
    fundingTimestamp: '2022-02-18T20:00:00.000Z',
    fundingInterval: '2000-01-01T08:00:00.000Z',
    fundingRate: 0.0001,
    indicativeFundingRate: 0.0001,
    rebalanceTimestamp: null,
    rebalanceInterval: null,
    openingTimestamp: '2022-02-18T13:00:00.000Z',
    closingTimestamp: '2022-02-18T14:00:00.000Z',
    sessionInterval: '2000-01-01T01:00:00.000Z',
    prevClosePrice: 118.644,
    limitDownPrice: null,
    limitUpPrice: null,
    bankruptLimitDownPrice: null,
    bankruptLimitUpPrice: null,
    prevTotalVolume: 18220636000,
    totalVolume: 18230624000,
    volume: 9988000,
    volume24h: 212227000,
    prevTotalTurnover: 300455038304000,
    totalTurnover: 300575202570000,
    turnover: 120164266000,
    turnover24h: 2525786894000,
    homeNotional24h: 21222.700000000008,
    foreignNotional24h: 2525786.894,
    prevPrice24h: 123.27,
    vwap: 119.01346,
    highPrice: 123.87,
    lowPrice: 115.21,
    lastPrice: 120,
    lastPriceProtected: 120,
    lastTickDirection: 'MinusTick',
    lastChangePcnt: -0.0265,
    bidPrice: 120.34,
    midPrice: 120.455,
    askPrice: 120.57,
    impactBidPrice: 120.34,
    impactMidPrice: 120.455,
    impactAskPrice: 120.57,
    hasLiquidity: true,
    openInterest: 33529000,
    openValue: 404047920300,
    fairMethod: 'FundingRate',
    fairBasisRate: 0.1095,
    fairBasis: 0.009,
    fairPrice: 120.507,
    markMethod: 'FairPrice',
    markPrice: 120.507,
    indicativeTaxRate: null,
    indicativeSettlePrice: 120.498,
    optionUnderlyingPrice: null,
    settledPriceAdjustmentRate: null,
    settledPrice: null,
    timestamp: '2022-02-18T13:56:00.000Z',
  },
]
