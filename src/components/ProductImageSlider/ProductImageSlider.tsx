import React, { FC, useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import NextImage from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import IImage from "types/IImage";

interface IProductImageSliderProps {
  images: IImage[];
  productName: string;
}

const ProductImageSlider: FC<IProductImageSliderProps> = ({
  images,
  productName,
}) => {
  const [isValid, setIsValid] = useState<boolean>(false);

  const defaultImageUrl = "/uploads/products/default-image.jpg";

  useEffect(() => {
    if (window) {
      setIsValid(window.innerWidth < 720);
    }
  }, []);
  return (
    isValid && (
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
      >
        {images.map((image, idx) => (
          <SwiperSlide key={idx}>
            <NextImage
              src={(image.src as string) || defaultImageUrl}
              alt={
                `${productName}'s image ${idx + 1}` || `Product img ${idx + 1}`
              }
              objectFit="cover"
              objectPosition="center"
              height={350}
              width={400}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    )
  );
};

export default ProductImageSlider;
