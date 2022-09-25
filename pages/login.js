import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import { getError } from "../utilities/error";

export default function LoginScreen() {
  const router = useRouter();
  const { redirect } = router.query;

  const { data: session } = useSession();

  // Checks on every page reload if the user is already signed in..
  useEffect(() => {
    // If this exists, the user is already signed in. So we redirect..
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    resetField,
    register,
    formState: { errors },
  } = useForm();

  const onLoginSubmit = async ({ email, password }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      resetField("email");
      resetField("password");

      if (result.error) {
        console.log(result.error); // test
        toast.error(result.error);
      }
    } catch (error) {
      // Probably code 500 type of error
      console.log(error); // test
      toast.error(getError(error));
    }
  };

  const onGitSubmit = () => {
    signIn("github");
  };

  return (
    <Layout title="Login">
      {/* THIS SEGMENT HANDLES CREDENTIALS LOGIN */}
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(onLoginSubmit)}
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
            ) /* This expression checks for registered errors with password */
          }
        </div>
        <div className="mb-4">
          <button className="primary-button w-full font-semibold">Login</button>
        </div>
      </form>
      {/* THIS SEGMENT HANDLES GITHUB LOGIN */}
      <div className="mx-auto max-w-screen-md">
        <div className="mt-6 mb-6 mx-auto flex flex-row justify-center items-center">
          <hr className="w-2/5 bg-slate-900 mt-2 mb-2" />
          <h2 className="font-serif mx-5 text-slate-500 text-xl">Or</h2>
          <hr className="w-2/5 bg-slate-900 mt-2 mb-2" />
        </div>
        <div className="mb-4">
          <button
            type="button"
            className="rounded bg-blue-300 py-2 px-4 shadow outline-none hover:bg-blue-400 active:bg-blue-500 w-full font-semibold"
            onClick={onGitSubmit}
          >
            Login with GitHub
          </button>
        </div>
        <div className="mb-4">
          Don&apos;t have an account? &nbsp;
          <Link href={"/register"}>
            <a className="text-cyan-600">Register</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
