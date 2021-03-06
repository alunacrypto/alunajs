import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseParams,
  IAlunaSymbolParseReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IValrSymbolSchema } from '../../../schemas/IValrSymbolSchema'
import { valrBaseSpecs } from '../../../valrSpecs'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseParams<IValrSymbolSchema>,
): IAlunaSymbolParseReturns => {

  const { rawSymbol } = params

  const {
    longName,
    symbol,
  } = rawSymbol

  const id = translateSymbolId({
    exchangeSymbolId: symbol,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const alias = (id !== symbol ? symbol : undefined)

  const parsedSymbol: IAlunaSymbolSchema = {
    id,
    name: longName,
    alias,
    exchangeId: valrBaseSpecs.id,
    meta: rawSymbol,
  }

  return { symbol: parsedSymbol }

}
