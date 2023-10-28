import React, { useRef } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Spinner from "../../Components/spinner/spinner";

export interface NextAuthRes {
  error: null | string;
  status: number;
  ok: boolean;
  url: string;
}

const AdminLogin = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const emailInput = useRef<HTMLInputElement | null>(null);
  const passwordInput = useRef<HTMLInputElement | null>(null);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!emailInput.current!.value || !passwordInput.current!.value) {
      return;
    }
    let email = emailInput.current!.value;
    let password = passwordInput.current!.value;
    const res: any = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (!res.error) {
      router.replace("/admin/dashboard");
    }
  };
  if (session) {
    router.replace("/admin/dashboard");
  }
  return (
    <div className="h-screen w-full flex justify-center items-center p-8">
      <form
        onSubmit={submitHandler}
        className="font-semibold bg-slate-50 h-fit w-96 rounded p-4 shadow-2xl flex flex-col gap-8 justify-center items-center border-t boder-b border-l border-r border-zinc-50"
      >
        <div className="text-2xl font-semibold">Login:</div>
        <div className="flex flex-col gap-2 w-5/6">
          <label>Email Address:</label>
          <input
            className="signUpFormTextInput"
            type="text"
            placeholder="Username"
            ref={emailInput}
          />
        </div>
        <div className="flex flex-col gap-2 w-5/6">
          <label>Password:</label>
          <input
            className="signUpFormTextInput"
            type="password"
            placeholder="Password"
            ref={passwordInput}
          />
        </div>
        <div className="flex flex-col gap-2 pb-2 w-5/6">
          <button type="submit" className="submitButton">
            Login
          </button>
        </div>
        {/* {loginError && (
            <span className="text-red-600 text-center text-sm font-semibold">
              Incorrect username or password
            </span>
          )} */}
      </form>
    </div>
  );
};

export default AdminLogin;
