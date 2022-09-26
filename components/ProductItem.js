import Link from "next/link";
import React, { useState, useContext } from "react";

// import DialogModal from "./DialogModal";
//import { Store } from "../utilities/Store";

export default function ProductItem({ product, addToCartHandler }) {
  //const { state, dispatch } = useContext(Store);

  // State management for alert dialog modal
  //const [alertModal, setAlertModal] = useState(false);

  // const addToCartHandler = () => {
  //   const existingItem = state.cart.cartItems.find(
  //     (item) => item.slug === product.slug
  //   );
  //   // If an item is already selected, it increases its quantity, if not - just assigns 1 to start with
  //   const quantity = existingItem ? existingItem.quantity + 1 : 1;
  //   // If more chosen than in storage, stops execution and throws an alert modal
  //   if (quantity > product.countInStock) {
  //     // return alert("Out of stock!");
  //     return setAlertModal(true);
  //   }

  //   dispatch({
  //     type: "CART_ADD_ITEM",
  //     payload: { ...product, quantity: quantity },
  //   });
  //   console.log("State: "); // test
  //   console.log(state); // test
  // };

  return (
    <div className="cart">
      <Link href={`/products/${product.slug}`}>
        <a>
          <img
            src={`${product.image}`}
            alt={`${product.name}`}
            className="rounded shadow"
          />
        </a>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/products/${product.slug}`}>
          <a>
            <h2 className="text-lg">{product.name}</h2>
          </a>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p className="mb-2">${product.price} </p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
