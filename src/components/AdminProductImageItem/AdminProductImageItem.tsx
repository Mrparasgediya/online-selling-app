import React, { MouseEventHandler } from "react";
import { FC } from "react";
import NextImage from "next/image";
import Button from "components/Button/Button";
import CustomLink from "components/NextImageLink/NextImageLink";

interface IAdminProductImageItemProps {
  image: string;
  editImageUrl: string;
  onDeleteImage: () => (imageName: string) => void;
}
const AdminProductImageItem: FC<IAdminProductImageItemProps> = ({
  image,
  onDeleteImage,
  editImageUrl,
}) => {
  return (
    <div className="h-[300px] w-60 border-2 flex flex-col justify-around rounded-md  shadow-lg bg-white/50 backdrop-filter backdrop-blur-lg overflow-hidden">
      <NextImage
        src={`/uploads/products/${image || "default-image.jpg"}`}
        height={250}
        width={240}
        objectFit="cover"
        objectPosition="center"
      />
      <div className="flex gap-3 items-center p-2">
        <CustomLink link={editImageUrl}>
          <Button color="blue">Edit</Button>
        </CustomLink>
        <Button color="red" onClick={onDeleteImage().bind(this, image)}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AdminProductImageItem;
