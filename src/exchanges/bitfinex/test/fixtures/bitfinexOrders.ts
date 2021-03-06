import { BitfinexOrderTypeEnum } from '../../enums/BitfinexOrderTypeEnum'
import {
  IBitfinexOrderSchema,
  TBitfinexEditCancelOrderResponse,
  TBitfinexPlaceOrderResponse,
} from '../../schemas/IBitfinexOrderSchema'



export const BITFINEX_RAW_ORDERS: IBitfinexOrderSchema[] = [
  [
    85420510379,
    null,
    50011918463,
    'tETHBTC',
    1643378012000,
    1643378012000,
    0,
    0.0008,
    'MARKET' as BitfinexOrderTypeEnum,
    null,
    null,
    null,
    '512',
    'EXECUTED @ 0.065691(0.0008): was ACTIVE (note:POSCLOSE)',
    null,
    null,
    0,
    0.065691,
    0,
    0,
    null,
    null,
    null,
    0,
    0,
    null,
    null,
    null,
    '',
    null,
    null,
    null,
  ],
  [
    85420029501,
    null,
    1643377697480,
    'tLUNA:USD',
    1643377697000,
    1643377698000,
    0,
    -0.0008,
    'EXCHANGE STOP' as BitfinexOrderTypeEnum,
    null,
    null,
    null,
    '0',
    'EXECUTED @ 0.065859(-0.0008)',
    null,
    null,
    0.065852,
    0.065859,
    0,
    0,
    null,
    null,
    null,
    0,
    0,
    null,
    null,
    null,
    'API>BFX',
    null,
    null,
    {},
  ],
  [
    85415343559,
    null,
    1643374365010,
    'F0ETHBTC',
    1643374365000,
    1643374365000,
    0,
    -0.0008,
    'EXCHANGE MARKET' as BitfinexOrderTypeEnum,
    null,
    null,
    null,
    '0',
    'EXECUTED @ 0.06544(-0.0008)',
    null,
    null,
    0.065447,
    0.06544,
    0,
    0,
    null,
    null,
    null,
    0,
    0,
    null,
    null,
    null,
    'API>BFX',
    null,
    null,
    {},
  ],
]



export const BITFINEX_PLACE_ORDER_RESPONSE: TBitfinexPlaceOrderResponse = [
  1568298355648,
  'on-req',
  null,
  null,
  [
    [
      85415343559,
      null,
      1643374365010,
      'tETHBTC',
      1643374365000,
      1643374365000,
      0,
      -0.0008,
      'EXCHANGE MARKET' as BitfinexOrderTypeEnum,
      null,
      null,
      null,
      '0',
      'EXECUTED @ 0.06544(-0.0008)',
      null,
      null,
      0.065447,
      0.06544,
      0,
      0,
      null,
      null,
      null,
      0,
      0,
      null,
      null,
      null,
      'API>BFX',
      null,
      null,
      {},
    ],
  ],
  100,
  'SUCCESS',
  'Submitted for cancellation; waiting for confirmation (ID: 30937950333).',
]



export const BITFINEX_CANCEL_ORDER_RESPONSE: TBitfinexEditCancelOrderResponse = [
  1568298355648,
  'on-req',
  null,
  null,
  [
    85415343559,
    null,
    1643374365010,
    'tETHBTC',
    1643374365000,
    1643374365000,
    0,
    -0.0008,
    'EXCHANGE MARKET' as BitfinexOrderTypeEnum,
    null,
    null,
    null,
    '0',
    'EXECUTED @ 0.06544(-0.0008)',
    null,
    null,
    0.065447,
    0.06544,
    0,
    0,
    null,
    null,
    null,
    0,
    0,
    null,
    null,
    null,
    'API>BFX',
    null,
    null,
    {},
  ],
  100,
  'SUCCESS',
  'Submitted for cancellation; waiting for confirmation (ID: 30937950333).',
]
