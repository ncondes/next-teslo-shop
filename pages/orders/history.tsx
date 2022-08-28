import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import NextLink from 'next/link';
import { ShopLayout } from '../../components/layouts';
import { getOrdersByUser } from '../../database/dbOrders';
import { IOrder } from '../../interfaces';

const columns: GridColDef[] = [
   { field: 'id', headerName: 'No.', width: 100 },
   { field: 'fullName', headerName: 'Full Name', width: 300 },
   {
      field: 'payment',
      headerName: 'Payment',
      description: 'Is Payment Done?',
      width: 200,
      renderCell: (params: GridValueGetterParams) => {
         return params.row.payment ? (
            <Chip color="success" label="Done" variant="outlined" />
         ) : (
            <Chip color="error" label="Pending" variant="outlined" />
         );
      },
   },
   {
      field: 'link',
      headerName: 'Link',
      description: 'Order Link',
      width: 200,
      sortable: false,
      renderCell: (params: GridValueGetterParams) => {
         return (
            <NextLink href={`/orders/${params.row.orderId}`} passHref>
               <Link underline="always">See Order</Link>
            </NextLink>
         );
      },
   },
];

interface Props {
   orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
   const rows = orders.map((order, index) => {
      return {
         id: index + 1,
         payment: order.isPaid,
         fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
         orderId: order._id,
      };
   });

   return (
      <ShopLayout title="Orders History" pageDescription="Order History">
         <Typography variant="h1" component="h1">
            Orders History
         </Typography>
         <Grid container className="fadeIn">
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
               <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
            </Grid>
         </Grid>
      </ShopLayout>
   );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
   const session: any = await getSession({ req });

   if (!session) {
      return {
         redirect: {
            destination: 'auth/login?p=/orders/history',
            permanent: false,
         },
      };
   }

   const orders = await getOrdersByUser(session.user._id);

   return {
      props: {
         orders,
      },
   };
};

export default HistoryPage;
