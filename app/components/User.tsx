"use client";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function User() {
  const [user, setUser] = useState<User>();
  const router = useRouter();
  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user);
      if (user) {
        setUser(user);
      }
    }
    getUser();
  }, []);

  return (
    <div className="text-secondary-text">
      {user?.email} //{" "}
      <button
        className="underline"
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}
