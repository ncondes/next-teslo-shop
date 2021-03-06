import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const MenPage: NextPage = () => {
   const { products, isLoading } = useProducts('/products?gender=men');

   return (
      <ShopLayout title={'Teslo Shop - Men Products'} pageDescription={'Find the products for men here!'}>
         <Typography variant="h1" component="h1">
            Store
         </Typography>
         <Typography variant="h2" sx={{ mb: 1 }}>
            Men products
         </Typography>
         {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
      </ShopLayout>
   );
};

export default MenPage;
