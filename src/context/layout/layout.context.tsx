import { createContext, useReducer } from "react";
import {
  ILayoutContextActions,
  ILayoutContextReducerState,
  ILayoutContextState,
} from "types/context/layout";
import { setAppBaseUrl as setAppBaseUrlAction } from "./layout.actions";
import layoutReducer from "./layout.reducer";

const defaultLayoutReducerState: ILayoutContextReducerState = {
  appBaseUrl: "",
};

const defaultLayoutActions: ILayoutContextActions = {
  setAppBaseUrl: (appBaseUrl: string) => {},
};
const LayoutContext = createContext<ILayoutContextState>({
  state: defaultLayoutReducerState,
  actions: defaultLayoutActions,
});

export const LayoutContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    layoutReducer,
    defaultLayoutReducerState
  );

  return (
    <LayoutContext.Provider
      value={{
        state,
        actions: {
          setAppBaseUrl: (appBaseUrl) =>
            dispatch(setAppBaseUrlAction(appBaseUrl)),
        },
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
