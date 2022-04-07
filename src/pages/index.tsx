import Products from "components/Products/Products";
import withLayout from "components/withLayout/withLayout";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { FC, Fragment } from "react";
import { ProductDocument } from "types/IProduct";
import API from "config/axios";
import { AxiosResponse } from "axios";
import { getErrorMessage } from "utils/error";
import { getUserDetailsFromContext } from "utils/utils";
import { UserContextDetails } from "types/IUser";

interface IHomeProps {
  products?: ProductDocument[];
  error?: string;
}

const Home: FC<IHomeProps> = ({ products }) => {
  return (
    <Fragment>
      <h1 className="mb-4 font-semibold text-2xl">Our Products</h1>
      {products ? <Products products={products} /> : null}
    </Fragment>
  );
};

export default withLayout(Home);

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const props: { [key: string]: any } = {};
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
    const { data }: AxiosResponse = await API.get(
      `${process.env.APP_BASE_URL}/api/products`
    );
    props.products = data.products || [];
  } catch (error) {
    props.error = getErrorMessage(error);
  }
  return {
    props,
  };
};
