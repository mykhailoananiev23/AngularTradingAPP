import { createReducer, on } from "@ngrx/store";
import { UpdateFeedStatus } from "./feed.action";

var initialize = {
    status: false
}

export const feedActions = createReducer(
    initialize,
    on(UpdateFeedStatus, (state, {status}) => ({...state,status: status}))
)