import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import LayoutContainer from "components/LayoutContainer/LayoutContainer";
import LayoutContext from "context/layout/layout.context";
import React, { ComponentType, FC, useContext, useEffect } from "react";
import { UserDocument } from "types/IUser";

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
    const {
      actions: { setAppBaseUrl },
    } = useContext(LayoutContext);
    useEffect(() => {
      if (base_url) setAppBaseUrl(base_url);
    }, [base_url]);
    return (
      <LayoutContainer
        isLoggedIn={!!otherProps.user}
        isAdmin={otherProps.user && otherProps.user.role === "admin"}
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
