import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../components/layouts';
import { ProductList } from '../components/products';
import { initialData } from '../database/products';

const Home: NextPage = () => {
   return (
      <ShopLayout
         title={'Teslo Shop - Home'}
         pageDescription={'Find the better teslo products here!'}
      >
         <Typography variant="h1" component="h1">
            Store
         </Typography>
         <Typography variant="h2" sx={{ mb: 1 }}>
            All products
         </Typography>
         <ProductList products={initialData.products as any} />
      </ShopLayout>
   );
};

export default Home;
