import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const authStorage = localStorage.getItem("auth");

    if (!authStorage) {
      router.push("/sign-up");
      return;
    }

    const auth = JSON.parse(authStorage);
    axios
      .post("/api/login", { user: auth.user, pass: auth.pass })
      .then(() => router.push("/dashboard"))
      .catch(() => router.push("/login"));
  });
  return <></>;
}
