import { CategoryType, ProductPropertyType, ProductType } from "@/types";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ItemInterface, ReactSortable } from "react-sortablejs";

import LazyImage from "./LazyImage";
import Spinner from "./Spinner";
import { UploadIcon } from "./Icons";
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
    category: existingCategory,
    properties: existingProperties,
  } = { ...product };

  const [name, setName] = useState(existingName || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(existingCategory || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [returnToProducts, setReturnToProducts] = useState(false);
  const [imageIsUploading, setImageIsUploading] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [productProperties, setProductProperties] = useState<any>(
    existingProperties || {}
  );
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev: FormEvent) {
    ev.preventDefault();
    const data = {
      name,
      description,
      category,
      price,
      images,
      properties: productProperties,
    };

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

  function setProductProperty(name: string, newValue: string) {
    setProductProperties((prev: any) => {
      const newProductProperties = { ...prev };
      newProductProperties[name] = newValue;
      return newProductProperties;
    });
  }

  const imagesIterable = images?.map((image, i) => {
    return { link: image, id: i };
  });

  if (returnToProducts) {
    router.push("/products");
  }

  const propertiesToFill = [];

  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }: CategoryType) => _id === category);
    if (catInfo) propertiesToFill.push(...catInfo?.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(({ _id }) => catInfo?.parent?._id);
      if (parentCat) propertiesToFill.push(...parentCat?.properties);
      catInfo = parentCat;
    }
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
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">No category</option>
        {categories.map((category) => {
          return (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          );
        })}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name} className="flex gap-1">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProperty(p.name, ev.target.value)}
              >
                {(p.values as string[]).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

          </div>
        ))}
      <label>Price (in USD)</label>
      <input
        value={price}
        type="number"
        placeholder="Price"
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-3">
        <ReactSortable
          setList={updateImagesOrder}
          list={imagesIterable}
          className="mb-2 flex flex-wrap gap-3"
        >
          {images.map((link) => {
            return (
              <div key={link} className="h-24 bg-white p-3 shadow-sm rounded-sm border border-gray-200">
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

        <label className="w-24 h-24 border flex flex-col justify-center items-center text-sm gap-1 text-center text-primary border-primary  rounded-lg cursor-pointer shadow-md">
          <UploadIcon />
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
