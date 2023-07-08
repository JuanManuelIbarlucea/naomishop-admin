import { ChangeEvent, FormEvent, useState } from "react";
import { ItemInterface, ReactSortable } from "react-sortablejs";

import LazyImage from "./LazyImage";
import { ProductType } from "@/types";
import Spinner from "./Spinner";
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
    images: existingImages,
  } = { ...product };

  const [name, setName] = useState(existingName || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [returnToProducts, setReturnToProducts] = useState(false);
  const [imageIsUploading, setImageIsUploading] = useState(false);
  const router = useRouter();

  async function saveProduct(ev: FormEvent) {
    ev.preventDefault();
    const data = { name, description, price, images };

    if (productId) {
      await axios.put("/api/products", { ...data, productId });
    } else {
      await axios.post("/api/products", data);
    }
    setReturnToProducts(true);
  }

  async function uploadImages(ev: ChangeEvent<HTMLInputElement>) {
    const files = ev?.target?.files;
    setImageIsUploading(true);
    if (files?.length && files.length > 0) {
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append("file", files.item(i) as Blob);
      }
      const {
        data: { links },
      } = await axios.post("/api/images", data);
      setImages((oldImages) => {
        return [...oldImages, ...links];
      });
      setImageIsUploading(false);
    }
  }

  function updateImagesOrder(iterableImages: ItemInterface[]) {
    setImages(iterableImages.map((iterable) => iterable.link));
  }

  const imagesIterable = images?.map((image, i) => {
    return { link: image, id: i };
  });

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
      <div className="mb-2 flex flex-wrap gap-3">
        <ReactSortable
          setList={updateImagesOrder}
          list={imagesIterable}
          className="flex flex-wrap gap-3"
        >
          {images.map((link) => {
            return (
              <div key={link} className="h-24">
                <LazyImage src={link} alt="" className="rounded-lg" />
              </div>
            );
          })}
        </ReactSortable>

        {imageIsUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}

        <label className="w-24 h-24 border flex justify-center items-center text-sm gap-1 text-center text-gray-500 bg-gray-200 rounded-lg cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
      </div>

      {!images.length && <div>No photos in this product</div>}
      <div className="flex gap-2">
        <button type="submit" className="btn-green">
          Save
        </button>
        <button
          type="button"
          className="btn-red"
          onClick={() => setReturnToProducts(true)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
