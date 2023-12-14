import { createSelector } from '@ngrx/store';
import { MarketState } from './market.state';
import { AppState } from '../index.reducer';

const selectMarket = (state: any) => state.market;

export const getMarketData = createSelector(
    selectMarket,
    (state) => state.data
);

export const getStockInfo = createSelector(
    selectMarket,
    (state) => state.stockInfo
)

export const getCharData = createSelector(
    selectMarket,
    (state) => state.chartInfo
)