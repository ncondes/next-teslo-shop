import {
   Box,
   Button,
   CardActionArea,
   CardMedia,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   Grid,
   Link,
   Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { FC, useContext, useState } from 'react';
import { CartContext } from '../../context';
import { ICartProduct } from '../../interfaces';
import { ItemCounter } from '../ui';

interface Props {
   editable?: boolean;
}

export const CartList: FC<Props> = ({ editable = false }) => {
   const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);
   const [open, setOpen] = useState(false);

   const onUpdateProductQuantity = (product: ICartProduct, newQuantityValue: number) => {
      product.quantity = newQuantityValue;
      updateCartQuantity(product);
   };

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   return (
      <>
         {cart.map((product) => (
            <Grid container spacing={1} sx={{ mb: 1 }} key={product.slug + product.size}>
               <Grid item xs={3}>
                  {/* TODO: PRODUCT PAGE */}
                  <NextLink href={`/product/${product.slug}`} passHref>
                     <Link>
                        <CardActionArea>
                           <CardMedia
                              image={`/products/${product.image}`}
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
                     <Typography variant="body1">
                        Size: <strong>{product.size}</strong>
                     </Typography>
                     {editable ? (
                        <ItemCounter
                           currentValue={product.quantity}
                           maxValue={10}
                           updatedQuantity={(newValue) => {
                              onUpdateProductQuantity(product, newValue);
                           }}
                        />
                     ) : (
                        <Typography variant="h5">
                           {product.quantity} {product.quantity > 1 ? 'products' : 'product'}
                        </Typography>
                     )}
                  </Box>
               </Grid>
               <Grid item xs={2} display="flex" alignItems="center" flexDirection="column">
                  <Typography variant="subtitle1">${product.price}</Typography>
                  {editable && (
                     <Button variant="outlined" color="error" onClick={handleClickOpen}>
                        Remove
                     </Button>
                  )}
               </Grid>
               <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog" aria-describedby="alert-dialog">
                  <DialogTitle id="alert-dialog-title">{'Remove Product'}</DialogTitle>
                  <DialogContent>
                     <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove this product?
                     </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                     <Button onClick={handleClose}>Cancel</Button>
                     <Button
                        onClick={() => {
                           removeCartProduct(product);
                           handleClose();
                        }}
                        autoFocus
                        variant="outlined"
                        color="error"
                     >
                        Remove
                     </Button>
                  </DialogActions>
               </Dialog>
            </Grid>
         ))}
      </>
   );
};
