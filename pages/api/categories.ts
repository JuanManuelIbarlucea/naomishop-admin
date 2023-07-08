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
    const { name, parent } = req.body;
    const category = await Category.create({
      name,
      parent,
    });
    res.json(category);
  }

  if (method === "PUT") {
    const { categoryId, name, parent } = req.body;
    await Category.findByIdAndUpdate(categoryId, {
      name,
      parent,
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
