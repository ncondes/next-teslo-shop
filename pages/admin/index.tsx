import {
   AccessTimeFilledOutlined,
   AttachMoneyOutlined,
   CancelPresentationOutlined,
   CategoryOutlined,
   CreditCardOffOutlined,
   CreditCardOutlined,
   DashboardOutlined,
   GroupOutlined,
   ProductionQuantityLimitsOutlined,
} from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { SummaryTile } from '../../components/admin';
import { AdminLayout } from '../../components/layouts';
import { DashboardSummaryResponse } from '../../interfaces';

const DashboardPage = () => {
   const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
      refreshInterval: 30 * 1000, // 30 secs
   });

   const [refreshIn, setRefreshIn] = useState(30);

   useEffect(() => {
      const interval = setInterval(() => {
         console.log('Tick');
         setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
      }, 1000);

      return () => {
         // If we navigate to other screen the previous effect is going to keep being executed, so we are going to clean that
         clearInterval(interval);
      };
   }, []);

   if (!error && !data) {
      return <></>;
   }

   if (error) {
      console.error(error);
      return <Typography>Error loading data.</Typography>;
   }

   const {
      numberOfOrders,
      paidOrders,
      unpaidOrders,
      numberOfProducts,
      numberOfClients,
      productsWithNoInventory,
      productsWithLowInventory,
   } = data!;

   return (
      <AdminLayout title="Dashboard" subtitle="General Statistics" icon={<DashboardOutlined />}>
         <Grid container spacing={2}>
            <SummaryTile
               title={numberOfOrders}
               subTitle={'Total Orders'}
               icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
               title={paidOrders}
               subTitle={'Paid Orders'}
               icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
               title={unpaidOrders}
               subTitle={'Pending Orders'}
               icon={<CreditCardOffOutlined color="warning" sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
               title={numberOfClients}
               subTitle={'Clients'}
               icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
               title={numberOfProducts}
               subTitle={'Products'}
               icon={<CategoryOutlined color="success" sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
               title={productsWithNoInventory}
               subTitle={'Products without stock'}
               icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
               title={productsWithLowInventory}
               subTitle={'Products in demand'}
               icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
               title={refreshIn}
               subTitle={'Updating in: '}
               icon={<AccessTimeFilledOutlined color="secondary" sx={{ fontSize: 40 }} />}
            />
         </Grid>
      </AdminLayout>
   );
};

export default DashboardPage;
