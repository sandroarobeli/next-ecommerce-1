import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext } from "react";
//import { XCircleIcon } from "@heroicons/react/outline";

import Layout from "../components/Layout";
import XCircleIcon from "../components/XCircleIcon";
import { Store } from "../utilities/Store";

export default function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems } = cart;

  const removeFromCartHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const EmptyTheCart = () => {
    dispatch({ type: "CART_EMPTY" });
  };

  console.log("Cart Items: ", cartItems); // test
  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty.{" "}
          <Link href={"/"}>
            <a> Back to shopping</a>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td>
                      <Link href={`/products/${item.slug}`}>
                        <a className="flex items-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </a>
                      </Link>
                    </td>
                    <td className="p-5 text-right">{item.quantity}</td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td
                      className="p-5"
                      onClick={() => removeFromCartHandler(item)}
                    >
                      <XCircleIcon className="h-7 w-7"></XCircleIcon>
                    </td>
                  </tr>
                ))}
                <tr className="border-b bg-amber-100">
                  <td className="py-5 text-left">
                    <h2 className="text-lg font-bold pl-5">Totals: </h2>
                  </td>
                  <td className="p-5 text-right font-bold">
                    {cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </td>
                  <td className="p-5 text-right font-bold">
                    ${cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </td>
                  <td className="p-5" onClick={EmptyTheCart}>
                    <XCircleIcon className="h-7 w-7"></XCircleIcon>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="cart m-3 p-5">
            <div className="mb-3 text-xl">
              Subtotal: ({cartItems.reduce((a, c) => a + c.quantity, 0)}) $
              {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
            </div>
            <button
              className="primary-button w-full"
              onClick={() => router.push("/shipping")}
            >
              Check Out
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
