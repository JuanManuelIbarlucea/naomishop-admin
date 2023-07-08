import { useEffect, useState } from "react";

import { ProductType } from "@/types";
import axios from "axios";
import { useRouter } from "next/router";

export default function DeleteProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<ProductType>();

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/products?id=${id}`).then((response) => {
      setProduct(response.data);
    });
  }, [id]);

  if (!product) return;

  function goBack() {
    router.push("/products");
  }

  function deleteProduct() {
    axios.delete(`/api/products?id=${id}`);
    goBack();
  }

  return (
    <>
      <h1 className="text-center">
        &nbsp; Do you really want to delete {product.name}?
      </h1>

      <div className="flex gap-2 justify-center">
        <button className="btn-green" onClick={deleteProduct}>
          Yes
        </button>
        <button className="btn-red" onClick={goBack}>
          No
        </button>
      </div>
    </>
  );
}
