import { DeleteIcon, EditIcon } from "@/components/Icons";
import { useEffect, useState } from "react";

import Link from "next/link";
import { ProductType } from "@/types";
import axios from "axios";

export default function Product() {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    axios.get("/api/products").then((response) => {
      setProducts(response.data);
    });
  }, []);

  return (
    <>
      <h1>Products</h1>
      <table className="basic mb-4">
        <thead>
          <tr>
            <td>Product name</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>
                <Link href={`/products/edit/${product._id}`}>
                  <EditIcon />
                  Edit
                </Link>
                <Link href={`/products/delete/${product._id}`} className="red">
                  <DeleteIcon />
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href={"/products/new"}>
        <button className="btn-green">+Add new product</button>
      </Link>
    </>
  );
}
