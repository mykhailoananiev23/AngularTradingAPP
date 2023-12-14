import { createAction, props } from "@ngrx/store";

export const UpdateFeedStatus = createAction(
    '[Feed] Updated feed status',
    props<{status: number}>()
)