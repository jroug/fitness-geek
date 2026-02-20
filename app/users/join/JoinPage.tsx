"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import fitness_geek_logo from "../../../public/images/logo/fitness-geek-logo-fresh.svg";
import google_icon from "../../../public/svg/google-icon.svg";
import fb_icon from "../../../public/svg/fb-icon.svg";

export default function JoinPage() {
  const [inputName, setInputName] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Sign up flow will be connected soon.");
  };

  return (
    <main className="pt-0">
      <div className="grid min-h-screen xl:grid-cols-[900px_1fr]">
        <section className="bg-[#f4f5f7] px-6 py-10 sm:px-10 lg:px-12">
          <div className="mx-auto flex h-full w-full max-w-[420px] flex-col justify-center">
            <div className="mb-8">
              <Link href="/" className="mb-5 inline-flex">
                <Image src={fitness_geek_logo} alt="Fitness Geek logo" className="h-11 w-auto object-contain" />
              </Link>
              <h1 className="text-4xl font-bold text-slate-900">Create Account</h1>
              <p className="mt-2 text-sm text-slate-500">Join Fitness Geek and start tracking your progress.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <Image src={google_icon} alt="Google" className="h-4 w-4" />
                Google
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <Image src={fb_icon} alt="Facebook" className="h-4 w-4" />
                Facebook
              </button>
            </div>

            <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
              <div className="h-px flex-1 bg-slate-300" />
              <span>or create account with email</span>
              <div className="h-px flex-1 bg-slate-300" />
            </div>

            <form className="space-y-4" onSubmit={handleSignUpSubmit}>
              <div>
                <label htmlFor="full-name" className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full-name"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600"
                  autoComplete="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="flex items-center rounded-lg border border-slate-300 bg-white px-3 focus-within:border-cyan-600">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full py-2.5 text-sm text-slate-900 outline-none"
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirm-password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600"
                  value={inputConfirmPassword}
                  onChange={(e) => setInputConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-sky-700 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-sky-800 hover:to-cyan-700"
              >
                Create Account
              </button>
            </form>

            <div className="mt-4 min-h-[20px]">
              <p className="text-sm text-cyan-700">{message}</p>
            </div>

            <p className="mt-2 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/users/enter" className="font-semibold text-cyan-700 hover:text-cyan-600">
                Sign In
              </Link>
            </p>
          </div>
        </section>

        <section className="relative hidden overflow-hidden bg-[#032846] text-white xl:flex lg:items-center">
          <div className="absolute left-[-140px] top-[-140px] h-[460px] w-[460px] rounded-full border-[70px] border-[#0a3766]/70" />
          <div className="absolute left-[-30px] top-[-20px] h-[250px] w-[250px] rounded-full bg-[#05223d]" />

          <div className="relative z-10 mx-auto w-full max-w-[560px] px-12">
            <h2 className="text-6xl font-bold leading-tight">
              Build Better
              <br />
              Fitness Habits
            </h2>
            <p className="mt-6 max-w-[420px] text-xl text-slate-200">
              Create your account to unlock workout logs, meal history, and progress tracking designed for long-term
              consistency.
            </p>
            <Link
              href="/features"
              className="mt-8 inline-flex items-center rounded-lg bg-[#7FD83B] px-6 py-3 text-base font-semibold text-[#032846] transition hover:bg-[#92e854]"
            >
              See Features
            </Link>
          </div>

          <div className="absolute bottom-[-40px] right-[-20px] opacity-25">
            <Image src={fitness_geek_logo} alt="Fitness Geek mark" className="h-48 w-auto" />
          </div>
        </section>
      </div>
    </main>
  );
}
