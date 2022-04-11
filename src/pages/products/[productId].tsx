import withLayout from "components/withLayout/withLayout";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FC } from "react";
import { ProductDocument } from "types/IProduct";
import ProductNavigationButtons from "components/ProductNavigationButtons/ProductNavigationButtons";
import ProductImageSlider from "components/ProductImageSlider/ProductImageSlider";
import ProductImageGrid from "components/ProductImageGrid/ProductImageGrid";
import { UserContextDetails, UserDocument } from "types/IUser";
import { getUserDetailsFromContext } from "utils/utils";
import { getErrorMessage } from "utils/error";
import { AxiosResponse } from "axios";
import API from "config/axios";

interface IProductDetailsPageProps {
  product?: ProductDocument;
  error?: string;
}

const ProductDetailsPage: FC<IProductDetailsPageProps> = ({
  product: { name, price, description, _id, images },
}) => {
  return (
    <div className="flex gap-4 mt-4 flex-col md:flex-row">
      <div className="min-h-[280px] md:flex-1 md:min-h-0">
        <ProductImageSlider images={images} productName={name}/>
        <ProductImageGrid images={images}  productName={name}/>
      </div>
      <div className="md:w-2/5 w-full flex flex-col gap-4 ">
        <h1 className="font-semibold text-3xl">{name}</h1>
        <h2 className="font-semibold text-lg">Rs.{price}</h2>
        <div className="flex w-full  gap-2 items-center font-medium text-md">
          <span>Order Now at</span>
          <ProductNavigationButtons name={name} id={_id.toString()} />
        </div>
        <div>
          <h3 className="font-semibold text-md">Description:</h3>
          <p className="font-medium text-md">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default withLayout(ProductDetailsPage);

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const productId = ctx.query.productId;
  const props: { [key: string]: any } = {};
  props.base_url = process.env.APP_BASE_URL;
  try {
    const { auth } = ctx.req.cookies;
    if (auth) {
      try {
        const [user]: UserContextDetails = await getUserDetailsFromContext(ctx);
        props.user = user;
      } catch (error) {
        // here no error will be processed because auth user is not recommended
      }
    }

    const { data }: AxiosResponse<{ product: ProductDocument }> = await API.get(
      `/api/products/${productId}`
    );
    // find product if product found
    props.product = data;
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
