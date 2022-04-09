import React, { FC } from "react";
import NextImage from "next/image";
import Button from "components/Button/Button";
import { ProductDocument } from "types/IProduct";
import CustomLink from "components/NextImageLink/NextImageLink";

interface IAdminProductItemProps {
  product: ProductDocument;
  onProductDelete: Function;
}

const AdminProductItem: FC<IAdminProductItemProps> = ({
  product: { images, name, price, description, _id },
  onProductDelete,
}) => {
  const defaultImageUrl = "/uploads/products/default-image.jpg";

  return (
    <div className="flex shadow-lg bg-white/60 backdrop-filter backdrop-blur-md items-start max-w-full rounded-lg overflow-hidden">
      <div className="flex h-full w-[120px]">
        <NextImage
          src={(images[0] && (images[0].src as string)) || defaultImageUrl}
          blurDataURL={
            (images[0] && (images[0].blur as string)) || defaultImageUrl
          }
          placeholder="blur"
          height={180}
          width={140}
          objectFit="cover"
          objectPosition="center"
        />
      </div>

      <div className="h-full flex-1 flex flex-col justify-between gap-3 p-4">
        <div className="w-full font-semibold text-lg flex items-center justify-between">
          <h3>{name}</h3>
          <h3>Rs.{price}</h3>
        </div>
        <p className="font-medium text-md">
          {description.length > 120
            ? `${description.substring(0, 120)}...`
            : description}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <CustomLink link={`/products/${_id.toString()}`}>
            <Button color="blue">Show Details</Button>
          </CustomLink>
          <CustomLink link={`/admin/products/${_id.toString()}/images`}>
            <Button color="blue">Show Images</Button>
          </CustomLink>
          <CustomLink link={`/admin/products/${_id.toString()}/edit`}>
            <Button color="green">Edit Product</Button>
          </CustomLink>
          <Button
            color="red"
            onClick={onProductDelete.bind(this, _id.toString())}
          >
            Delete Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductItem;
