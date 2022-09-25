import React, { useContext, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Store } from "../utilities/Store";

export default function Layout({ title, children }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const { status, data: session } = useSession();
  // status: "loading" | "authenticated" | "unauthenticated"
  // session: This can be three values: Session / undefined / null

  // Retrieves cart items count from dynamically rendered cart and updated the badge icon
  // Again as a refresher, useEffect only works Client side!
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems, dispatch]);

  return (
    <>
      <Head>
        <title>{title ? title + " | E-Commerce" : "E-Commerce"}</title>
        <meta name="description" content="E-Commerce website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />
      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-16 px-4 justify-between items-center shadow-md">
            <Link href={"/"}>
              <a className="text-lg font-extrabold">E-Commerce</a>
            </Link>
            <div>
              <Link href={"/cart"}>
                <a className="px-2">
                  Cart
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                    {
                      // Reflects updated current count
                      cartItemsCount
                      //cart.cartItems.reduce((a, c) => a + c.quantity, 0)
                    }
                  </span>
                </a>
              </Link>
              {status === "loading" ? (
                "Loading..."
              ) : session?.user ? (
                session.user.name
              ) : (
                <Link href={"/login"}>
                  <a className="p-2">Login</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex justify-center items-center h-12 shadow-inner">
          <h2 className="text-base font-semibold">
            Copyright &copy; {new Date().getFullYear()} E-Commerce
          </h2>
        </footer>
      </div>
    </>
  );
}
