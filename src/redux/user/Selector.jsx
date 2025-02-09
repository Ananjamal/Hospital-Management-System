import { createSelector } from "reselect";
const selectState = (state) => state;

export const selectDoctors = createSelector(selectState, (state) => state && state.doctors);
export const selectUsers = createSelector(selectState, (state) => state && state.users);
export const selectAttachments = createSelector(selectState, (state) => state && state.attachments);

export const selectUserInfo = createSelector(
    () => localStorage.getItem('userInfo'),
    (userInfo) => userInfo ? JSON.parse(userInfo) : null
  );
  