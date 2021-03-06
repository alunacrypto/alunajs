import { expect } from 'chai'

import { IAlunaSettingsSchema } from '../../../../../lib/schemas/IAlunaSettingsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Sample } from '../../../Sample'
import { sampleBaseSpecs } from '../../../sampleSpecs'
import { SAMPLE_RAW_SYMBOLS } from '../../../test/fixtures/sampleSymbols'



describe(__filename, () => {

  it('should parse a Sample symbol just fine (w/ alias)', async () => {

    // preparing data
    const rawSymbol = SAMPLE_RAW_SYMBOLS[0] // first fixture

    const translatedSymbolId = 'XBT'


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const settings: IAlunaSettingsSchema = {
      symbolMappings: {},
    }
    const exchange = new Sample({ settings })

    const { symbol } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(symbol.exchangeId).to.be.eq(sampleBaseSpecs.id)
    expect(symbol.id).to.be.eq(translatedSymbolId)
    expect(symbol.name).to.be.eq(rawSymbol.name)
    expect(symbol.alias).to.be.eq(rawSymbol.symbol) // should be equal
    expect(symbol.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.symbol,
      symbolMappings: settings.symbolMappings,
    })

  })



  it('should parse a Sample symbol just fine (w/o alias)', async () => {

    // preparing data
    const rawSymbol = SAMPLE_RAW_SYMBOLS[1] // second fixture


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(rawSymbol.symbol)


    // executing
    const exchange = new Sample({})

    const { symbol } = exchange.symbol.parse({ rawSymbol })


    // validating
    expect(symbol.exchangeId).to.be.eq(sampleBaseSpecs.id)
    expect(symbol.id).to.be.eq(rawSymbol.symbol)
    expect(symbol.name).to.be.eq(rawSymbol.name)
    expect(symbol.alias).to.be.eq(undefined) // different = undefined
    expect(symbol.meta).to.be.eq(rawSymbol)

    expect(translateSymbolId.callCount).to.be.eq(1)

    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: rawSymbol.symbol,
      symbolMappings: undefined,
    })

  })

})
