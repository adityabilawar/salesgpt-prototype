import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "@/lib/firebaseClient";
import Layout from '@/components/Layout';

function withLayoutAndAuth(Component: any) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        if (!user) {
          router.push('/login');
        }
      });
      return () => unsubscribe();
    }, []);

    return (
      <Layout>
        <Component {...props} />
      </Layout>
    );
  }
}

export default withLayoutAndAuth;
