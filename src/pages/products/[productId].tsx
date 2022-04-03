import withLayout from "components/withLayout/withLayout";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
} from "next";
import React, { FC } from "react";
import { ProductDocument } from "types/IProduct";
import ProductNavigationButtons from "components/ProductNavigationButtons/ProductNavigationButtons";
import ProductImageSlider from "components/ProductImageSlider/ProductImageSlider";
import ProductImageGrid from "components/ProductImageGrid/ProductImageGrid";

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
        <ProductImageSlider images={images} />
        <ProductImageGrid images={images} />
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

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const productId = context.params.productId;
  try {
    const result = await fetch(
      `${process.env.APP_BASE_URL}/api/products/${productId}`
    );
    // set not found if product not found
    if (result.status === 404) {
      return {
        notFound: true,
      };
    }
    // find product if product found
    const product: ProductDocument = await result.json();
    return {
      props: { product },
    };
  } catch (error) {
    return {
      props: { error: error.message },
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const result = await fetch(`${process.env.APP_BASE_URL}/api/products`);
    // set not found if product not found
    if (result.status === 404) {
      return {
        paths: [],
        fallback: false,
      };
    }
    // find product if product found
    const { products }: { products: ProductDocument[] } = await result.json();
    const paths = [];
    for (let product of products) {
      paths.push({ params: { productId: product._id.toString() } });
    }
    return {
      paths: paths,
      fallback: false,
    };
  } catch (error) {
    return {
      paths: [],
      fallback: false,
    };
  }
};

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const productId = context.query.productId;
//   try {
//     const result = await fetch(
//       `${process.env.APP_BASE_URL}/api/products/${productId}`
//     );
//     // set not found if product not found
//     if (result.status === 404) {
//       return {
//         notFound: true,
//       };
//     }
//     // find product if product found
//     const product: ProductDocument = await result.json();
//     return {
//       props: { product },
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       props: { error: error.message },
//     };
//   }
// };
