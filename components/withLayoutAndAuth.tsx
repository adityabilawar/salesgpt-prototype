import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import Layout from "@/components/Layout";

NProgress.configure({ showSpinner: false });

function withLayoutAndAuth(Component: any) {
  return function AuthenticatedComponent(props: any) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      NProgress.start();
      const unsubscribe = onAuthStateChanged(auth, user => {
        if (user) {
          setLoading(false);
          NProgress.done();
        } else {
          router.push("/login");
        }
      });

      return () => {
        NProgress.remove();
        unsubscribe();
      }
    }, []);

    if (loading) {
      return null;
    }

    return (
      <Layout>
        <Component {...props} />
      </Layout>
    );
  };
}

export default withLayoutAndAuth;
