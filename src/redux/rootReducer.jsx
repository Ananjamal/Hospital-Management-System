import { combineReducers } from "redux";

import Reducer from "./user/Reducer";

const rootReducer = combineReducers({
  user: Reducer,
});

export default rootReducer;
