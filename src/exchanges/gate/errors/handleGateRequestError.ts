import { AxiosError } from 'axios'
import { some } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'



export const gateInvalidKeyPatterns: Array<RegExp> = [
  /Invalid key provided/mi,
  /Signature mismatch/mi,
]



export const gateDownErrorPatterns: Array<RegExp | string> = [
  // Add gate exchange down errors
]


export const isGateKeyInvalid = (errorMessage: string) => {

  return some(gateInvalidKeyPatterns, (pattern) => {

    return pattern.test(errorMessage)

  })

}


export interface IHandleGateRequestErrorsParams {
  error: AxiosError | Error
}



export const handleGateRequestError = (
  params: IHandleGateRequestErrorsParams,
): AlunaError => {

  const { error } = params

  let metadata: any = error

  let code = AlunaHttpErrorCodes.REQUEST_ERROR
  let message = 'Error while executing request.'
  let httpStatusCode = 500

  if ((error as AxiosError).isAxiosError) {

    const { response } = error as AxiosError

    message = response?.data?.message || message

    httpStatusCode = response?.status || httpStatusCode

    metadata = response?.data || metadata

  } else {

    message = error.message || message

  }

  if (isGateKeyInvalid(message)) {

    code = AlunaKeyErrorCodes.INVALID
    httpStatusCode = 200

  }

  const alunaError = new AlunaError({
    metadata,
    message,
    httpStatusCode,
    code,
  })

  return alunaError

}
