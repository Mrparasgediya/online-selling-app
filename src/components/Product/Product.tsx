import React, { FC, useEffect, useRef } from "react";
import { ProductDocument } from "types/IProduct";
import NextImage from "next/image";
import NextLink from "next/link";
import ProductNavigationButtons from "components/ProductNavigationButtons/ProductNavigationButtons";

interface IProductProps {
  product: ProductDocument;
}

const Product: FC<IProductProps> = ({
  product: { name, price, _id, images },
}) => {
  return (
    <NextLink href={`/products/${_id.toString()}`} passHref>
      <a>
        <div className="h-60 md:h-72 overflow-hidden cursor-pointer flex items-center flex-col w-auto rounded-md  shadow-lg bg-white/70 backdrop-filter backdrop-blur-lg">
          <div className="flex-1 overflow-hidden">
            <NextImage
              src={`/uploads/products/${images[0] || "default-image.jpg"}`}
              alt="Product img"
              objectFit="cover"
              objectPosition="center"
              // height={350}
              height={400}
              width={400}
              // width={400}
            />
          </div>
          <div className="h-20 w-full md:p-2 p-1 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p>{name}</p>
              <p>Rs. {price}</p>
            </div>
            <ProductNavigationButtons
              name={name}
              id={_id.toString()}
              showDetailsButton
            />
          </div>
        </div>
      </a>
    </NextLink>
  );
};

export default Product;
