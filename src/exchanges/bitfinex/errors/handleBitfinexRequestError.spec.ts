import { AxiosError } from 'axios'
import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import * as handleBitfinexMod from './handleBitfinexRequestError'



describe(__filename, () => {

  const {
    isBitfinexKeyInvalid,
    handleBitfinexRequestError,
  } = handleBitfinexMod

  const requestMessage = 'Error while executing request.'

  const mockDeps = (
    params: {
      isInvalid: boolean
    } = {
      isInvalid: false,
    },
  ) => {

    const {
      isInvalid,
    } = params

    const isBitfinexKeyInvalidMock = ImportMock.mockFunction(
      handleBitfinexMod,
      'isBitfinexKeyInvalid',
      isInvalid,
    )

    return {
      isBitfinexKeyInvalidMock,
    }

  }

  it('should return Bitfinex key invalid error when applicable', async () => {

    const { isBitfinexKeyInvalidMock } = mockDeps({ isInvalid: true })

    const dummyError = 'Key is invalid'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          exchangeErroMsg: dummyError,
        },
      },
    } as AxiosError

    const alunaError = handleBitfinexRequestError({ error: axiosError1 })

    expect(isBitfinexKeyInvalidMock.callCount).to.be.eq(1)

    expect(alunaError).to.deep.eq({
      code: AlunaKeyErrorCodes.INVALID,
      message: dummyError,
      httpStatusCode: axiosError1.response?.status,
      metadata: axiosError1.response?.data,
    })

    expect(isBitfinexKeyInvalidMock.callCount).to.be.eq(1)
    expect(isBitfinexKeyInvalidMock.args[0][0]).to.be.eq(dummyError)

  })

  it('should ensure Bitfinex request error is being handle', async () => {

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          exchangeErroMsg: dummyError,
        },
      },
    } as AxiosError

    let alunaError = handleBitfinexRequestError({ error: axiosError1 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: dummyError,
      httpStatusCode: axiosError1.response?.status,
      metadata: axiosError1.response?.data,
    })


    const axiosError2 = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
        },
      },
    } as AxiosError

    alunaError = handleBitfinexRequestError({ error: axiosError2 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: axiosError2.response?.status,
      metadata: axiosError2.response?.data,
    })


    const axiosError3 = {
      isAxiosError: true,
    } as AxiosError

    alunaError = handleBitfinexRequestError({ error: axiosError3 })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: axiosError3,
    })

    const error = {
      message: dummyError,
    } as Error

    alunaError = handleBitfinexRequestError({ error })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: error.message,
      httpStatusCode: 500,
      metadata: error,
    })


    const unknown = {} as any

    alunaError = handleBitfinexRequestError({ error: unknown })

    expect(alunaError).to.deep.eq({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: requestMessage,
      httpStatusCode: 500,
      metadata: unknown,
    })

  })

  it(
    'should ensure Bitfinex invalid api patterns work as expected',
    async () => {

      const message = 'api-invalid'
      expect(isBitfinexKeyInvalid(message)).to.be.ok

    },
  )

})