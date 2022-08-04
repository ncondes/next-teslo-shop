import { ErrorOutlined } from '@mui/icons-material';
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { getProviders, getSession, signIn } from 'next-auth/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../components/layouts';
import { AuthContext } from '../../context';
import { validations } from '../../utils';

type FormData = {
   email: string;
   password: string;
};

const LoginPage = () => {
   const router = useRouter();
   const { loginUser } = useContext(AuthContext);
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>();
   const [showError, setShowError] = useState(false);
   const [providers, setProviders] = useState<any>({});

   useEffect(() => {
      getProviders().then((prov) => {
         setProviders(prov);
      });
   }, []);

   const onLoginUser = async ({ email, password }: FormData) => {
      setShowError(false);

      // const isValidLogin = await loginUser(email, password);

      // if (!isValidLogin) {
      //    setShowError(true);
      //    setTimeout(() => setShowError(false), 3000);
      //    return;
      // }

      // // navigate to previous screen
      // const previous = router.query.p?.toString() || '/';
      // router.replace(previous);

      await signIn('credentials', { email, password });
   };

   return (
      <AuthLayout title="Login">
         <form onSubmit={handleSubmit(onLoginUser)}>
            <Box sx={{ width: 350, p: '10px 20px' }}>
               <Grid container spacing={2}>
                  <Grid item xs={12}>
                     <Typography variant="h1" component="h1">
                        Log In
                     </Typography>
                     <Chip
                        label="We do not recognize this user / password"
                        color="error"
                        variant="outlined"
                        icon={<ErrorOutlined />}
                        sx={{ mt: '10px', visibility: showError ? 'visible' : 'hidden' }}
                     ></Chip>
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        {...register('email', {
                           required: 'Required Field',
                           validate: (value) => validations.isEmail(value),
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        {...register('password', {
                           required: 'Required Field',
                           minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <Button type="submit" color="secondary" className="circular-btn" size="large" fullWidth>
                        Log in
                     </Button>
                  </Grid>
                  <Grid item xs={12} display="flex" justifyContent="flex-end">
                     <NextLink href={`/auth/register${router.query.p && `?p=${router.query.p.toString()}`}`} passHref>
                        <Link underline="always">Create New Account</Link>
                     </NextLink>
                  </Grid>
                  <Grid item xs={12} display="flex" flexDirection="column" justifyContent="flex-end">
                     <Divider sx={{ width: '100%', mb: 2 }} />
                     {Object.values(providers).map((provider: any) => {
                        if (provider.id === 'credentials') return <div key="credentials"></div>;
                        return (
                           <Button
                              key={provider.id}
                              variant="outlined"
                              fullWidth
                              color="primary"
                              sx={{ mb: 1 }}
                              onClick={() => signIn(provider.id)}
                           >
                              {provider.name}
                           </Button>
                        );
                     })}
                  </Grid>
               </Grid>
            </Box>
         </form>
      </AuthLayout>
   );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
   const session = await getSession({ req });
   const { p = '/' } = query;

   if (session) {
      return {
         redirect: {
            destination: p.toString(),
            permanent: false,
         },
      };
   }

   return {
      props: {},
   };
};

export default LoginPage;
