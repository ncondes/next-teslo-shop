import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IPaypal } from '../../../interfaces';
import { Order } from '../../../models';

type Data = {
   message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   switch (req.method) {
      case 'POST':
         return payOrder(req, res);

      default:
         return res.status(400).json({ message: 'Bad request' });
   }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
   const base64Token = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
      'utf-8'
   ).toString('base64');
   const body = new URLSearchParams('grant_type=client_credentials');

   try {
      const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
         headers: {
            Authorization: `Basic ${base64Token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
         },
      });

      return data.access_token;
   } catch (error) {
      if (axios.isAxiosError(error)) {
         const data = error.response?.data;
         console.error({ data });
      } else {
         console.error({ error });
      }

      return null;
   }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse) => {
   const paypalBearerToken: string | null = await getPaypalBearerToken();

   if (!paypalBearerToken) {
      return res.status(400).json({ message: 'Unable to verify paypal token.' });
   }

   try {
      const { transactionId = '', orderId = '' } = req.body;

      const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(
         `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
         {
            headers: {
               Authorization: `bearer ${paypalBearerToken}`,
            },
         }
      );

      if (data.status !== 'COMPLETED') {
         return res.status(401).json({ message: 'Unrecognized order.' });
      }

      await db.connect();
      const dbOrder = await Order.findById(orderId);

      if (!dbOrder) {
         await db.disconnect();
         return res.status(400).json({ message: 'Order does not exist.' });
      }

      if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
         await db.disconnect();
         return res.status(400).json({ message: 'Ammounts between the order and paypal does not match.' });
      }

      dbOrder.transactionId = transactionId;
      dbOrder.isPaid = true;

      await dbOrder.save();

      await db.disconnect();

      return res.status(200).json({ message: 'Orden paid.' });
   } catch (error) {
      if (axios.isAxiosError(error)) {
         const data = error.response?.data;
         console.error({ data });
      } else {
         console.error({ error });
      }

      return null;
   }
};
