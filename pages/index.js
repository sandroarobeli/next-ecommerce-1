import { React, useContext, useState } from "react";
import axios from "axios";

import data from "../utilities/data"; // Only used with dummy data...
import { Store } from "../utilities/Store";
import db from "../utilities/db";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import Product from "../models/Product";
import DialogModal from "../components/DialogModal";
import { toast } from "react-toastify";

// products comes from getServerSideProps below
export default function Home({ products }) {
  // State management for alert dialog modal
  const [alertModal, setAlertModal] = useState(false);

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  // Actually this block should be used either with Member component or here, but not both
  const addToCartHandler = async (product) => {
    const existingItem = cart.cartItems.find(
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
    // I use both Modals and toasts for practice...
    toast.success("Product added to cart");
  };

  return (
    <Layout title={"Home Page"}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          />
        ))}
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

// Fetching data from the DB. This function runs before rendering the component
// And provides data for the component (products in this exa,ple) in the form of props as shown above
export async function getServerSideProps() {
  await db.connect();
  // lean option enabled are plain javascript objects, not Mongoose Documents.
  // They have no save method, getters/setters, virtuals, or other Mongoose features.
  const products = await Product.find().lean();
  // Check this disconnect in action, make sure it doesn't do any harm
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocsToObject),
      //products: products
    },
  };
}
