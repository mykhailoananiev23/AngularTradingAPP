import { createAction, props } from '@ngrx/store';

export const UpdateMarketData = createAction(
    '[Market] Update Data',
    props<{data: string}>()
)

export const UpdateWatchlist = createAction(
    '[Market] Update Watchlist',
    props<{watchlist: string}>()
)

export const UpdateStockInfo = createAction(
    '[Market] Update StockInfo',
    props<{stockInfo: string}>()
)

export const UpdateWlList = createAction(
    '[Market] Update Wl Instruments',
    props<{wlInstruments: string}>()
)

export const UpdateChartInfo = createAction(
    '[Market] Update Chart Data',
    props<{chartData: string}>()
)