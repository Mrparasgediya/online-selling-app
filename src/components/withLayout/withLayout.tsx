import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import LayoutContainer from "components/LayoutContainer/LayoutContainer";
import LayoutContext from "context/layout/layout.context";
import { useRouter } from "next/router";
import React, {
  ComponentType,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserDocument } from "types/IUser";
import { getToken } from "utils/cookie";
import { getUserFromToken } from "utils/utils";

interface IWithLayoutProps {
  error?: string;
  user?: UserDocument;
  base_url: string;
}

const withLayout = <P extends object>(
  WrappedComponent: ComponentType<P & IWithLayoutProps>
): FC<P & IWithLayoutProps> => {
  const MyComponent: FC<P & IWithLayoutProps> = ({
    error,
    base_url,
    ...otherProps
  }: P & IWithLayoutProps) => {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<UserDocument>(
      otherProps.user
    );
    const {
      actions: { setAppBaseUrl },
    } = useContext(LayoutContext);

    useEffect(() => {
      if (
        router.pathname === "/products/[productId]" ||
        router.pathname === "/"
      ) {
        const fetchCurrentUser = async () => {
          const authToken = getToken();
          if (authToken) {
            try {
              setCurrentUser(await getUserFromToken(authToken));
            } catch (error) {
              // here no error will be processed because auth user is not recommended
            }
          }
        };
        fetchCurrentUser();
      }
    }, []);
    useEffect(() => {
      if (base_url) setAppBaseUrl(base_url);
    }, [base_url]);

    return (
      <LayoutContainer
        isLoggedIn={!!currentUser}
        isAdmin={currentUser && currentUser.role === "admin"}
      >
        {error ? (
          <ErrorMessage message={error} />
        ) : (
          <WrappedComponent {...(otherProps as P & IWithLayoutProps)} />
        )}
      </LayoutContainer>
    );
  };
  MyComponent.displayName = "LayoutContainer";
  return MyComponent;
};

export default withLayout;
