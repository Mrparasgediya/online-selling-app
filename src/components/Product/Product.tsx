import React, { FC } from "react";
import { ProductDocument } from "types/IProduct";
import NextImage from "next/image";
import ProductNavigationButtons from "components/ProductNavigationButtons/ProductNavigationButtons";
import CustomLink from "components/NextImageLink/NextImageLink";

interface IProductProps {
  product: ProductDocument;
}

const Product: FC<IProductProps> = ({
  product: { name, price, _id, images },
}) => {
  return (
    <div className="h-60 md:h-72 overflow-hidden cursor-pointer flex items-center flex-col w-auto rounded-md  shadow-lg bg-white/70 backdrop-filter backdrop-blur-lg">
      <div className="flex-1 overflow-hidden">
        <CustomLink link={`/products/${_id.toString()}`}>
          <NextImage
            src={`/uploads/products/${images[0] || "default-image.jpg"}`}
            alt={`${name}'s image`}
            objectFit="cover"
            objectPosition="center"
            height={400}
            width={400}
          />
        </CustomLink>
      </div>
      <div className="h-20 w-full md:p-2 p-1 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p>{name.length > 20 ? `${name.substring(0, 20)}...` : name}</p>
          <p>Rs. {price}</p>
        </div>
        <ProductNavigationButtons
          name={name}
          id={_id.toString()}
          showDetailsButton
        />
      </div>
    </div>
  );
};

export default Product;
