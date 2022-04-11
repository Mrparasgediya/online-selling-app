import Navbar from "components/Navbar/Navbar";
import React, { FC } from "react";

interface ILayoutUserContainerProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

const LayoutContainer: FC<ILayoutUserContainerProps> = ({
  isAdmin,
  isLoggedIn,
  children,
}) => {
  return (
    <div className="min-h-screen relative w-full">
      <Navbar isAdmin={isAdmin} isLoggedIn={isLoggedIn} />
      <div className="mx-auto max-w-screen-lg p-4 pt-24">{children}</div>
    </div>
  );
};

export default LayoutContainer;
