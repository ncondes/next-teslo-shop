import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces/products';
import { Product } from '../../../models';

type Data = { message: string } | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   switch (req.method) {
      case 'GET':
         return getProductBySlug(req, res);

      default:
         return res.status(400).json({ message: 'Bad Request' });
   }
}
const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
   await db.connect();
   const { slug } = req.query;
   const product = await Product.findOne({ slug }).lean();
   console.log(product);
   await db.disconnect();

   if (!product) {
      return res.status(404).json({ message: 'There is no product matching the slug' });
   }

   product.images = product.images.map((image) => {
      return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`;
   });

   return res.status(200).json(product);
};
