import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

import Layout from "../../components/Layout";
import data from "../../utilities/data";
import { Store } from "../../utilities/Store";
import Product from "../../models/Product";
import DialogModal from "../../components/DialogModal";
import db from "../../utilities/db";

export default function ProductScreen({ product }) {
  const { state, dispatch } = useContext(Store);

  // State management for alert dialog modal
  const [alertModal, setAlertModal] = useState(false);

  const router = useRouter();

  //const { query } = router; // Only used when getting dummy data
  // const { slug } = query;

  // const product = data.products.find((product) => product.slug === slug);
  if (!product) {
    return (
      <Layout title="Product Not Found">
        <h2 className="font-bold text-center">Product Not Found!</h2>
      </Layout>
    );
  }

  const addToCartHandler = async () => {
    const existingItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    );
    // If an item is already selected, it increases its quantity, if not - just assigns 1 to start with
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    // Calling API so it can query the DB...
    const response = await axios.get(
      `/api/controllers/products/${product._id}`
    );
    const { data } = response;

    // If more chosen than in storage, stops execution and throws an alert modal
    if (quantity > data.countInStock) {
      // return alert("Out of stock!");
      return setAlertModal(true);
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: quantity },
    });

    router.push("/cart");
  };

  // const updateCartHandler = (item, quantity) => {
  //   const updatedQuantity = Number(quantity);

  //   dispatch({
  //     type: "CART_ADD_ITEM",
  //     payload: { ...item, quantity: updatedQuantity },
  //   });
  // };
  // md: grid-cols-4 Means everything above medium measures as follows
  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href={"/"}>
          <a>Back to products</a>
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="cart p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? "In Stock" : "Unavailable"}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
      <DialogModal
        isOpen={alertModal}
        onClose={() => setAlertModal(false)}
        title={"Out of stock"}
        content={"You cannot order more than currently available."}
        textColor={"text-red-500"}
      />
    </Layout>
  );
}

// Since we deal with dynamic context, we use context parameter
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug: slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocsToObject(product) : null,
    },
  };
}
