export interface ILayoutContextReducerState {
  appBaseUrl: string;
}
export interface ILayoutContextActions {
  setAppBaseUrl: (appBaseUrl: string) => void;
}

export interface ILayoutContextState {
  state: ILayoutContextReducerState;
  actions: ILayoutContextActions;
}
export interface ILayoutTypes {
  SET_APP_BASE_URL: "SET_APP_BASE_URL";
}

export type LayoutSetAppBaseUrlAction = {
  type: keyof ILayoutTypes;
  payload: string;
};

export type LayoutReducerActions = LayoutSetAppBaseUrlAction;
