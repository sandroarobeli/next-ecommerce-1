import React, { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import Layout from "../../components/Layout";
import data from "../../utilities/data";
import { Store } from "../../utilities/Store";

export default function ProductScreen() {
  const { state, dispatch } = useContext(Store);

  const { query } = useRouter();
  const { slug } = query;

  const product = data.products.find((product) => product.slug === slug);
  if (!product) {
    return <div>Product Not Found!</div>;
  }

  const addToCartHandler = () => {
    const existingItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    );
    // If an item is already selected, it increases its quantity, if not - just assigns 1 to start with
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    // If more chosen than in storage, stops execution and throws an alert modal
    if (quantity > product.countInStock) {
      return alert("Out of stock!");
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: quantity },
    });
    console.log("State: "); // test
    console.log(state); // test
  };

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
    </Layout>
  );
}
