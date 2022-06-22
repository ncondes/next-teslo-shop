import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../components/layouts';
import { ProductList } from '../components/products';
import { FullScreenLoading } from '../components/ui';
import { useProducts } from '../hooks';

const HomePage: NextPage = () => {
   const { products, isLoading } = useProducts('/products');

   return (
      <ShopLayout title={'Teslo Shop - Home'} pageDescription={'Find the better teslo products here!'}>
         <Typography variant="h1" component="h1">
            Store
         </Typography>
         <Typography variant="h2" sx={{ mb: 1 }}>
            All products
         </Typography>
         {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
      </ShopLayout>
   );
};

export default HomePage;
