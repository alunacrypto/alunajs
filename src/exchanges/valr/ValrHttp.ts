import axios from 'axios'
import crypto from 'crypto'
import { URL } from 'url'

import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { ValrError } from './ValrError'



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  path: string
  keySecret: IAlunaKeySecretSchema
  body?: any
}

interface IValrSignedHeaders {
  'X-VALR-API-KEY': string
  'X-VALR-SIGNATURE': string
  'X-VALR-TIMESTAMP': number
}



export const formatRequestError = (params: { error: any }): ValrError => {

  const {
    response,
  } = params.error

  if (response && response.data && response.data.message) {

    return new ValrError({
      message: response.data.message,
      statusCode: response.status,
    })

  }

  return new ValrError({
    message: params.error.message,
    statusCode: params.error.response?.status || 400,
  })

}



export const generateAuthHeader = (
  params: ISignedHashParams,
):IValrSignedHeaders => {

  const {
    keySecret, path, verb, body,
  } = params

  const timestamp = Date.now()

  const signedRequest = crypto
    .createHmac('sha512', keySecret.secret)
    .update(timestamp.toString())
    .update(verb.toUpperCase())
    .update(`${path}`)
    .update(body ? JSON.stringify(body) : '')
    .digest('hex')

  return {
    'X-VALR-API-KEY': keySecret.key,
    'X-VALR-SIGNATURE': signedRequest,
    'X-VALR-TIMESTAMP': timestamp,
  }

}



export const ValrHttp: IAlunaHttp = class {

  static async publicRequest<T> (params: IAlunaHttpPublicParams): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.GET,
    } = params

    const requestConfig = {
      url,
      method: verb,
      data: body,
    }

    try {

      const response = await axios.create().request<T>(requestConfig)

      return response.data

    } catch (error) {

      throw formatRequestError({ error })

    }

  }



  static async privateRequest<T> (params: IAlunaHttpPrivateParams): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.POST,
      keySecret,
    } = params

    const signedHash = generateAuthHeader({
      verb,
      path: new URL(url).pathname,
      keySecret,
      body,
    })

    const requestConfig = {
      url,
      method: verb,
      data: body,
      headers: signedHash,
    }

    try {

      const response = await axios.create().request<T>(requestConfig)

      return response.data

    } catch (error) {

      throw formatRequestError({ error })

    }

  }

}
