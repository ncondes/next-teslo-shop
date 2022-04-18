import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import { ShopLayout } from '../../components/layouts';

const EmptyPage = () => {
   return (
      <ShopLayout
         title="Empty Cart"
         pageDescription="There are no articles in the shopping cart"
      >
         <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="calc(100vh - 200px)"
            sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
         >
            <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
            <Box display="flex" flexDirection="column" alignItems="center">
               <Typography>Your Shopping Cart is Empty</Typography>
               <NextLink href="/" passHref>
                  <Link typography="h5" color="secondary">
                     Go to the Home Page
                  </Link>
               </NextLink>
            </Box>
         </Box>
      </ShopLayout>
   );
};

export default EmptyPage;
