import { Box, Button, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import {
   ProductSizeSelector,
   ProductSlideshow,
} from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { initialData } from '../../database/products';

const product = initialData.products[0];

const ProductPage = () => {
   return (
      <ShopLayout title={product.title} pageDescription={product.description}>
         <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
               <ProductSlideshow images={product.images} />
            </Grid>
            <Grid item xs={12} sm={5}>
               <Box display="flex" flexDirection="column">
                  <Typography variant="h1" component="h1">
                     {product.title}
                  </Typography>
                  <Typography variant="subtitle1" component="h2">
                     ${product.price}
                  </Typography>
               </Box>
               <Box sx={{ my: 2 }}>
                  <Typography variant="subtitle2" component="h2">
                     Quantity
                  </Typography>
                  <ItemCounter />
                  <ProductSizeSelector
                     selectedSize={product.sizes[0]}
                     sizes={product.sizes}
                  />
               </Box>
               <Button color="secondary" className="circular-btn" fullWidth>
                  Add to cart
               </Button>
               {/* <Chip
                  label="No available"
                  color="error"
                  variant="outlined"
                  sx={{ width: '100%' }}
               /> */}
               <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Typography variant="body2">{product.description}</Typography>
               </Box>
            </Grid>
         </Grid>
      </ShopLayout>
   );
};

export default ProductPage;
