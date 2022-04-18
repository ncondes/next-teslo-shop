import { Grid, Typography } from '@mui/material';

export const OrderSummary = () => {
   return (
      <Grid container>
         <Grid item xs={6}>
            <Typography># Products</Typography>
         </Grid>
         <Grid item xs={6} display="flex" justifyContent="flex-end">
            <Typography>{`3 Items`}</Typography>
         </Grid>
         <Grid item xs={6}>
            <Typography>Subtotal</Typography>
         </Grid>
         <Grid item xs={6} display="flex" justifyContent="flex-end">
            <Typography>{`$${155.56}`}</Typography>
         </Grid>
         <Grid item xs={6}>
            <Typography>Taxes (15%)</Typography>
         </Grid>
         <Grid item xs={6} display="flex" justifyContent="flex-end">
            <Typography>{`$${34.56}`}</Typography>
         </Grid>
         <Grid item xs={6} mt={2}>
            <Typography variant="subtitle1">Total</Typography>
         </Grid>
         <Grid item xs={6} mt={2} display="flex" justifyContent="flex-end">
            <Typography variant="subtitle1">{`$${189.56}`}</Typography>
         </Grid>
      </Grid>
   );
};
