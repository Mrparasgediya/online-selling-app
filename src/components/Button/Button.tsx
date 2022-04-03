import React, { FC } from "react";

interface IButtonProps {
  color: "primary" | "green";
}

const Button: FC<IButtonProps> = ({ color, children, ...otherProps }) => {
  let btnClasses =
    "border-2 md:px-2 px-1 py-1 rounded-md font-medium backdrop-filter backdrop-blur-md ";
  const primaryClasses = "border-blue-600 bg-blue-600/60 text-blue-900";
  const greenClasses = "border-green-700 bg-green-500/60 text-green-700";

  switch (color) {
    case "green":
      btnClasses += greenClasses;
      break;
    case "primary":
    default:
      btnClasses += primaryClasses;
      break;
  }

  return (
    <button {...otherProps} className={btnClasses}>
      {children}
    </button>
  );
};

export default Button;
