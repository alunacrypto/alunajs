import {
  IAlunaSymbolListParams,
  IAlunaSymbolListReturns,
} from '../../../../../lib/modules/IAlunaSymbolModule'



export async function list (
  params: IAlunaSymbolListParams,
): Promise<IAlunaSymbolListReturns> {

  return params as any

}