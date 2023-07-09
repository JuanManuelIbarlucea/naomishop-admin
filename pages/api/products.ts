// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import { Product } from "@/models/Product";
import { ProductType } from "@/types";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductType[] | boolean>
) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      const product = await Product.findById(req.query.id);
      res.json(product);
    } else {
      const allProducts = await Product.find();
      res.json(allProducts);
    }
  }

  if (method === "POST") {
    const productDoc = await Product.create(req.body);
    res.json(productDoc);
  }

  if (method === "PUT") {
    const {
      productId,
      name,
      description,
      price,
      images,
      category,
      properties,
    } = req.body;
    await Product.findByIdAndUpdate(productId, {
      name,
      description,
      price,
      images,
      category,
      properties,
    });
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query.id) {
      await Product.findByIdAndDelete(req.query.id);
      res.json(true);
    }
  }
}
