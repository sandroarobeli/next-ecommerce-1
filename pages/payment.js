import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import { Store } from "../utilities/Store";

export default function PaymentScreen() {
  const router = useRouter();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;
  const { location } = shippingAddress;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    if (!location.address) {
      return router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod || "");
  }, [paymentMethod, router, location.address]);

  const submitHandler = (event) => {
    event.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error("Payment method is required");
    }

    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });

    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );

    router.push("/placeorder");
  };

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {["PayPal", "Stripe", "C.O.D."].map((method) => (
          <div key={method} className="mb-4">
            <input
              type="radio"
              id={method}
              name="paymentMethod"
              className="p-2 outline-none focus:ring-0"
              checked={selectedPaymentMethod === method}
              onChange={() => setSelectedPaymentMethod(method)}
            />
            <label htmlFor={method} className="p-2">
              {method}
            </label>
          </div>
        ))}
        <div className="mb-4 flex justify-between">
          <button
            type="button" // This is type='button' because it DOESN'T submit!
            className="default-button"
            onClick={() => router.push("/shipping")}
          >
            Back
          </button>
          <button
            type="submit" // This is type='submit' because it SUBMITS!
            className="primary-button"
          >
            Next
          </button>
        </div>
      </form>
    </Layout>
  );
}
