import NextLink from "next/link";
import Button from "components/Button/Button";
import CustomLink from "components/NextImageLink/NextImageLink";
import { FC, Fragment, MouseEventHandler } from "react";
import { NextRouter, useRouter } from "next/router";
import { getToken, removeToken } from "utils/cookie";

interface INavbarProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

const Navbar: FC<INavbarProps> = ({ isAdmin, isLoggedIn }) => {
  const router: NextRouter = useRouter();
  const logoutUser: MouseEventHandler<HTMLButtonElement> = async () => {
    if (getToken()) {
      removeToken();
    }
    router.push("/");
  };
  return (
    <nav className="px-8 py-4 h-auto w-full shadow-lg bg-white/70 backdrop-filter backdrop-blur-md ">
      <div className="w-full max-w-screen-lg mx-auto flex items-center justify-between">
        <NextLink href="/" passHref>
          <a className="font-medium text-lg ">Arth Creation</a>
        </NextLink>
        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <Fragment>
              {isAdmin && router.pathname === "/" && (
                <CustomLink link="/admin/products">
                  <Button color="blue">Admin Panel</Button>
                </CustomLink>
              )}
              <Button color="blue" onClick={logoutUser}>
                Logout
              </Button>
            </Fragment>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
