import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { testList } from '../../../../../../test/macros/testList'
import { VALR_RAW_LIST_RESPONSE_ORDERS } from '../../../test/fixtures/valrOrders'
import { ValrAuthed } from '../../../ValrAuthed'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: ValrAuthed,
    exchangeId: 'valr',
    methodModuleName: 'order',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawOrders: VALR_RAW_LIST_RESPONSE_ORDERS },
    parsedList: { orders: PARSED_ORDERS },
  })

})
