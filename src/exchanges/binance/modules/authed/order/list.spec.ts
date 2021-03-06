import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { testList } from '../../../../../../test/macros/testList'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { BINANCE_RAW_ORDERS } from '../../../test/fixtures/binanceOrders'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BinanceAuthed,
    exchangeId: 'binance',
    methodModuleName: 'order',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawOrders: BINANCE_RAW_ORDERS },
    parsedList: { orders: PARSED_ORDERS },
  })

})
