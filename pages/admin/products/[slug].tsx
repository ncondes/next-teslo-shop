import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import {
   Box,
   Button,
   capitalize,
   Card,
   CardActions,
   CardMedia,
   Checkbox,
   Chip,
   Divider,
   FormControl,
   FormControlLabel,
   FormGroup,
   FormHelperText,
   FormLabel,
   Grid,
   Radio,
   RadioGroup,
   TextField,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import tesloApi from '../../../api/tesloApi';
import { AdminLayout } from '../../../components/layouts';
import { dbProducts } from '../../../database';
import { IProduct, IValidSize, IValidType } from '../../../interfaces';
import { Product } from '../../../models';

const validTypes = ['shirts', 'pants', 'hoodies', 'hats'];
const validGender = ['men', 'women', 'kid', 'unisex'];
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface FormData {
   _id?: string;
   description: string;
   images: string[];
   inStock: number;
   price: number;
   sizes: IValidSize[];
   slug: string;
   tags: string[];
   title: string;
   type: IValidType;
   gender: 'men' | 'women' | 'kid' | 'unisex';
}

interface Props {
   product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
   const router = useRouter();
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [newTagValue, setNewTagValue] = useState('');
   const [isSaving, setIsSaving] = useState(false);

   const {
      register,
      watch,
      setValue,
      getValues,
      control,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>({
      defaultValues: product,
   });

   useEffect(() => {
      const subscription = watch((value, { name, type }) => {
         if (name === 'title') {
            const newSlug = value.title?.trim().replaceAll(' ', '_').replaceAll("'", '').toLowerCase() || '';
            setValue('slug', newSlug);
         }
      });

      return () => subscription.unsubscribe();
   }, []);

   const onAddTag = () => {
      const newTag = newTagValue.trim().toLocaleLowerCase();
      setNewTagValue('');

      if (!newTag) return;

      const currentTags = getValues('tags');

      if (!currentTags.includes(newTag)) currentTags.push(newTag);
   };

   const onDeleteTag = (tag: string) => {
      const updatedTags = getValues('tags').filter((t) => t !== tag);
      setValue('tags', updatedTags, { shouldValidate: true });
   };

   const onFilesSelected = async ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
      if (!files || files.length === 0) return;

      try {
         for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await tesloApi.post<{ message: string }>('/admin/upload', formData);
            setValue('images', [...getValues('images'), data.message], { shouldValidate: true });
         }
      } catch (error) {
         console.log({ error });
      }
   };

   const onDeleteImage = (image: string) => {
      setValue(
         'images',
         getValues('images').filter((img) => img !== image),
         { shouldValidate: true }
      );
   };

   const onSubmit = async (formData: FormData) => {
      if (formData.images.length < 2) return alert('2 images are required.');

      setIsSaving(true);

      try {
         const { data } = await tesloApi({
            url: '/admin/products',
            method: formData._id ? 'PUT' : 'POST',
            data: formData,
         });

         if (!formData._id) {
            router.replace(`/admin/products/${formData.slug}`);
            setIsSaving(false);
         } else {
            setIsSaving(false);
         }
      } catch (error) {
         setIsSaving(false);
         console.error({ error });
      }
   };

   return (
      <AdminLayout title={'Product'} subtitle={`Editing: ${product.title}`} icon={<DriveFileRenameOutline />}>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
               <Button
                  disabled={isSaving}
                  color="secondary"
                  startIcon={<SaveOutlined />}
                  sx={{ width: '150px' }}
                  type="submit"
               >
                  Save
               </Button>
            </Box>

            <Grid container spacing={2}>
               {/* Data */}
               <Grid item xs={12} sm={6}>
                  <TextField
                     label="Title"
                     variant="filled"
                     fullWidth
                     sx={{ mb: 1 }}
                     {...register('title', {
                        required: 'Field required',
                        minLength: { value: 2, message: '2 characters minimum' },
                     })}
                     error={!!errors.title}
                     helperText={errors.title?.message}
                  />

                  <TextField
                     label="Description"
                     variant="filled"
                     fullWidth
                     multiline
                     sx={{ mb: 1 }}
                     {...register('description', {
                        required: 'Field required',
                     })}
                     error={!!errors.description}
                     helperText={errors.description?.message}
                  />

                  <TextField
                     label="In Stock"
                     type="number"
                     variant="filled"
                     fullWidth
                     sx={{ mb: 1 }}
                     {...register('inStock', {
                        required: 'Field required',
                        min: { value: 0, message: 'Must enter a minimum value' },
                     })}
                     error={!!errors.inStock}
                     helperText={errors.inStock?.message}
                  />

                  <TextField
                     label="Price"
                     type="number"
                     variant="filled"
                     fullWidth
                     sx={{ mb: 1 }}
                     {...register('price', {
                        required: 'Field required',
                        min: { value: 0, message: 'Must enter a minimum value' },
                     })}
                     error={!!errors.price}
                     helperText={errors.price?.message}
                  />

                  <Divider sx={{ my: 1 }} />

                  <Controller
                     name="type"
                     control={control}
                     defaultValue={undefined}
                     render={({ field }) => (
                        <FormControl sx={{ mb: 1 }}>
                           <FormLabel>Type</FormLabel>
                           <RadioGroup row {...field}>
                              {validTypes.map((option) => (
                                 <FormControlLabel
                                    key={option}
                                    value={option}
                                    control={<Radio color="secondary" />}
                                    label={capitalize(option)}
                                 />
                              ))}
                           </RadioGroup>
                        </FormControl>
                     )}
                  />

                  <Controller
                     name="gender"
                     control={control}
                     defaultValue={undefined}
                     render={({ field }) => (
                        <FormControl sx={{ mb: 1 }}>
                           <FormLabel>Gender</FormLabel>
                           <RadioGroup row {...field}>
                              {validGender.map((option) => (
                                 <FormControlLabel
                                    key={option}
                                    value={option}
                                    control={<Radio color="secondary" />}
                                    label={capitalize(option)}
                                 />
                              ))}
                           </RadioGroup>
                        </FormControl>
                     )}
                  />

                  <Controller
                     name="sizes"
                     control={control}
                     defaultValue={undefined}
                     render={({ field }) => {
                        return (
                           <FormControl fullWidth error={!!errors.sizes}>
                              <FormGroup>
                                 <FormLabel>Sizes</FormLabel>
                                 {validSizes.map((size) => (
                                    <FormControlLabel
                                       key={size}
                                       label={size}
                                       control={
                                          <Checkbox
                                             value={size}
                                             checked={field.value.some((val) => val === size)}
                                             onChange={({ target: { value } }, checked) => {
                                                checked
                                                   ? field.onChange([...field.value, value])
                                                   : field.onChange(field.value.filter((val) => val !== value));
                                             }}
                                          />
                                       }
                                    />
                                 ))}
                              </FormGroup>
                              <FormHelperText>{capitalize(`${(errors.sizes as any)?.message || ''}`)}</FormHelperText>
                           </FormControl>
                        );
                     }}
                  />
               </Grid>

               {/* Tags & Images */}
               <Grid item xs={12} sm={6}>
                  <TextField
                     label="Slug - URL"
                     variant="filled"
                     fullWidth
                     sx={{ mb: 1 }}
                     {...register('slug', {
                        required: 'Field required',
                        validate: (value) => (value.trim().includes(' ') ? 'No empty spaces are allowed' : undefined),
                     })}
                     error={!!errors.slug}
                     helperText={errors.slug?.message}
                  />

                  <TextField
                     label="Tags"
                     variant="filled"
                     fullWidth
                     sx={{ mb: 1 }}
                     helperText="Press [spacebar] to add"
                     value={newTagValue}
                     onChange={({ target: { value } }) => setNewTagValue(value)}
                     onKeyDown={({ code }) => (code === 'Space' ? onAddTag() : undefined)}
                  />

                  <Box
                     sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0,
                        m: 0,
                     }}
                     component="ul"
                  >
                     {getValues('tags').map((tag) => {
                        return (
                           <Chip
                              key={tag}
                              label={tag}
                              onDelete={() => onDeleteTag(tag)}
                              color="primary"
                              size="small"
                              sx={{ ml: 1, mt: 1 }}
                           />
                        );
                     })}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" flexDirection="column">
                     <FormLabel sx={{ mb: 1 }}>Images</FormLabel>
                     <Button
                        color="secondary"
                        fullWidth
                        startIcon={<UploadOutlined />}
                        sx={{ mb: 3 }}
                        onClick={() => fileInputRef.current?.click()}
                     >
                        Load Image
                     </Button>
                     <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/png, image/gif, image/jpeg"
                        style={{ display: 'none' }}
                        onChange={onFilesSelected}
                     />

                     <Chip
                        label="2 images are required."
                        color="error"
                        variant="outlined"
                        sx={{ mb: 3, display: getValues('images').length < 2 ? 'flex' : 'none' }}
                     />

                     <Grid container spacing={2}>
                        {getValues('images').map((img) => (
                           <Grid item xs={4} sm={3} key={img}>
                              <Card>
                                 <CardMedia component="img" className="fadeIn" image={img} alt={img} />
                                 <CardActions>
                                    <Button fullWidth color="error" onClick={() => onDeleteImage(img)}>
                                       Delete
                                    </Button>
                                 </CardActions>
                              </Card>
                           </Grid>
                        ))}
                     </Grid>
                  </Box>
               </Grid>
            </Grid>
         </form>
      </AdminLayout>
   );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
   const { slug = '' } = query;

   let product: IProduct | null;

   if (slug === 'new') {
      const tempProduct = JSON.parse(JSON.stringify(new Product()));
      delete tempProduct._id;
      tempProduct.images = ['img1.jpg', 'img2.jpg'];
      product = tempProduct;
   } else {
      product = await dbProducts.getProductBySlug(slug.toString());
   }

   if (!product) {
      return {
         redirect: {
            destination: '/admin/products',
            permanent: false,
         },
      };
   }

   return {
      props: {
         product,
      },
   };
};

export default ProductAdminPage;
