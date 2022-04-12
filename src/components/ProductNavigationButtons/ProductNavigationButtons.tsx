import React, { FC, useContext, useEffect } from "react";
import Button from "components/Button/Button";
import CustomLink from "components/NextImageLink/NextImageLink";
import LayoutContext from "context/layout/layout.context";
import WhatsAppIcon from "components/Icons/WhatsAppIcon";

interface IProductNavigationButtonsProps {
  name: string;
  id: string;
  showDetailsButton?: boolean;
}

const ProductNavigationButtons: FC<IProductNavigationButtonsProps> = ({
  id,
  name,
  showDetailsButton = false,
}) => {
  const {
    state: { appBaseUrl },
  } = useContext(LayoutContext);
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <CustomLink
        link={`https://wa.me/+918140329445?text=${encodeURI(
          `Hello, I am interested in your product ${name} (product id:  ${id}) link: ${appBaseUrl}/products/${id.toString()}`
        )}`}
      >
        <WhatsAppIcon />
      </CustomLink>
      {showDetailsButton && (
        <CustomLink link={`/products/${id}`}>
          <Button color="blue">Show Details</Button>
        </CustomLink>
      )}
    </div>
  );
};

export default ProductNavigationButtons;
