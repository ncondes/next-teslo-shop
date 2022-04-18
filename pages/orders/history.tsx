import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import { ShopLayout } from '../../components/layouts';

const columns: GridColDef[] = [
   { field: 'id', headerName: 'ID', width: 100 },
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
            <NextLink href={`/orders/${params.row.id}`} passHref>
               <Link underline="always">See Order</Link>
            </NextLink>
         );
      },
   },
];

const rows = [
   { id: 1, payment: false, fullName: 'Nicolas Conde' },
   { id: 2, payment: true, fullName: 'Camilo Moreno' },
   { id: 3, payment: false, fullName: 'Fabian Cabra' },
   { id: 4, payment: true, fullName: 'David Pulido' },
];

const HistoryPage = () => {
   return (
      <ShopLayout title="Orders History" pageDescription="Order History">
         <Typography variant="h1" component="h1">
            Orders History
         </Typography>
         <Grid container>
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
               <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
               />
            </Grid>
         </Grid>
      </ShopLayout>
   );
};

export default HistoryPage;
