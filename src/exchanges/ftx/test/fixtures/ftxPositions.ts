import { FtxOrderSideEnum } from '../../enums/FtxOrderSideEnum'
import { IFtxPositionSchema } from '../../schemas/IFtxPositionSchema'



export const FTX_RAW_POSITIONS: IFtxPositionSchema[] = [
  {
    future: 'BTC-PERP',
    size: 0.0001,
    side: FtxOrderSideEnum.BUY,
    netSize: 0.0001,
    longOrderSize: 0,
    shortOrderSize: 0,
    cost: 3.1707,
    entryPrice: 31707,
    unrealizedPnl: 0,
    realizedPnl: -0.03597493,
    initialMarginRequirement: 1,
    maintenanceMarginRequirement: 0.03,
    openSize: 0.0001,
    collateralUsed: 3.1707,
    estimatedLiquidationPrice: 0,
  },
  {
    future: 'BTC-MOVE-WK-0610',
    size: 0.0001,
    side: FtxOrderSideEnum.BUY,
    netSize: 0.0001,
    longOrderSize: 0,
    shortOrderSize: 0,
    cost: 0.2343,
    entryPrice: 2343,
    unrealizedPnl: 0,
    realizedPnl: 0,
    initialMarginRequirement: 0.07470010447217101,
    maintenanceMarginRequirement: 0.03,
    openSize: 0.0001,
    collateralUsed: 0.23651634822234174,
    estimatedLiquidationPrice: null,
  },
  {
    future: 'ETH-0930',
    size: 0.001,
    side: FtxOrderSideEnum.BUY,
    netSize: 0.001,
    longOrderSize: 0,
    shortOrderSize: 0,
    cost: 1.9742,
    entryPrice: 1974.2,
    unrealizedPnl: 0,
    realizedPnl: 0,
    initialMarginRequirement: 1,
    maintenanceMarginRequirement: 0.03,
    openSize: 0.001,
    collateralUsed: 1.9742,
    estimatedLiquidationPrice: 0,
  },
]
