import React from "react";
import NextLink from "next/link";
import { FC } from "react";

interface ICustomLinkProps {
  link: string;
}

const CustomLink: FC<ICustomLinkProps> = ({ link, children }) => {
  return (
    <NextLink href={link} passHref>
      <a>{children}</a>
    </NextLink>
  );
};

export default CustomLink;
