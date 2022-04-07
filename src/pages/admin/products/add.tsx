import Button from "components/Button/Button";
import withLayout from "components/withLayout/withLayout";
import React, { FC, FormEvent, useRef } from "react";
import { NextRouter, useRouter } from "next/router";
import API from "config/axios";
import { useState } from "react";
import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import Input from "components/Input/Input";
import TextArea from "components/TextArea/TextArea";
import { getErrorMessage } from "utils/error";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getUserDetailsFromContext } from "utils/utils";
import cryptoJS from "crypto-js";

interface IAddNewProductProps {
  token: string;
}

const AddNewProduct: FC<IAddNewProductProps> = ({ token }) => {
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
              Authorization: `Barear ${await cryptoJS.AES.decrypt(
                token,
                process.env.CRYPTO_SECRET
              ).toString(cryptoJS.enc.Utf8)}`,
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
        <Input
          type="text"
          ref={productNameInputRef}
          label="Product Name"
          id="productName"
          required
        />
        <Input
          type="number"
          ref={productPriceInputRef}
          label="Product Price"
          id="productPrice"
          required
        />
        <TextArea
          ref={productDescriptionInputRef}
          label="Product Description"
          id="productDescription"
          required
        ></TextArea>
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
    const [user, isAdmin, token] = await getUserDetailsFromContext(ctx);
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
    props.token = await cryptoJS.AES.encrypt(
      token,
      process.env.CRYPTO_SECRET
    ).toString();
  } catch (error) {
    props.error = getErrorMessage(error);
  }
  return {
    props,
  };
};
