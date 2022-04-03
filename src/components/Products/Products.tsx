import Product from "components/Product/Product";
import React, { FC } from "react";
import { ProductDocument } from "types/IProduct";

interface IProductsProps {
  products: ProductDocument[];
}

const Products: FC<IProductsProps> = ({ products }) => {
  return (
    <div className="mt-4x grid grid-cols-2 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 md:gap-6 gap-4">
      {products.map((product, idx) => (
        <Product product={product} key={idx} />
      ))}
    </div>
  );
};

export default Products;
