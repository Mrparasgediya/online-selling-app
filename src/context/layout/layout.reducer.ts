import layoutTypes from "./layout.types";
import {
  ILayoutContextReducerState,
  LayoutReducerActions,
} from "types/context/layout";

const layoutReducer = (
  state: ILayoutContextReducerState,
  action: LayoutReducerActions
): ILayoutContextReducerState => {
  switch (action.type) {
    case layoutTypes.SET_APP_BASE_URL:
      return {
        ...state,
        appBaseUrl: action.payload,
      };
    default:
      return state;
  }
};

export default layoutReducer;
