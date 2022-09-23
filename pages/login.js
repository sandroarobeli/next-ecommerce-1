import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";

// Text-color: text-cyan-700 etc.

export default function LoginScreen() {
  const {
    handleSubmit,
    resetField, // test
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ email, password }) => {
    console.log("email: ", email);
    console.log("password: ", password);
    resetField("email"); // test
    resetField("password"); // test
    //  console.log("formState: ", formState);
  };

  return (
    <Layout title="Login">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-4 text-xl font-semibold">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="w-full"
            id="email"
            autoFocus
            placeholder="Enter email"
            // Registering the parameter with validation options
            {...register("email", {
              // onBlur: (e) => {
              //   if (!e.target.value) {
              //     console.log("Email cannot be empty!");
              //   }
              //   console.log("Passed");
              // }, // test
              onChange: (event) => console.log(event.target.value), // test
              required: "Please enter your email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please provide a valid email",
              },
            })}
          />
          {
            errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            ) /* This expression checks for registered errors with email */
          }
        </div>
        <div className="mb-6">
          <label htmlFor="password">password</label>
          <input
            type="password"
            className="w-full"
            id="password"
            autoFocus
            placeholder="Enter password"
            {...register("password", {
              required: "Please enter password",
              minLength: {
                value: 6,
                message: "Password must exceed 5 characters",
              },
            })}
          />
          {
            errors.password && (
              <div className="text-red-500">{errors.password.message}</div>
            ) /* This expression checks for registered errors with email */
          }
        </div>
        <div className="mb-4">
          <button className="primary-button w-full font-semibold">Login</button>
        </div>
        <div className="mb-4">
          Don&apos;t have an account? &nbsp;
          <Link href={"/register"}>
            <a className="text-cyan-600">Register</a>
          </Link>
        </div>
      </form>
    </Layout>
  );
}
