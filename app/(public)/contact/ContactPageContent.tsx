"use client";

import React, { useState } from "react";
import PublicFooter from "@/components/PublicFooter";

export default function ContactPageContent() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="site-content full-width bg-slate-50 pt-0">
      <section className="relative overflow-hidden">
        <div className="absolute left-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-2xl" />
        <div className="absolute right-[-180px] top-[40px] h-[380px] w-[380px] rounded-full bg-sky-500/10 blur-3xl" />

        <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 md:px-6 md:pt-10">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-sky-950 to-cyan-900 px-6 py-10 text-white shadow-2xl md:px-10 md:py-14">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Contact Fitness Geek</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">Let&apos;s Talk</h1>
            <p className="mt-4 max-w-2xl text-base text-cyan-100 md:text-lg">
              Have questions, suggestions, or feedback? Send us a message using the form below.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900">Send A Message</h2>
              <p className="mt-2 text-sm text-slate-600">This is a dummy form for UI purposes only.</p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-slate-700">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600"
                    placeholder="Write your message..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-sky-700 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-sky-800 hover:to-cyan-700"
                >
                  Send Message
                </button>

                {submitted ? <p className="text-sm font-medium text-emerald-600">Message sent (dummy).</p> : null}
              </form>
            </div>

            <aside className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
              <h3 className="text-xl font-bold text-slate-900">Contact Details</h3>
              <div className="mt-4 space-y-4 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900">Email</p>
                  <p>support@fitness-geek.gr - not a real email</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Office Hours</p>
                  <p>Mon - Fri, 9:00 AM to 5:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Response Time</p>
                  <p>Usually within 1-2 business days.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
        <PublicFooter />
      </section>
    </main>
  );
}
