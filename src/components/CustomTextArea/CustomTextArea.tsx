import React, { forwardRef, Fragment } from "react";

interface ITextAreaProps {
  required: boolean;
  label: string;
  id: string;
  [key: string]: any;
}

const CustomTextArea = forwardRef<HTMLTextAreaElement, ITextAreaProps>(
  ({ required, label, id, children, ...otherProps }, ref) => {
    return (
      <Fragment>
        <label htmlFor={id}>{label}</label>
        <textarea
          id={id}
          ref={ref}
          required={required}
          {...otherProps}
          className="px-3 py-2 rounded-md text-md focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          {children}
        </textarea>
      </Fragment>
    );
  }
);

CustomTextArea.displayName = "CustomTextArea";
export default CustomTextArea;
