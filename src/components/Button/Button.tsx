import React, { FC } from "react";

interface IButtonProps {
  color: "blue" | "green" | "red";
  [keys: string]: any;
}

const Button: FC<IButtonProps> = ({ color, children, ...otherProps }) => {
  let btnClasses =
    "border-2 md:px-2 px-1 py-1 rounded-md font-medium backdrop-filter backdrop-blur-md ";
  const primaryClasses = "border-blue-700 bg-blue-600/50 text-blue-900";
  const greenClasses = "border-green-700 bg-green-500/50 text-green-700";
  const redClasses = "border-red-700 bg-red-500/50 text-red-700";

  switch (color) {
    case "green":
      btnClasses += greenClasses;
      break;
    case "red":
      btnClasses += redClasses;
      break;
    case "blue":
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
