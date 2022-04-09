import { LayoutSetAppBaseUrlAction } from "types/context/layout";
import layoutTypes from "./layout.types";

export const setAppBaseUrl: (
  appBaseUrl: string
) => LayoutSetAppBaseUrlAction = (appBaseUrl: string) => ({
  type: layoutTypes.SET_APP_BASE_URL,
  payload: appBaseUrl,
});
