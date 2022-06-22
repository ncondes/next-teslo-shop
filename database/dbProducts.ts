import { IProduct } from '../interfaces';
import { Product } from '../models';
import { db } from './';

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
   await db.connect();
   const product = await Product.findOne({ slug }).lean();
   await db.disconnect();

   if (!product) return null;
   return JSON.parse(JSON.stringify(product));
};

interface ProductSlug {
   slug: string;
}

export const getAllproductSlugs = async (): Promise<ProductSlug[]> => {
   await db.connect();
   const slugs = await Product.find().select('slug -_id').lean();
   await db.disconnect();

   return JSON.parse(JSON.stringify(slugs));
};

export const getProductsBySearchQuery = async (query: string): Promise<IProduct[]> => {
   query = `${query}`.toLowerCase();

   await db.connect();
   const products = await Product.find({
      $text: { $search: query },
   })
      .select('title images price inStock slug -_id')
      .lean();
   await db.disconnect();

   return products;
};

export const getAllProducts = async (): Promise<IProduct[]> => {
   await db.connect();
   const products = await Product.find().lean();
   await db.disconnect();

   return JSON.parse(JSON.stringify(products));
};
