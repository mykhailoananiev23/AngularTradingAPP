import { createReducer, on } from '@ngrx/store';
import { UpdateChartInfo, UpdateMarketData, UpdateStockInfo, UpdateWatchlist, UpdateWlList } from './market.action';import { MarketState } from './market.state';

const initialize: MarketState = {
    data: '',
    wlInstrument: '',
    watchlist: '',
    stockInfo: '',
    chartInfo: ''
}

export const marketReducer = createReducer(
    initialize,
    on(UpdateMarketData, (state, {data}) => {
        return {
            ...state,
            data: data
        }
    }),
    on(UpdateWatchlist, (state, {watchlist}) => {
        return {
            ...state,
            watchlist: watchlist
        }
    }),
    on(UpdateStockInfo, (state, {stockInfo}) => {
        return {
            ...state,
            stockInfo: stockInfo
        }
    }),
    on(UpdateChartInfo, (state, {chartData}) => {
        return {
            ...state,
            chartInfo: chartData
        }
    }),
    on(UpdateWlList, (state, {wlInstruments}) => {
        return {
            ...state,
            wlInstrument: wlInstruments
        }
    }),
)