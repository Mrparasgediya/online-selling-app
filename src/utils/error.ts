import { AxiosError } from "axios";
import { NextApiResponse } from "next";

export const getErrorMessage = (error: any) => {
  if ((error as AxiosError).response) {
    const errorInstance: AxiosError = error;
    return errorInstance.response?.data?.error;
  } else {
    const errorInstance: Error = error;
    return errorInstance.message;
  }
};

export const setApiErrorMessage = (res: NextApiResponse, error: any) => {
  const errorMessage = !error.errors
    ? error.message
    : error.errors[Object.keys(error.errors)[0]].properties.message;

  res.status(error.code || 400).send({ error: errorMessage });
};
