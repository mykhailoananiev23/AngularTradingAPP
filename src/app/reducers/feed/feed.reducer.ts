import { createReducer, on } from "@ngrx/store";
import { UpdateFeedStatus } from "./feed.action";

var initialize = {
    status: 0
}

export const feedReducer = createReducer(
    initialize,
    on(UpdateFeedStatus, (state, {status}) => ({...state, status: status}))
)