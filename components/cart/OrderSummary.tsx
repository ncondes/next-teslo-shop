import { Grid, Typography } from '@mui/material';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { IOrder } from '../../interfaces';
import { currency } from '../../utils';

interface Props {
   order?: IOrder;
}

export const OrderSummary: FC<Props> = ({ order }) => {
   const { numberOfProducts, subTotal, tax, total } = useContext(CartContext);

   return (
      <Grid container>
         <Grid item xs={6}>
            <Typography>No. Products</Typography>
         </Grid>
         <Grid item xs={6} display="flex" justifyContent="flex-end">
            <Typography>{order?.numberOfItems ? order?.numberOfItems : numberOfProducts}</Typography>
         </Grid>
         <Grid item xs={6}>
            <Typography>Subtotal</Typography>
         </Grid>
         <Grid item xs={6} display="flex" justifyContent="flex-end">
            <Typography>{order?.subTotal ? currency.format(order.subTotal) : currency.format(subTotal)}</Typography>
         </Grid>
         <Grid item xs={6}>
            <Typography>Taxes ({Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * 100}%)</Typography>
         </Grid>
         <Grid item xs={6} display="flex" justifyContent="flex-end">
            <Typography>{order?.tax ? currency.format(order.tax) : currency.format(tax)}</Typography>
         </Grid>
         <Grid item xs={6} mt={2}>
            <Typography variant="subtitle1">Total</Typography>
         </Grid>
         <Grid item xs={6} mt={2} display="flex" justifyContent="flex-end">
            <Typography variant="subtitle1">
               {order?.total ? currency.format(order.total) : currency.format(total)}
            </Typography>
         </Grid>
      </Grid>
   );
};
