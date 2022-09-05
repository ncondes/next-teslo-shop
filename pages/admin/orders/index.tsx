import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { AdminLayout } from '../../../components/layouts';
import { IOrder, IUser } from '../../../interfaces';

const columns: GridColDef[] = [
   { field: 'id', headerName: 'Order Id', width: 250 },
   { field: 'email', headerName: 'Email', width: 200 },
   { field: 'name', headerName: 'Name', width: 200 },
   { field: 'total', headerName: 'Total', width: 100 },
   {
      field: 'isPaid',
      headerName: 'Paid',
      renderCell: ({ row }: GridValueGetterParams) => {
         return row.isPaid ? (
            <Chip variant="outlined" label="Paid" color="success" />
         ) : (
            <Chip variant="outlined" label="Unpaid" color="error" />
         );
      },
   },
   { field: 'noProducts', headerName: 'No. Products', width: 100, align: 'center' },
   {
      field: 'check',
      headerName: 'View Order',
      renderCell: ({ row }: GridValueGetterParams) => {
         return (
            <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
               View Order
            </a>
         );
      },
   },
   { field: 'createdAt', headerName: 'Date Created', width: 250 },
];

const OrdersPage = () => {
   const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

   if (!data && !error) return <></>;

   const rows = data!.map((order) => ({
      id: order._id,
      email: (order.user as IUser).email,
      name: (order.user as IUser).name,
      total: order.total,
      noProducts: order.numberOfItems,
      isPaid: order.isPaid,
      createdAt: order.createdAt,
   }));

   return (
      <AdminLayout title="Orders" subtitle="Orders Maintenance" icon={<ConfirmationNumberOutlined />}>
         <Grid container className="fadeIn">
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
               <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
            </Grid>
         </Grid>
      </AdminLayout>
   );
};

export default OrdersPage;
