import React, { FC, ReactElement } from "react";
import NextLink from "next/link";

interface IButtonLinkProps {
  children: ReactElement<HTMLButtonElement>;
  link: string;
}

const ButtonLink: FC<IButtonLinkProps> = ({
  children,
  link,
  ...otherProps
}) => {
  return (
    <NextLink href={link} {...otherProps}>
      <a>{children}</a>
    </NextLink>
  );
};

export default ButtonLink;
