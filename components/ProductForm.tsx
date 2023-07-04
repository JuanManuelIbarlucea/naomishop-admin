import { FormEvent, useState } from "react";

import { ProductType } from "@/types/Products";
import axios from "axios";
import { useRouter } from "next/router";

interface ProductFormProps {
  product?: ProductType;
}

export default function ProductForm({ product }: ProductFormProps) {
  const {
    _id: productId,
    name: existingName,
    description: existingDescription,
    price: existingPrice,
  } = { ...product };

  const [name, setName] = useState(existingName || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [returnToProducts, setReturnToProducts] = useState(false);
  const router = useRouter();

  const saveProduct = async (ev: FormEvent) => {
    ev.preventDefault();
    const data = { name, description, price };

    if (productId) {
      await axios.put("/api/products", { ...data, productId });
    } else {
      await axios.post("/api/products", data);
    }
    setReturnToProducts(true);
  };

  if (returnToProducts) {
    router.push("/products");
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        value={name}
        type="text"
        placeholder="Product name"
        onChange={(ev) => setName(ev.target.value)}
      />
      <label>Description</label>
      <textarea
        value={description}
        placeholder="Description"
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        value={price}
        type="number"
        placeholder="Price"
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">
          Save
        </button>

        <button type="button" className="btn-red" onClick={ () => setReturnToProducts(true)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
