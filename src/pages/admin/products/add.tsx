import Button from "components/Button/Button";
import withLayout from "components/withLayout/withLayout";
import React, { FormEvent, useRef } from "react";
import { NextRouter, useRouter } from "next/router";
import API from "config/axios";
import { useState } from "react";
import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import CustomInput from "components/CustomInput/CustomInput";
import CustomTextArea from "components/CustomTextArea/CustomTextArea";
import { getErrorMessage } from "utils/error";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getUserDetailsFromContext } from "utils/utils";
import { getToken } from "utils/cookie";

const AddNewProduct = () => {
  const router: NextRouter = useRouter();
  const productNameInputRef = useRef<HTMLInputElement>(null);
  const productDescriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const productPriceInputRef = useRef<HTMLInputElement>(null);
  const [errorText, setErrorText] = useState<string>("");

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      productNameInputRef.current &&
      productDescriptionInputRef.current &&
      productPriceInputRef.current
    ) {
      try {
        await API.post(
          "/api/products",
          {
            name: productNameInputRef.current.value,
            price: productPriceInputRef.current.value,
            description: productDescriptionInputRef.current.value,
          },
          {
            headers: {
              Authorization: `Barear ${getToken()}`,
            },
          }
        );
        router.push("/admin/products");
      } catch (error) {
        setErrorText(getErrorMessage(error));
      }
    }
  };
  return (
    <div>
      {!!errorText && <ErrorMessage message={errorText} />}
      <form
        onSubmit={handleFormSubmit}
        className="p-6 rounded-md  shadow-lg bg-white/60 backdrop-filter backdrop-blur-lg max-w-xl mx-auto flex flex-col gap-4"
      >
        <CustomInput
          type="text"
          ref={productNameInputRef}
          label="Product Name"
          id="productName"
          required
        />
        <CustomInput
          type="number"
          ref={productPriceInputRef}
          label="Product Price"
          id="productPrice"
          required
        />
        <CustomTextArea
          ref={productDescriptionInputRef}
          label="Product Description"
          id="productDescription"
          required
        ></CustomTextArea>
        <Button type="submit" color="blue">
          Add Product
        </Button>
      </form>
    </div>
  );
};

export default withLayout(AddNewProduct);

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
  return {
    props,
  };
};
