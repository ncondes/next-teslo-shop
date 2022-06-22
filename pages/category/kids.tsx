import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const KidsPage: NextPage = () => {
   const { products, isLoading } = useProducts('/products?gender=kid');

   return (
      <ShopLayout title={'Teslo Shop - Kids Products'} pageDescription={'Find the products for kids here!'}>
         <Typography variant="h1" component="h1">
            Store
         </Typography>
         <Typography variant="h2" sx={{ mb: 1 }}>
            kids products
         </Typography>
         {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
      </ShopLayout>
   );
};

export default KidsPage;
