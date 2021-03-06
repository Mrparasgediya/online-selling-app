import { AxiosResponse } from "axios";
import withLayout from "components/withLayout/withLayout";
import API from "config/axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { useEffect, useState } from "react";
import { FC } from "react";
import { ProductDocument } from "types/IProduct";
import { getErrorMessage } from "utils/error";
import AdminProductImageItem from "components/AdminProductImageItem/AdminProductImageItem";
import Button from "components/Button/Button";
import CustomLink from "components/NextImageLink/NextImageLink";
import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import { getUserDetailsFromContext } from "utils/utils";
import { getToken } from "utils/cookie";
import { ImageDocument } from "types/IImage";

interface IProductImagesProps {
  product?: ProductDocument;
  error?: string;
}

const ProductImages: FC<IProductImagesProps> = ({ product }) => {
  const [productImages, setProductImages] = useState<ImageDocument[]>(
    (product && product.images) || []
  );

  const [errorText, setErrorText] = useState<string>("");

  const onDeleteImage = (): ((string) => void) => {
    return async (imageId: string) => {
      try {
        const foundProductImageIdx = product.images.findIndex(
          (image) => image._id.toString() === imageId
        );
        if (foundProductImageIdx === -1) {
          throw new Error("Image not found in products");
        }
        // delete image from server
        await API.delete(
          `/api/products/${product._id.toString()}/images/${imageId}`,
          {
            headers: {
              Authorization: `Barear ${getToken()}`,
            },
          }
        );
        const newProductImages = productImages;
        newProductImages.splice(foundProductImageIdx, 1);
        setProductImages([...newProductImages]);
      } catch (error) {
        setErrorText(getErrorMessage(error));
      }
    };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-semibold text-xl">
          Image of product {product.name}
        </h2>
        <CustomLink
          link={`/admin/products/${product._id.toString()}/images/add`}
        >
          <Button color="blue">Add New Image</Button>
        </CustomLink>
      </div>
      {errorText ? (
        <ErrorMessage message={errorText} />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {(productImages &&
            productImages.length &&
            productImages.map((image, idx) => {
              return (
                <AdminProductImageItem
                  onDeleteImage={onDeleteImage}
                  editImageUrl={`/admin/products/${product._id.toString()}/images/${image._id.toString()}/edit`}
                  image={image}
                  key={idx}
                />
              );
            })) || <p className="font-medium text-lg">There is no images</p>}
        </div>
      )}
    </div>
  );
};

export default withLayout(ProductImages);

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const props: { [key: string]: any } = {};
  try {
    const [user, isAdmin] = await getUserDetailsFromContext(ctx);
    if (!user || !isAdmin) {
      return {
        redirect: {
          destination: "/users/login",
          permanent: false,
        },
      };
    }
    // set user to props
    props.user = user;

    const { data }: AxiosResponse = await API.get(
      `/api/products/${ctx.query.productId}`
    );
    props.product = data;
  } catch (error) {
    props.error = getErrorMessage(error);
  }
  return { props };
};
