import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IValrBalanceSchema } from '../../../schemas/IValrBalanceSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IValrBalanceSchema>,
): IAlunaBalanceParseReturns => {


  const { rawBalance } = params

  const {
    available,
    currency,
    total,
  } = rawBalance

  const symbolId = translateSymbolId({
    exchangeSymbolId: currency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const balance: IAlunaBalanceSchema = {
    symbolId,
    available: Number(available),
    total: Number(total),
    meta: rawBalance,
    wallet: AlunaWalletEnum.SPOT,
  }

  return { balance }

}
