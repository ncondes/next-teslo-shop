import { Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import { CartContext } from '../../context';
import { currency } from '../../utils';

export const OrderSummary = () => {
   const { numberOfProducts, subTotal, tax, total } = useContext(CartContext);
   return (
      <Grid container>
         <Grid item xs={6}>
            <Typography>No. Products</Typography>
         </Grid>
         <Grid item xs={6} display="flex" justifyContent="flex-end">
            <Typography>{numberOfProducts}</Typography>
         </Grid>
         <Grid item xs={6}>
            <Typography>Subtotal</Typography>
         </Grid>
         <Grid item xs={6} display="flex" justifyContent="flex-end">
            <Typography>{currency.format(subTotal)}</Typography>
         </Grid>
         <Grid item xs={6}>
            <Typography>Taxes ({Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * 100}%)</Typography>
         </Grid>
         <Grid item xs={6} display="flex" justifyContent="flex-end">
            <Typography>{currency.format(tax)}</Typography>
         </Grid>
         <Grid item xs={6} mt={2}>
            <Typography variant="subtitle1">Total</Typography>
         </Grid>
         <Grid item xs={6} mt={2} display="flex" justifyContent="flex-end">
            <Typography variant="subtitle1">{currency.format(total)}</Typography>
         </Grid>
      </Grid>
   );
};
