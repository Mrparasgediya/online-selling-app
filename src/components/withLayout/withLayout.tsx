import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import Navbar from "components/Navbar/Navbar";
import React, { Component, ComponentType, FC } from "react";

const withLayout = <P extends object>(
  WrappedComponent: ComponentType<P & { error?: string }>
) => {
  return class WithLayout extends Component<P & { error?: string }> {
    render(): React.ReactNode {
      const { error, ...otherProps } = this.props;
      return (
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-screen w-screen">
          <Navbar />
          <div className="mx-auto max-w-screen-lg p-4">
            {error && <ErrorMessage message={error} />}
            <WrappedComponent {...(otherProps as P)} />
          </div>
        </div>
      );
    }
  };
};

export default withLayout;
