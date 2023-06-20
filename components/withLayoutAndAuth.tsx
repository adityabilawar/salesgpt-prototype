import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import Layout from "@/components/Layout";

function withLayoutAndAuth(Component: any) {
  return function AuthenticatedComponent(props: any) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        if (user) {
          setLoading(false);
        } else {
          router.push("/login");
        }
      });

      return () => unsubscribe();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <Layout>
        <Component {...props} />
      </Layout>
    );
  };
}

export default withLayoutAndAuth;
