import {
    ActionReducerMap,
    MetaReducer,
    ActionReducer,
    Action
  } from '@ngrx/store';
  import * as fromAuth from './auth/auth.reducer';
  import * as fromMarket from './market/market.reducer'
  import * as fromFeed from './feed/feed.reducer'
  
import { AuthState } from './auth/auth.state';
import { MarketState } from './market/market.state';
import { FeedState } from './feed/feed.state';
  
  export interface AppState {
    auth: AuthState;
    market: MarketState;
    feed: FeedState
  }
  
  export const reducers: ActionReducerMap<AppState> = {
    auth: fromAuth.loginReducer,
    market: fromMarket.marketReducer,
    feed: fromFeed.feedReducer
  };
  
  export function clearState(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
    return function(state: AppState | undefined, action: Action): AppState {
      if (action.type === '[Auth] LOGOUT completed') {
        state = undefined;
      }
      return reducer(state, action);
    };
  }
  
  
  export const metaReducers: MetaReducer<AppState>[] = [clearState];
  