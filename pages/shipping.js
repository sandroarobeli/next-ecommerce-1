import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import { Store } from "../utilities/Store";
import { getError } from "../utilities/error";

export default function ShippingScreen() {
  const router = useRouter();
  const { redirect } = router.query;

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;
  const { location } = shippingAddress;

  const {
    handleSubmit,
    resetField,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  // To pre fill the data (NEEDS FINE TUNING...)
  useEffect(() => {
    if (location) {
      setValue("fullName", location.fullName);
      setValue("address", location.address);
      setValue("city", location.city);
      setValue("postalCode", location.postalCode);
      setValue("country", location.country);
    }
  }, [setValue, location]);

  const submitHandler = async ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          location: {
            fullName,
            address,
            city,
            postalCode,
            country,
          },
        },
      })
    );

    // Clear the fields... (May not need where we re direct, but is good for future reference)
    resetField("fullName");
    resetField("address");
    resetField("city");
    resetField("postalCode");
    resetField("country");

    router.push("/payment");
  };

  return (
    <Layout title="Sipping Address">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            placeholder="Enter full name"
            // Registering the parameter with validation options
            {...register("fullName", {
              required: "Please enter your full name",
            })}
          />
          {
            errors.fullName && (
              <div className="text-red-500">{errors.fullName.message}</div>
            )
            /* This expression checks for registered errors with fullName */
          }
        </div>
        <div className="mb-4">
          <label htmlFor="address">Address</label>
          <input
            className="w-full"
            id="address"
            autoFocus
            placeholder="Enter address"
            // Registering the parameter with validation options
            {...register("address", {
              required: "Please enter your address",
              minLength: {
                value: 3,
                message: "Must be more than 3 characters",
              },
            })}
          />
          {
            errors.address && (
              <div className="text-red-500">{errors.address.message}</div>
            )
            /* This expression checks for registered errors with address */
          }
        </div>
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            className="w-full"
            id="city"
            autoFocus
            placeholder="Enter city"
            // Registering the parameter with validation options
            {...register("city", {
              required: "Please enter city",
            })}
          />
          {
            errors.city && (
              <div className="text-red-500">{errors.city.message}</div>
            )
            /* This expression checks for registered errors with city */
          }
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            className="w-full"
            id="postalCode"
            autoFocus
            placeholder="Enter postal code"
            // Registering the parameter with validation options
            {...register("postalCode", {
              required: "Please enter postal code",
            })}
          />
          {
            errors.postalCode && (
              <div className="text-red-500">{errors.postalCode.message}</div>
            )
            /* This expression checks for registered errors with postalCode */
          }
        </div>
        <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            className="w-full"
            id="country"
            autoFocus
            placeholder="Enter country"
            // Registering the parameter with validation options
            {...register("country", {
              required: "Please enter country",
            })}
          />
          {
            errors.country && (
              <div className="text-red-500">{errors.country.message}</div>
            )
            /* This expression checks for registered errors with country */
          }
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button w-full font-semibold">Next</button>
        </div>
      </form>
    </Layout>
  );
}

// This ensures that this page is a protected page and only logged in user can access it!
ShippingScreen.auth = true;
