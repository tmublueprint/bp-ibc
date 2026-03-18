import type { RootState } from "../../store/store"

export const selectSaveStatus = (state: RootState) => state.siteStatus.saveStatus
export const selectPublishedStatus = (state: RootState) => state.siteStatus.publishedStatus