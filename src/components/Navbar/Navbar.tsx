import NextLink from "next/link";
import Button from "components/Button/Button";
import CustomLink from "components/NextImageLink/NextImageLink";
import { FC, Fragment, MouseEventHandler, useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { getToken, removeToken } from "utils/cookie";
import { AxiosResponse } from "axios";
import API from "config/axios";
import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import { getErrorMessage } from "utils/error";

interface INavbarProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

const Navbar: FC<INavbarProps> = ({ isAdmin, isLoggedIn }) => {
  const [noOfCustomers, setNoOfCustomers] = useState<number>(0);
  const [errorText, setErrorText] = useState<string>("");
  const router: NextRouter = useRouter();
  const fetchCustomersCount = async () => {
    try {
      if (errorText) setErrorText("");
      const { data }: AxiosResponse = await API.get("/api/users/customers", {
        headers: {
          Authorization: `Barear ${getToken()}`,
        },
      });
      setNoOfCustomers(data.customersCount);
    } catch (error) {
      setErrorText(getErrorMessage(error));
    }
  };
  const handleDeleteCustomers = async () => {
    try {
      if (errorText) setErrorText("");
      if (noOfCustomers) {
        await API.delete("/api/users/customers", {
          headers: {
            Authorization: `Barear ${getToken()}`,
          },
        });
        fetchCustomersCount();
      }
    } catch (error) {
      setErrorText(getErrorMessage(error));
    }
  };
  useEffect(() => {
    if (router.pathname === "/admin/products") {
      fetchCustomersCount();
    }
  }, [fetchCustomersCount]);

  const logoutUser: MouseEventHandler<HTMLButtonElement> = async () => {
    if (getToken()) {
      removeToken();
    }
    router.push("/");
  };
  return (
    <Fragment>
      <nav className="px-8 py-4 h-auto w-full shadow-lg bg-white/70 backdrop-filter backdrop-blur-md ">
        <div className="w-full max-w-screen-lg mx-auto flex items-center justify-between">
          <NextLink href="/" passHref>
            <a className="font-medium text-lg ">Arth Creation</a>
          </NextLink>
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <Fragment>
                {isAdmin && (
                  <Fragment>
                    {router.pathname === "/admin/products" && (
                      <div className="flex items-center gap-4">
                        <p className="font-medium">
                          No Of Customers:{" "}
                          <span className="font-bold text-red-500">
                            {noOfCustomers}
                          </span>
                        </p>
                        <Button onClick={handleDeleteCustomers} color="blue">
                          Delete Customers
                        </Button>
                      </div>
                    )}
                    <CustomLink link="/admin/products">
                      <Button color="blue">Admin Panel</Button>
                    </CustomLink>
                  </Fragment>
                )}
                <Button color="blue" onClick={logoutUser}>
                  Logout
                </Button>
              </Fragment>
            )}
          </div>
        </div>
      </nav>
      {errorText && <ErrorMessage message={errorText} />}
    </Fragment>
  );
};

export default Navbar;
