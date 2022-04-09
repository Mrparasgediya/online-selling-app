import { AxiosResponse } from "axios";
import Button from "components/Button/Button";
import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import CustomInput from "components/CustomInput/CustomInput";
import CustomTextArea from "components/CustomTextArea/CustomTextArea";
import withLayout from "components/withLayout/withLayout";
import API from "config/axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { NextRouter, useRouter } from "next/router";
import React, { FC, FormEventHandler, useRef, useState } from "react";
import { ProductDocument } from "types/IProduct";
import { getErrorMessage } from "utils/error";
import { getUserDetailsFromContext } from "utils/utils";
import validator from "validator";
import { getToken } from "utils/cookie";

interface IEditProductPageProps {
  error?: string;
  product?: ProductDocument;
}
const EditProductPage: FC<IEditProductPageProps> = ({ product }) => {
  const { _id, name, description, price } = product;
  const router: NextRouter = useRouter();
  const productNameInputRef = useRef<HTMLInputElement>(null);
  const productDescriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const productPriceInputRef = useRef<HTMLInputElement>(null);
  const [errorText, setErrorText] = useState<string>("");
  const [formData, setFormData] = useState<{
    description: string;
    name: string;
    price: number;
  }>({
    description,
    name,
    price,
  });

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const dataForPayload = {};
      const dataKeys = ["name", "price", "description"];
      for (let key of dataKeys) {
        if (
          (key !== "price" && !validator.isEmpty(formData[key])) ||
          formData[key] >= 0
        )
          if (product[key] !== formData[key]) {
            dataForPayload[key] = formData[key];
          }
      }
      if (Object.keys(dataForPayload).length) {
        const result = await API.put(
          `/api/products/${_id.toString()}`,
          dataForPayload,
          {
            headers: {
              Authorization: `Barear ${getToken()}`,
            },
          }
        );
      }
      router.push(`/admin/products`);
    } catch (error) {
      setErrorText(getErrorMessage(error));
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
          value={formData.name}
          onChange={(e) => {
            setFormData((prevState) => ({
              ...prevState,
              name: e.target.value,
            }));
          }}
        />
        <CustomInput
          type="number"
          ref={productPriceInputRef}
          label="Product Price"
          id="productPrice"
          required
          min="0"
          value={formData.price}
          onChange={(e) => {
            setFormData((prevState) => ({
              ...prevState,
              price: e.target.value,
            }));
          }}
        />
        <CustomTextArea
          ref={productDescriptionInputRef}
          label="Product Description"
          id="productDescription"
          required
          value={formData.description}
          onChange={(e) => {
            setFormData((prevState) => ({
              ...prevState,
              description: e.target.value,
            }));
          }}
        ></CustomTextArea>
        <Button type="submit" color="blue">
          Edit Product
        </Button>
      </form>
    </div>
  );
};

export default withLayout(EditProductPage);

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

    const { data: productResponse }: AxiosResponse = await API.get(
      `/api/products/${ctx.query.productId}`
    );

    props.product = productResponse;
  } catch (error) {
    props.error = getErrorMessage(error);
  }
  return { props };
};
