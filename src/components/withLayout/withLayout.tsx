import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import LayoutContainer from "components/LayoutContainer/LayoutContainer";
import Navbar from "components/Navbar/Navbar";
import React, { Component, ComponentType } from "react";
import { UserDocument } from "types/IUser";

interface IWithLayoutProps {
  error?: string;
  user?: UserDocument;
}

const withLayout = <P extends object>(
  WrappedComponent: ComponentType<P & IWithLayoutProps>
) => {
  return class WithLayout extends Component<P & IWithLayoutProps> {
    render(): React.ReactNode {
      const { error, ...otherProps } = this.props;
      return (
        <LayoutContainer
          isLoggedIn={!!this.props.user}
          isAdmin={this.props.user && this.props.user.role === "admin"}
        >
          {error ? (
            <ErrorMessage message={error} />
          ) : (
            <WrappedComponent {...(otherProps as P)} />
          )}
        </LayoutContainer>
      );
    }
  };
};

export default withLayout;
