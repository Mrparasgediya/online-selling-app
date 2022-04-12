import Footer from "components/Footer/Footer";
import Navbar from "components/Navbar/Navbar";
import React, { FC, useEffect } from "react";
import { isatty } from "tty";

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
    <div className="min-h-screen relative h-screen w-full">
      <Navbar isAdmin={isAdmin} isLoggedIn={isLoggedIn} />
      <div className="mx-auto min-h-[95vh] max-w-screen-lg p-4 md:pt-24 pt-20">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default LayoutContainer;
