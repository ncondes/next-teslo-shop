import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductSizeSelector, ProductSlideshow } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { CartContext } from '../../context/cart/CartContext';
import { dbProducts } from '../../database';
import { ICartProduct, IProduct } from '../../interfaces';
import { IValidSize } from '../../interfaces/products';

interface Props {
   product: IProduct;
}

// const product = initialData.products[0];

const ProductPage: NextPage<Props> = ({ product }) => {
   // # api call on every product page (No SEO)
   //    const router = useRouter();
   //    const { products: product, isLoading } = useProducts(`/products/${router.query.slug}`);
   const router = useRouter();
   const { addProductToCart } = useContext(CartContext);
   const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
      _id: product._id,
      image: product.images[0],
      price: product.price,
      size: undefined,
      slug: product.slug,
      title: product.title,
      gender: product.gender,
      quantity: 1,
   });

   const onSelectedSize = (size: IValidSize) => {
      setTempCartProduct((currentProduct) => ({
         ...currentProduct,
         size,
      }));
   };

   const onUpdateQuantity = (quantity: number) => {
      setTempCartProduct((currentProduct) => ({
         ...currentProduct,
         quantity,
      }));
   };

   const onAddProduct = () => {
      if (!tempCartProduct.size) return;

      addProductToCart(tempCartProduct);
      router.push('/cart');
   };

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
                  <ItemCounter
                     currentValue={tempCartProduct.quantity}
                     updatedQuantity={onUpdateQuantity}
                     maxValue={product.inStock}
                  />
                  <ProductSizeSelector
                     // selectedSize={product.sizes[0]}
                     sizes={product.sizes}
                     selectedSize={tempCartProduct.size}
                     onSelectedSize={onSelectedSize}
                  />
               </Box>
               {product.inStock > 0 ? (
                  <Button color="secondary" className="circular-btn" fullWidth onClick={onAddProduct}>
                     {tempCartProduct.size ? 'Add to Cart' : 'Select a Size'}
                  </Button>
               ) : (
                  <Chip label="No available" color="error" variant="outlined" sx={{ width: '100%' }} />
               )}
               <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Typography variant="body2">{product.description}</Typography>
               </Box>
            </Grid>
         </Grid>
      </ShopLayout>
   );
};

// Get Static Paths
export const getStaticPaths: GetStaticPaths = async (ctx) => {
   const productSlugs = await dbProducts.getAllproductSlugs();

   return {
      paths: productSlugs.map(({ slug }) => ({
         params: {
            slug,
         },
      })),
      fallback: 'blocking',
   };
};

// Get Static Props
export const getStaticProps: GetStaticProps = async ({ params }) => {
   const { slug } = params as { slug: string };
   const product = await dbProducts.getProductBySlug(slug);

   if (!product) {
      return {
         redirect: {
            destination: '/',
            permanent: false,
         },
      };
   }

   return {
      props: {
         product,
      },
      revalidate: 86400, // 60 x 60 x 24
   };
};

export default ProductPage;
