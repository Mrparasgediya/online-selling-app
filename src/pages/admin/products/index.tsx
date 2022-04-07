import { AxiosResponse } from "axios";
import AdminProductItemList from "components/AdminProductItemList/AdminProductItemList";
import Button from "components/Button/Button";
import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import CustomLink from "components/NextImageLink/NextImageLink";
import withLayout from "components/withLayout/withLayout";
import API from "config/axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FC, useEffect } from "react";
import { useState } from "react";
import { ProductDocument } from "types/IProduct";
import { getErrorMessage } from "utils/error";
import { getUserDetailsFromContext } from "utils/utils";
import cryptoJS from "crypto-js";

interface IAdminProductsPageProps {
  products?: ProductDocument[];
  error?: string;
  token?: string;
}

const AdminProductsPage: FC<IAdminProductsPageProps> = ({
  products,
  token,
}) => {
  const [allProducts, setAllProducts] = useState<ProductDocument[]>(products);
  const [errorText, setErrorText] = useState<string>("");

  const onProductDelete = async (productId: string) => {
    try {
      await API.delete(`/api/products/${productId}`, {
        headers: {
          Authorization: `Barear ${await cryptoJS.AES.decrypt(
            token,
            process.env.CRYPTO_SECRET
          ).toString(cryptoJS.enc.Utf8)}`,
        },
      });
      const newProducts = allProducts;
      const foundProductIdx = newProducts.findIndex(
        (product) => product._id.toString() === productId
      );
      newProducts.splice(foundProductIdx, 1);
      setAllProducts(Array.from(newProducts));
    } catch (error) {
      setErrorText(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {errorText && <ErrorMessage message={errorText} />}
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl mb-4">Our Products:</h1>
        <CustomLink link="/admin/products/add">
          <Button color="blue">Add Product</Button>
        </CustomLink>
      </div>
      <AdminProductItemList
        products={allProducts}
        onProductDelete={onProductDelete}
      />
    </div>
  );
};

export default withLayout(AdminProductsPage);

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  let props: { [key: string]: any } = {};
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

    const { data: productResponse }: AxiosResponse = await API.get(
      `${process.env.APP_BASE_URL}/api/products`
    );

    props.products = productResponse.products;

    return {
      props,
    };
  } catch (error) {
    props.error = getErrorMessage(error);
    return {
      props,
    };
  }
};
