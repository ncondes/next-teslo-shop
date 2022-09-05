import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data =
   | {
        numberOfOrders: number;
        paidOrders: number;
        unpaidOrders: number;
        numberOfProducts: number; // role = client
        numberOfClients: number;
        productsWithNoInventory: number;
        productsWithLowInventory: number; // inStock <= 10
     }
   | { message: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   switch (req.method) {
      case 'GET':
         return getDashboardData(req, res);

      default:
         return res.status(400).json({ message: 'Bad Request' });
   }
}

const getDashboardData = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
   await db.connect();

   // const orders = await Order.find();
   // const products = await Product.find();
   // const users = await User.find();

   // const data = {
   //    numberOfOrders: orders.length,
   //    paidOrders: orders.filter((order) => order.isPaid).length,
   //    unpaidOrders: orders.filter((order) => !order.isPaid).length,
   //    numberOfProducts: products.length,
   //    numberOfClients: users.filter((user) => user.role === 'client').length,
   //    productsWithNoInventory: products.filter((product) => product.inStock === 0).length,
   //    lowInventory: products.filter((product) => product.inStock <= 10).length,
   // };

   // other way to get the data
   const [
      numberOfOrders,
      paidOrders,
      unpaidOrders,
      numberOfProducts,
      numberOfClients,
      productsWithNoInventory,
      productsWithLowInventory,
   ] = await Promise.all([
      Order.count(),
      Order.find({ isPaid: true }).count(),
      Order.find({ isPaid: false }).count(),
      Product.count(),
      User.find({ role: 'client' }).count(),
      Product.find({ inStock: 0 }).count(),
      Product.find({ inStock: { $lte: 10 } }).count(),
   ]);

   const data = {
      numberOfOrders,
      paidOrders,
      unpaidOrders,
      numberOfProducts,
      numberOfClients,
      productsWithNoInventory,
      productsWithLowInventory,
   };

   await db.disconnect();

   return res.status(200).json({ ...data });
};
