import {
   Box,
   Button,
   CardActionArea,
   CardMedia,
   Grid,
   Link,
   Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';
import { initialData } from '../../database/products';
import { ItemCounter } from '../ui';

interface Props {
   editable?: boolean;
}

const productsInCart = [
   initialData.products[0],
   initialData.products[1],
   initialData.products[2],
];

export const CartList: FC<Props> = ({ editable = false }) => {
   return (
      <>
         {productsInCart.map((product) => (
            <Grid container spacing={1} sx={{ mb: 1 }} key={product.slug}>
               <Grid item xs={3}>
                  {/* TODO: PRODUCT PAGE */}
                  <NextLink href="/product/slug" passHref>
                     <Link>
                        <CardActionArea>
                           <CardMedia
                              image={`/products/${product.images[0]}`}
                              component="img"
                              sx={{ borderRadius: '5px' }}
                           />
                        </CardActionArea>
                     </Link>
                  </NextLink>
               </Grid>
               <Grid item xs={7}>
                  <Box display="flex" flexDirection="column">
                     <Typography variant="body1">{product.title}</Typography>
                     <Typography variant="body1">Size: </Typography>
                     {editable ? (
                        <ItemCounter />
                     ) : (
                        <Typography variant="h5"># Items</Typography>
                     )}
                  </Box>
               </Grid>
               <Grid
                  item
                  xs={2}
                  display="flex"
                  alignItems="center"
                  flexDirection="column"
               >
                  <Typography variant="subtitle1">${product.price}</Typography>
                  {editable && (
                     <Button variant="outlined" color="error">
                        Remove
                     </Button>
                  )}
               </Grid>
            </Grid>
         ))}
      </>
   );
};
