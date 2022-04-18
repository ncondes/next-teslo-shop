import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import NextLink from 'next/link';
import { AuthLayout } from '../../components/layouts';

const LoginPage = () => {
   return (
      <AuthLayout title="Login">
         <Box sx={{ width: 350, p: '10px 20px' }}>
            <Grid container spacing={2}>
               <Grid item xs={12}>
                  <Typography variant="h1" component="h1">
                     Log In
                  </Typography>
               </Grid>
               <Grid item xs={12}>
                  <TextField
                     label="Email"
                     type="email"
                     variant="outlined"
                     fullWidth
                  />
               </Grid>
               <Grid item xs={12}>
                  <TextField
                     label="Password"
                     type="password"
                     variant="outlined"
                     fullWidth
                  />
               </Grid>
               <Grid item xs={12}>
                  <Button
                     color="secondary"
                     className="circular-btn"
                     size="large"
                     fullWidth
                  >
                     Log in
                  </Button>
               </Grid>
               <Grid item xs={12} display="flex" justifyContent="flex-end">
                  <NextLink href="/auth/register" passHref>
                     <Link underline="always">Create New Account</Link>
                  </NextLink>
               </Grid>
            </Grid>
         </Box>
      </AuthLayout>
   );
};

export default LoginPage;
