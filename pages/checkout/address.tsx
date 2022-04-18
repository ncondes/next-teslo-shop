import {
   Box,
   Button,
   FormControl,
   Grid,
   InputLabel,
   MenuItem,
   Select,
   TextField,
   Typography,
} from '@mui/material';
import { ShopLayout } from '../../components/layouts';

const AdressPage = () => {
   return (
      <ShopLayout title="Address" pageDescription="Confirm delivery address">
         <Typography variant="h1" component="h1">
            Address
         </Typography>
         <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6}>
               <TextField label="First Name" variant="filled" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
               <TextField label="Last Name" variant="filled" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
               <TextField label="Address" variant="filled" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
               <TextField
                  label="Address 2 (Optional)"
                  variant="filled"
                  fullWidth
               />
            </Grid>
            <Grid item xs={12} sm={6}>
               <TextField label="Postal Code" variant="filled" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
               <TextField label="City" variant="filled" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
               <FormControl fullWidth variant="filled">
                  <InputLabel>Country</InputLabel>
                  <Select defaultValue={2} label="Country">
                     <MenuItem value={1}>Argentina</MenuItem>
                     <MenuItem value={2}>Colombia</MenuItem>
                     <MenuItem value={3}>Brasil</MenuItem>
                     <MenuItem value={4}>Uruguay</MenuItem>
                  </Select>
               </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
               <TextField label="Phone Number" variant="filled" fullWidth />
            </Grid>
         </Grid>
         <Box display="flex" justifyContent="center" mt={5}>
            <Button color="secondary" className="circular-btn" size="large">
               Review Order
            </Button>
         </Box>
      </ShopLayout>
   );
};

export default AdressPage;
