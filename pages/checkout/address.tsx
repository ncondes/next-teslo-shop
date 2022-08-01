import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { ShopLayout } from '../../components/layouts';
import { CartContext } from '../../context';
import { countries } from '../../utils';
// import { GetServerSideProps } from 'next';
// import { jwt } from '../../utils';

type FormData = {
   firstName: string;
   lastName: string;
   address: string;
   address2?: string;
   zip: string;
   city: string;
   country: string;
   phone: string;
};

const getAddressFromCookies = (): FormData => {
   const data = Cookies.get('addressFormData');

   if (!data) {
      return {
         firstName: '',
         lastName: '',
         address: '',
         address2: '',
         zip: '',
         city: '',
         country: '',
         phone: '',
      };
   }

   return JSON.parse(data);
};

const AdressPage = () => {
   const router = useRouter();
   const { updateShippingAddress } = useContext(CartContext);
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>({
      defaultValues: getAddressFromCookies(),
   });

   const onSubmitAddressFormData = (data: FormData) => {
      const addressFormData = {
         firstName: data.firstName,
         lastName: data.lastName,
         address: data.address,
         address2: data.address2,
         zip: data.zip,
         city: data.city,
         country: data.country,
         phone: data.phone,
      };
      Cookies.set('addressFormData', JSON.stringify(addressFormData));

      updateShippingAddress(data);
      router.push('/checkout/summary');
   };

   return (
      <ShopLayout title="Address" pageDescription="Confirm delivery address">
         <form onSubmit={handleSubmit(onSubmitAddressFormData)}>
            <Typography variant="h1" component="h1">
               Address
            </Typography>
            <Grid container spacing={2} mt={2}>
               <Grid item xs={12} sm={6}>
                  <TextField
                     label="First Name"
                     variant="filled"
                     fullWidth
                     {...register('firstName', {
                        required: 'Required Field',
                        minLength: { value: 2, message: 'First Name must be at least 2 characters' },
                     })}
                     error={!!errors.firstName}
                     helperText={errors.firstName?.message}
                  />
               </Grid>
               <Grid item xs={12} sm={6}>
                  <TextField
                     label="Last Name"
                     variant="filled"
                     fullWidth
                     {...register('lastName', {
                        required: 'Required Field',
                        minLength: { value: 2, message: 'Last Name must be at least 2 characters' },
                     })}
                     error={!!errors.lastName}
                     helperText={errors.lastName?.message}
                  />
               </Grid>
               <Grid item xs={12} sm={6}>
                  <TextField
                     label="Address"
                     variant="filled"
                     fullWidth
                     {...register('address', {
                        required: 'Required Field',
                     })}
                     error={!!errors.address}
                     helperText={errors.address?.message}
                  />
               </Grid>
               <Grid item xs={12} sm={6}>
                  <TextField
                     label="Address 2 (Optional)"
                     variant="filled"
                     fullWidth
                     {...register('address2', {})}
                     error={!!errors.address2}
                     helperText={errors.address2?.message}
                  />
               </Grid>
               <Grid item xs={12} sm={6}>
                  <TextField
                     label="Postal Code"
                     variant="filled"
                     fullWidth
                     {...register('zip', {
                        required: 'Required Field',
                     })}
                     error={!!errors.zip}
                     helperText={errors.zip?.message}
                  />
               </Grid>
               <Grid item xs={12} sm={6}>
                  <TextField
                     label="City"
                     variant="filled"
                     fullWidth
                     {...register('city', {
                        required: 'Required Field',
                     })}
                     error={!!errors.city}
                     helperText={errors.city?.message}
                  />
               </Grid>
               <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="filled">
                     <TextField
                        select
                        defaultValue={
                           Cookies.get('addressFormData')
                              ? JSON.parse(Cookies.get('addressFormData')!).country
                              : countries[0].name
                        }
                        label="Country"
                        {...register('country', {
                           required: 'Required Field',
                        })}
                        error={!!errors.country}
                        helperText={errors.country?.message}
                     >
                        {countries.map((country) => (
                           <MenuItem key={country.code} value={country.code}>
                              {country.name}
                           </MenuItem>
                        ))}
                     </TextField>
                  </FormControl>
               </Grid>
               <Grid item xs={12} sm={6}>
                  <TextField
                     label="Phone Number"
                     variant="filled"
                     fullWidth
                     {...register('phone', {
                        required: 'Required Field',
                     })}
                     error={!!errors.phone}
                     helperText={errors.phone?.message}
                  />
               </Grid>
            </Grid>
            <Box display="flex" justifyContent="center" mt={5}>
               <Button color="secondary" className="circular-btn" size="large" type="submit">
                  Review Order
               </Button>
            </Box>
         </form>
      </ShopLayout>
   );
};

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//    const { token = '' } = req.cookies;
//    let isValidToken = false;

//    try {
//       await jwt.isValidToken(token);
//       isValidToken = true;
//    } catch (error) {
//       isValidToken = false;
//    }

//    if (!isValidToken) {
//       return {
//          redirect: {
//             destination: 'auth/login?p=/checkout/address',
//             permanent: false,
//          },
//       };
//    }

//    return {
//       props: {},
//    };
// };

export default AdressPage;
