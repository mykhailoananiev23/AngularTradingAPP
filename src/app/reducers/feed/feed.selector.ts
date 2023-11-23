import { createSelector } from "@ngrx/store";
import { FeedState } from "./feed.state";

export const filterFeed = (state: any) => state.feed;

export const getFeedStatus = createSelector(
    filterFeed,
    (feed: FeedState) => feed.status
)