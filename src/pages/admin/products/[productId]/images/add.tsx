import Button from "components/Button/Button";
import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import CustomInput from "components/CustomInput/CustomInput";
import withLayout from "components/withLayout/withLayout";
import React, { FC, FormEvent, useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import NextImage from "next/image";
import { getImageUrlFromFile } from "utils/file-client";
import API from "config/axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { NextRouter } from "next/router";
import { getErrorMessage } from "utils/error";
import { getUserDetailsFromContext } from "utils/utils";
import { getToken } from "utils/cookie";

const AddProductImage = () => {
  const [errorText, setErrorText] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const productImageRef = useRef<HTMLInputElement>(null);
  const router: NextRouter = useRouter();
  const { productId } = router.query;

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (productImageRef.current) {
        const file: File = productImageRef.current.files[0];

        if (file) {
          const formData: FormData = new FormData();
          formData.append("image", file);
          await API.post(`/api/products/${productId}/images`, formData, {
            headers: {
              Authorization: `Barear ${getToken()}`,
            },
          });
          router.push(`/admin/products/${productId}/images`);
        } else {
          throw new Error("Select Product image File");
        }
      } else {
        throw new Error("Something went wrong! refresh page");
      }
    } catch (error) {
      setErrorText(getErrorMessage(error));
    }
  };
  const handleFileInputChange = async (
    e: InputEvent & { target: { files: FileList } }
  ) => {
    try {
      const imageUrl: string = (await getImageUrlFromFile(
        e.target.files[0]
      )) as string;
      setImagePreview(imageUrl);
    } catch (error) {
      setErrorText(error.message);
    }
  };
  return (
    <div>
      {!!errorText && <ErrorMessage message={errorText} />}
      <div className="p-6 rounded-md  shadow-lg bg-white/60 backdrop-filter backdrop-blur-lg max-w-xl mx-auto ">
        <div className="flex flex-col gap-2 mb-4">
          <h3 className="font-semibold text-xl">Image Preview</h3>
          <div className="border-2 h-80 w-full  rounded-md flex items-center justify-center">
            {imagePreview ? (
              <NextImage
                src={imagePreview}
                height={320}
                width={320}
                objectFit="cover"
                objectPosition="center"
              />
            ) : (
              <p>There is no image to display</p>
            )}
          </div>
        </div>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <CustomInput
            type="file"
            accept="image/*"
            ref={productImageRef}
            label="Select Product Image"
            id="productImage"
            onChange={handleFileInputChange}
            required
          />
          <Button type="submit" color="blue">
            Add Product Image
          </Button>
        </form>
      </div>
    </div>
  );
};

export default withLayout(AddProductImage);

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
  } catch (error) {
    props.error = getErrorMessage(error);
  }
  return { props };
};
