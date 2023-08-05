// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { mongooseConnect } from '@/lib/mongoose';
import { Order } from '@/models/Order';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAdminRequest } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === 'GET') {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  }

  res.json({});
}
