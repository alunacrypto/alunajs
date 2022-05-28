import axios from 'axios'
import crypto from 'crypto'
import { AlunaError } from '../../lib/core/AlunaError'

import {
  IAlunaHttp,
  IAlunaHttpAuthedParams,
  IAlunaHttpPublicParams,
  IAlunaHttpRequestCount,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaKeyErrorCodes } from '../../lib/errors/AlunaKeyErrorCodes'
import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { assembleRequestConfig } from '../../utils/axios/assembleRequestConfig'
import { AlunaCache } from '../../utils/cache/AlunaCache'
import { handleOkxRequestError, IOkxErrorSchema } from './errors/handleOkxRequestError'



export const OKX_HTTP_CACHE_KEY_PREFIX = 'OkxHttp.publicRequest'

export class OkxHttp implements IAlunaHttp {

  public settings: IAlunaSettingsSchema
  public requestWeight: IAlunaHttpRequestCount



  constructor(settings: IAlunaSettingsSchema) {

    this.requestWeight = {
      authed: 0,
      public: 0,
    }

    this.settings = settings

  }



  public async publicRequest <T>(
    params: IAlunaHttpPublicParams,
  ): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.GET,
      weight = 1,
    } = params

    const settings = (params.settings || this.settings)

    const {
      disableCache = false,
      cacheTtlInSeconds = 60,
    } = settings

    const cacheKey = AlunaCache.hashCacheKey({
      args: params,
      prefix: OKX_HTTP_CACHE_KEY_PREFIX,
    })

    if (!disableCache && AlunaCache.cache.has(cacheKey)) {
      return AlunaCache.cache.get<T>(cacheKey) as T
    }

    const { proxySettings } = settings

    const { requestConfig } = assembleRequestConfig({
      url,
      method: verb,
      data: body,
      proxySettings,
    })

    this.requestWeight.public += weight

    try {

      const { data } = await axios
        .create()
        .request<IOkxHttpResponse<T>>(requestConfig)

      const { data: response } = data

      if (!disableCache) {
        AlunaCache.cache.set<T>(cacheKey, response, cacheTtlInSeconds)
      }

      return response

    } catch (error) {

      throw handleOkxRequestError({ error })

    }

  }



  public async authedRequest <T>(
    params: IAlunaHttpAuthedParams,
  ): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.POST,
      credentials,
      weight = 1,
    } = params

    const settings = (params.settings || this.settings)

    const signedHash = generateAuthHeader({
      verb,
      credentials,
      body,
      url,
    })

    const { proxySettings } = settings

    const { requestConfig } = assembleRequestConfig({
      url,
      method: verb,
      data: body,
      headers: signedHash,
      proxySettings,
    })

    this.requestWeight.authed += weight

    try {

      type TOkxResponse = T | IOkxErrorSchema | IOkxErrorSchema[]

      const { data } = await axios
        .create()
        .request<IOkxHttpResponse<TOkxResponse>>(requestConfig)

      const { data: response } = data

      if (typeof response === 'object') {

        if ('sCode' in response) {

          throw response

        }

        if ('sCode' in response[0]) {

          throw response[0]

        }

      }


      return response as T

    } catch (error) {

      throw handleOkxRequestError({ error })

    }

  }

}



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  credentials: IAlunaCredentialsSchema
  url: string
  body?: any
}

export interface IOkxSignedHeaders {
  'OK-ACCESS-KEY': string
  'OK-ACCESS-SIGN': string
  'OK-ACCESS-TIMESTAMP': string
  'OK-ACCESS-PASSPHRASE': string
  'Content-Type': string
}

interface IOkxHttpResponse<T> {
  code: string
  msg: string
  data: T
}



export const generateAuthHeader = (
  params: ISignedHashParams,
): IOkxSignedHeaders => {

  const {
    credentials,
    verb,
    body,
    url,
  } = params

  const {
    key,
    secret,
    passphrase,
  } = credentials

  if (!passphrase) {

    throw new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: '\'passphrase\' is required for private requests',
      httpStatusCode: 401,
    })

  }

  const methodUrl = new URL(url)

  const { pathname, search } = methodUrl

  const timestamp = new Date().toISOString()

  const pathWithQuery = search
    ? `${pathname}${search}`
    : pathname

  const includeBody = body ? JSON.stringify(body) : ''

  const meta = [
    timestamp,
    verb.toUpperCase(),
    pathWithQuery,
    includeBody,
  ].join('')

  const signedRequest = crypto
    .createHmac('sha256', secret)
    .update(meta)
    .digest('base64')

  return {
    'OK-ACCESS-KEY': key,
    'OK-ACCESS-PASSPHRASE': passphrase,
    'OK-ACCESS-SIGN': signedRequest,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'Content-Type': 'application/json',
  }

}