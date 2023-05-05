import { client } from "@/lib/client";
import Search from "@/components/Search";

const search = ({ products }) => {
  return <Search products={products} />;
};

export async function getServerSideProps(context) {
  const products = await client.fetch(
    `*[_type == "product" && !(_id in path("drafts.**"))]`
  );

  return {
    props: {
      products,
    },
  };
}

export default search;
