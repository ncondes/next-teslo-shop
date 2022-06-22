import { Typography } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

interface Props {
   products: IProduct[];
   productsWereFound: boolean;
   query: string;
}

const SearchPage: NextPage<Props> = ({ products, productsWereFound, query }) => {
   return (
      <ShopLayout title={'Teslo Shop - Home'} pageDescription={'Find the better teslo products here!'}>
         <Typography variant="h1" component="h1">
            Search Products
         </Typography>
         {productsWereFound ? (
            <Typography variant="h2" color="secondary" textTransform="capitalize" fontWeight={700} sx={{ mb: 1 }}>
               {query}
            </Typography>
         ) : (
            <Typography variant="h2" color="error" sx={{ mb: 1 }}>
               There are no products matching your search.
            </Typography>
         )}
         <ProductList products={products} />
      </ShopLayout>
   );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
   const { query = '' } = params as { query: string };

   if (query.length === 0) {
      return {
         redirect: {
            destination: '/',
            permanent: true,
         },
      };
   }

   let products = await dbProducts.getProductsBySearchQuery(query);

   const productsWereFound = products.length > 0;

   if (!productsWereFound) {
      products = await dbProducts.getAllProducts();
   }

   return {
      props: { products, productsWereFound, query },
   };
};

export default SearchPage;
