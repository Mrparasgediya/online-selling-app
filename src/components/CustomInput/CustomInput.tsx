import React, { Fragment, Ref, useEffect, useState } from "react";
import { FC } from "react";
import { forwardRef } from "react";

interface IInputProps {
  type: "text" | "number" | "file" | "email" | "password";
  label: string;
  id: string;
  [key: string]: any;
}

const CustomInput: FC<IInputProps> = forwardRef<HTMLInputElement, IInputProps>(
  ({ type, string, id, label, ...otherProps }, ref) => {
    return (
      <Fragment>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          ref={ref}
          className="px-3 py-2 rounded-md text-md focus:outline-none focus:ring-4 focus:ring-blue-500"
          {...otherProps}
        />
      </Fragment>
    );
  }
);

CustomInput.displayName = "CustomInput";
export default CustomInput;
