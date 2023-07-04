// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { ProductType } from '@/types/Products';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductType[]>
) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'POST') {
    const { name, description, price } = req.body;
    const productDoc = await Product.create({ name, description, price });
    return res.json(productDoc);
  }

  if (method === 'PUT') {
    const { productId, name, description, price } = req.body;
    const productDoc = await Product.findByIdAndUpdate(productId, {
      name,
      description,
      price,
    });
    return res.json(productDoc);
  }

  if (method === 'GET') {
    if (req.query?.id) {
      const product = await Product.findById(req.query.id);
      return res.json(product);
    }

    const allProducts = await Product.find();
    return res.json(allProducts);
  }
}
