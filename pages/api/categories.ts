// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import { Category } from "@/models/Category";
import { CategoryType } from "@/types";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CategoryType[] | boolean>
) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      const category = await Category.findById(req.query.id);
      res.json(category);
    } else {
      const allCategories = (await Category.find().populate(
        "parent"
      )) as CategoryType[];
      res.json(allCategories);
    }
  }

  if (method === "POST") {
    const category = await Category.create(req.body);
    res.json(category);
  }

  if (method === "PUT") {
    const { categoryId, name, parent, properties } = req.body;
    await Category.findByIdAndUpdate(categoryId, {
      name,
      parent,
      properties,
    });
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query.id) {
      await Category.findByIdAndDelete(req.query.id);
      res.json(true);
    }
  }
}
