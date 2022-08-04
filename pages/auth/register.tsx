import { ErrorOutlined } from '@mui/icons-material';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../components/layouts';
import { AuthContext } from '../../context';
import { validations } from '../../utils';

type FormData = {
   name: string;
   email: string;
   password: string;
};

const RegisterPage = () => {
   const router = useRouter();
   const { registerUser } = useContext(AuthContext);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>();
   const [showError, setShowError] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');

   const onRegisterUser = async ({ name, email, password }: FormData) => {
      setShowError(false);

      const { hasError, message } = await registerUser(name, email, password);

      if (hasError) {
         setErrorMessage(message || '');
         setShowError(true);
         setTimeout(() => setShowError(false), 3000);
         return;
      }

      await signIn('credentials', { email, password });

      // navigate to previous screen
      // const previous = router.query.p?.toString() || '/';
      // router.replace(previous);
   };

   return (
      <AuthLayout title="Login">
         <form onSubmit={handleSubmit(onRegisterUser)}>
            <Box sx={{ width: 350, p: '10px 20px' }}>
               <Grid container spacing={2}>
                  <Grid item xs={12}>
                     <Typography variant="h1" component="h1">
                        Register
                     </Typography>
                     <Chip
                        label="User already registered"
                        color="error"
                        variant="outlined"
                        icon={<ErrorOutlined />}
                        sx={{ mt: '10px', visibility: showError ? 'visible' : 'hidden' }}
                     ></Chip>
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        label="Full Name"
                        type="text"
                        variant="outlined"
                        fullWidth
                        {...register('name', {
                           required: 'Required Field',
                           minLength: { value: 2, message: 'Name must be at least 2 characters' },
                        })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                     />
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
                        Register
                     </Button>
                  </Grid>
                  <Grid item xs={12} display="flex" justifyContent="flex-end">
                     <NextLink href={`/auth/login${router.query.p && `?p=${router.query.p.toString()}`}`} passHref>
                        <Link underline="always">Log In</Link>
                     </NextLink>
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

export default RegisterPage;
