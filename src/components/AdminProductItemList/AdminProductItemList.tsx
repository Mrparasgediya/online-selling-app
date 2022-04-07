import AdminProductItem from "components/AdminProductItem/AdminProductItem";
import React, { FC } from "react";
import { ProductDocument } from "types/IProduct";

interface IAdminProductItemListProps {
  products: ProductDocument[];
  onProductDelete: Function;
}

const AdminProductItemList: FC<IAdminProductItemListProps> = ({
  products,
  onProductDelete,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {products.length ? (
        products.map((product, idx) => (
          <AdminProductItem
            product={product}
            key={idx}
            onProductDelete={onProductDelete}
          />
        ))
      ) : (
        <p className="font-medium text-xl">There is no products</p>
      )}
    </div>
  );
};

export default AdminProductItemList;
