import { Web3 } from '../Web3'
import {
  IWeb3TokenListReturns,
  list,
} from './token/list'
import {
  IWeb3TokenListRawParams,
  IWeb3TokenListRawReturns,
  listRaw,
} from './token/listRaw'



export interface IWeb3TokenModule {

  /* eslint-disable max-len */

  listRaw(params?: IWeb3TokenListRawParams): Promise<IWeb3TokenListRawReturns>
  list(params?: IWeb3TokenListRawParams): Promise<IWeb3TokenListReturns>

  /* eslint-enable max-len */

}



export function token(web3: Web3): IWeb3TokenModule {

  return {
    list: list(web3),
    listRaw: listRaw(web3),
  }

}