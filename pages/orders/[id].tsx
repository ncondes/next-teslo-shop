import { CreditScoreOutlined } from '@mui/icons-material';
import {
   Box,
   Card,
   CardContent,
   Chip,
   Divider,
   Grid,
   Link,
   Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';

const OrderPage = () => {
   return (
      <ShopLayout
         title="Order Summary #41209430"
         pageDescription="Order Summary"
      >
         <Typography variant="h1" component="h1">
            Order Summary
         </Typography>
         {/* <Chip
            sx={{ my: 2 }}
            label="Payment Pending"
            variant="outlined"
            color="error"
            icon={<CreditCardOffOutlined />}
         /> */}
         <Chip
            sx={{ my: 2 }}
            label="Payment Made"
            variant="outlined"
            color="success"
            icon={<CreditScoreOutlined />}
         />
         <Grid container>
            <Grid item xs={12} sm={7}>
               <CartList />
            </Grid>
            <Grid item xs={12} sm={5}>
               <Card className="summary-card">
                  <CardContent>
                     <Typography variant="h2">Summary (# Products)</Typography>
                     <Divider sx={{ my: 1 }} />
                     <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle1">
                           Delivery Address
                        </Typography>
                        <NextLink href="/checkout/address" passHref>
                           <Link underline="always">Edit</Link>
                        </NextLink>
                     </Box>
                     <Typography>Nicolas Conde</Typography>
                     <Typography>Cra 1 No 12 - 44</Typography>
                     <Typography>Candelaria, BOG 28C</Typography>
                     <Typography>Colombia</Typography>
                     <Typography>+57 3107943784</Typography>
                     <Divider sx={{ my: 1 }} />
                     <Box display="flex" justifyContent="flex-end">
                        <NextLink href="/cart" passHref>
                           <Link underline="always">Edit</Link>
                        </NextLink>
                     </Box>
                     <OrderSummary />
                     <Box sx={{ mt: 3 }}>
                        <h1>Payment</h1>
                        <Chip
                           sx={{ my: 2 }}
                           label="Payment Made"
                           variant="outlined"
                           color="success"
                           icon={<CreditScoreOutlined />}
                        />
                     </Box>
                  </CardContent>
               </Card>
            </Grid>
         </Grid>
      </ShopLayout>
   );
};

export default OrderPage;
