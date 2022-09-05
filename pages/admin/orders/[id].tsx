import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { CartList, OrderSummary } from '../../../components/cart';
import { AdminLayout } from '../../../components/layouts';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces/';

interface Props {
   order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
   const { shippingAddress } = order;

   return (
      <AdminLayout title="Order Summary" subtitle={`Order: ${order._id}`} icon={<AirplaneTicketOutlined />}>
         {order.isPaid ? (
            <Chip
               sx={{ my: 2 }}
               label="Payment Done"
               variant="outlined"
               color="success"
               icon={<CreditScoreOutlined />}
            />
         ) : (
            <Chip
               sx={{ my: 2 }}
               label="Payment Pending"
               variant="outlined"
               color="error"
               icon={<CreditCardOffOutlined />}
            />
         )}
         <Grid container className="fadeIn">
            <Grid item xs={12} sm={7}>
               <CartList products={order.orderItems} />
            </Grid>
            <Grid item xs={12} sm={5}>
               <Card className="summary-card">
                  <CardContent>
                     <Typography variant="h2">
                        Summary ({order.numberOfItems} {order.numberOfItems > 1 ? 'products' : 'product'})
                     </Typography>
                     <Divider sx={{ my: 1 }} />
                     <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle1">Delivery Address</Typography>
                     </Box>
                     <Typography>
                        {shippingAddress.firstName} {shippingAddress.lastName}
                     </Typography>
                     <Typography>
                        {shippingAddress.address} {shippingAddress.address2 ? shippingAddress.address2 : ''}
                     </Typography>
                     <Typography>
                        {shippingAddress.city} {shippingAddress.zip}
                     </Typography>
                     <Typography>{shippingAddress.country}</Typography>
                     <Typography>{shippingAddress.phone}</Typography>
                     <Divider sx={{ my: 1 }} />
                     <OrderSummary order={order} />
                  </CardContent>
               </Card>
            </Grid>
         </Grid>
      </AdminLayout>
   );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
   const { id = '' } = query;

   const order = await dbOrders.getOrderById(id.toString());

   if (!order) {
      return {
         redirect: {
            destination: `/admin/orders`,
            permanent: false,
         },
      };
   }

   return {
      props: {
         order,
      },
   };
};

export default OrderPage;
