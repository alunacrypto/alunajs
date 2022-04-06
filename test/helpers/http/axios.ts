import axios from 'axios'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaHttp } from '../../../src/lib/core/IAlunaHttp'



export const mockPublicHttpRequest = (params: {
  exchangeHttp: IAlunaHttp,
  requestResponse?: any,
  isReject?: boolean,
}): { requestMock: Sinon.SinonStub } => {

  const {
    exchangeHttp,
    requestResponse = Promise.resolve(true),
    isReject = false,
  } = params

  const requestMock = ImportMock.mockFunction(
    exchangeHttp,
    'publicRequest',
    isReject
      ? requestResponse
      : Promise.resolve({
        data: requestResponse,
        requestCount: 1,
      }),
  )

  return { requestMock }

}



export const mockPrivateHttpRequest = (params: {
  exchangeHttp: IAlunaHttp,
  requestResponse?: any,
  isReject?: boolean,
}): { requestMock: Sinon.SinonStub } => {

  const {
    exchangeHttp,
    requestResponse = true,
    isReject = false,
  } = params

  const requestMock = ImportMock.mockFunction(
    exchangeHttp,
    'privateRequest',
    isReject
      ? requestResponse
      : Promise.resolve({
        data: requestResponse,
        requestCount: 1,
      }),
  )

  return { requestMock }

}



export const mockAxiosRequest = (
  params: {
    responseData?: any,
    error?: any,
  } = { responseData: {} },
) => {

  const {
    error,
    responseData,
  } = params

  let response: any

  if (error) {

    response = async () => Promise.reject(error)

  } else {

    response = async () => Promise.resolve({ data: responseData })

  }

  const requestSpy = Sinon.spy(response)

  const axiosCreateMock = ImportMock.mockFunction(
    axios,
    'create',
    {
      request: requestSpy,
    },
  )

  return {
    requestSpy,
    axiosCreateMock,
  }

}