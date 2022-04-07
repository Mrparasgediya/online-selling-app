import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import Navbar from "components/Navbar/Navbar";
import API from "config/axios";
import { NextRouter, useRouter } from "next/router";
import React, { FC, MouseEventHandler, useState } from "react";
import { getErrorMessage } from "utils/error";

interface ILayoutUserContainerProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

const LayoutContainer: FC<ILayoutUserContainerProps> = ({
  isAdmin,
  isLoggedIn,
  children,
}) => {
  const router: NextRouter = useRouter();
  const [errorText, setErrorText] = useState<string>("");
  const logoutUser: MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      await API.post("/api/users/logout");
      router.push("/");
    } catch (error) {
      setErrorText(getErrorMessage(error));
    }
  };
  return (
    <div className="min-h-screen  w-full">
      <Navbar
        isAdmin={isAdmin}
        isLoggedIn={isLoggedIn}
        handleLogoutUserClick={logoutUser}
      />
      <div className="mx-auto max-w-screen-lg p-4">
        {errorText && <ErrorMessage message={errorText} />}
        {children}
      </div>
    </div>
  );
};

export default LayoutContainer;
