import { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { Form } from "multiparty";
import fs from "fs";
import { isAdminRequest } from "./auth/[...nextauth]";
import mime from "mime-types";

const bucketName = "naomishop";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await isAdminRequest(req, res);
  const form = new Form();
  const { fields, files } = await new Promise<any>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);

      resolve({ fields, files });
    });
  });

  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
  });

  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    const newFileName = `${Date.now()}.${ext}`;
    await client.send(
      new PutObjectCommand({
        Key: newFileName,
        Bucket: bucketName,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path) || undefined,
      })
    );
    const link = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;
    links.push(link);
  }

  res.json({ links });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
