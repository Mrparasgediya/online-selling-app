import React, { FC, useEffect, useState } from "react";
import NextImage from "next/image";
import IImage from "types/IImage";

interface IProductImageGridProps {
  images: IImage[];
}

const ProductImageGrid: FC<IProductImageGridProps> = ({ images }) => {
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    if (window) {
      setIsValid(window.innerWidth >= 720);
    }
  }, []);

  const defaultImageUrl = "/uploads/products/default-image.jpg";

  return (
    isValid && (
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, idx) => (
          <NextImage
            key={idx}
            src={(image.src as string) || defaultImageUrl}
            alt="Product img"
            objectFit="cover"
            objectPosition="center"
            height={350}
            width={400}
          />
        ))}
      </div>
    )
  );
};

export default ProductImageGrid;
