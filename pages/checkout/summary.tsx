import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { CartContext } from '../../context';
import { countries } from '../../utils';

const SummaryPage = () => {
   const router = useRouter();
   const {
      shippingAddress = {
         firstName: '',
         lastName: '',
         address: '',
         address2: '',
         zip: '',
         city: '',
         country: '',
         phone: '',
      },
      numberOfProducts,
      createOrder,
   } = useContext(CartContext);
   const { firstName, lastName, address, address2, zip, city, country, phone } = shippingAddress;

   const [isPosting, setIsPosting] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');

   useEffect(() => {
      if (!Cookies.get('addressFormData')) {
         router.push('/checkout/address');
      }
   }, []);

   const onCreateOrder = async () => {
      setIsPosting(true);
      const { hasError, message } = await createOrder(); // TODO: depends on the result

      if (hasError) {
         setIsPosting(false);
         setErrorMessage(message);
         return;
      }

      router.replace(`/orders/${message}`);
   };

   return (
      <ShopLayout title="Order Summary" pageDescription="Order Summary">
         <Typography variant="h1" component="h1">
            Order Summary
         </Typography>
         <Grid container>
            <Grid item xs={12} sm={7}>
               <CartList />
            </Grid>
            <Grid item xs={12} sm={5}>
               <Card className="summary-card">
                  <CardContent>
                     <Typography variant="h2">
                        Summary ({numberOfProducts} {numberOfProducts === 1 ? 'Product' : 'Products'})
                     </Typography>
                     <Divider sx={{ my: 1 }} />
                     <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle1">Delivery Address</Typography>
                        <NextLink href="/checkout/address" passHref>
                           <Link underline="always">Edit</Link>
                        </NextLink>
                     </Box>
                     <Typography>
                        {firstName} {lastName}
                     </Typography>
                     <Typography>
                        {address} {address2}
                     </Typography>
                     <Typography>
                        {city}, {zip}
                     </Typography>
                     <Typography>{countries.find(({ code }) => code === country)?.name}</Typography>
                     <Typography>{phone}</Typography>
                     <Divider sx={{ my: 1 }} />
                     <Box display="flex" justifyContent="flex-end">
                        <NextLink href="/cart" passHref>
                           <Link underline="always">Edit</Link>
                        </NextLink>
                     </Box>
                     <OrderSummary />
                     <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                        <Button
                           disabled={isPosting}
                           color="secondary"
                           className="circular-btn"
                           fullWidth
                           onClick={onCreateOrder}
                        >
                           Confirm Order
                        </Button>
                        <Chip
                           variant="outlined"
                           color="error"
                           label={errorMessage}
                           sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                        />
                     </Box>
                  </CardContent>
               </Card>
            </Grid>
         </Grid>
      </ShopLayout>
   );
};

export default SummaryPage;
