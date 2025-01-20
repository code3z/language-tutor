"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/supabaseClient"; // adjust import if needed
import Button from "../components/Button";
import { useRouter } from "next/navigation";

function Input({
  type = "email",
  placeholder = "",
  value,
  onChange,
  className = "",
}: {
  type?: string;
  placeholder?: string;
  value: string;
  className?: string;
  onChange: (val: string) => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`outline-primary-text px-6 my-3 py-2.5 bg-white rounded-md shadow text-secondary-text font-normal mr-5 ${className}`}
    />
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user);
      if (user) {
        router.push("/learn/swahili");
      } else {
        console.log("No user found");
      }
    }
    getUser();
  }, [router]);
  
  async function sendMagicLink() {
    const { error } = await supabase.auth.signInWithOtp({ email, options: {emailRedirectTo: window.location.href } });
    if (error) alert("Error sending email");
    else setSent(true);
  }

  return (
    <div className="max-w-sm mx-auto mt-10 flex items-center justify-center min-h-[80vh]">
      <div>
        {sent ? (
          <p className="text-primary-text mt-4">
            We&apos;ve sent you a login link! Please check your inbox.
          </p>
        ) : (
          <>
            <h1 className="block font-serif text-3xl font-medium text-primary-text">
              Sign up or login
            </h1>
            <p className="text-secondary-text my-2 mt-4">
              Enter your email to sign into your account, or create a new one.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMagicLink();
              }}
            >
              <Input
                value={email}
                onChange={setEmail}
                placeholder="Enter your email"
              />
              <Button text="Send" type="submit" small />
            </form>
          </>
        )}
      </div>
    </div>
  );
}
