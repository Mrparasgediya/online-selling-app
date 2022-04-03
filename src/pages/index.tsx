import Products from "components/Products/Products";
import withLayout from "components/withLayout/withLayout";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { FC, Fragment } from "react";
import { ProductDocument } from "types/IProduct";

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

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await fetch(`${process.env.APP_BASE_URL}/api/products`);
    const products: { products: ProductDocument[] } = await res.json();
    return {
      props: products,
    };
  } catch (error) {
    return {
      props: { error: error.message },
    };
  }
};
