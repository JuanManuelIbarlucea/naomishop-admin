import { useEffect, useState } from "react";

import ProductForm from "@/components/ProductForm";
import { ProductType } from "@/types";
import axios from 'axios'
import { useRouter } from "next/router"

export default function EditProductPage() {

    const router = useRouter()
    const { id } = router.query;
    const [product, setProduct] = useState<ProductType>();

    useEffect(() => {
        if (!id) return;
        axios.get(`/api/products?id=${id}`).then(response => {
            setProduct(response.data)
        })
    }, [id])

    if (!product) return;

    return (
        <>
            <h1>Edit Product</h1>
            {
                product && (
                    <ProductForm product={product} />
                )
            }
        </>
    )
}