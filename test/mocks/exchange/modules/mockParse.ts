import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mockParse = (params: {
  module: any
}) => {

  const { module } = params

  const parse = stub()

  const wrapper = ImportMock.mockFunction(
    module,
    'parse',
    parse,
  )

  return {
    parse,
    wrapper,
  }

}
