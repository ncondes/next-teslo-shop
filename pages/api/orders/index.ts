import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Order, Product } from '../../../models';

type Data = { message: string } | IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   switch (req.method) {
      case 'POST':
         return createOrder(req, res);

      default:
         return res.status(400).json({ message: 'Bad Request' });
   }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
   const { orderItems, total } = req.body as IOrder;

   const session: any = await getSession({ req });

   if (!session) return res.status(401).json({ message: 'User must be authenticated.' });

   const productsIds = orderItems.map((product) => product._id);

   await db.connect();

   // get an array with all the products in db that match the productIds array (products that user selected)
   const dbProducts = await Product.find({ _id: { $in: productsIds } });

   // verify if total price from the client is the same as the total price from the db
   try {
      const subTotal = orderItems.reduce((acc, curr) => {
         const currentPrice = dbProducts.find((product) => product.id === curr._id)?.price;
         if (!currentPrice) {
            throw new Error('Verify cart again, product does not exits.');
         }

         return acc + currentPrice * curr.quantity;
      }, 0);

      const backendTotalPrice = subTotal * (Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) + 1);

      if (total !== backendTotalPrice) {
         throw new Error('The total prices does not match.');
      }
   } catch (error) {
      await db.disconnect();
      console.error(error);
      return res.status(400).json({ message: 'Look at the server console.' });
   }

   // Here we are good to go
   const userId = session.user._id;
   const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
   await newOrder.save();
   await db.disconnect();

   return res.status(200).json(newOrder);
};
