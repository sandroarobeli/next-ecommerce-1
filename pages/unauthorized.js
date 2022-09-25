import React from "react";
import { useRouter } from "next/router";

import Layout from "../components/Layout";

// This format /some-route is done so we can redirect AND EXTRACT AN ERROR MESSAGE!!!
export default function Unauthorized() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <Layout title="Unauthorized Page">
      <h1 className="text-xl">Access Denied</h1>
      {message && <div className="mb-4 text-red-500">{message}</div>}
    </Layout>
  );
}
