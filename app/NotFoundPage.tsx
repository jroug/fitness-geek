import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";

export default function NotFoundPage() {
  return (
    <main className="site-content full-width bg-slate-50 pt-0">
      <PublicHeader />

      <section className="mx-auto w-full max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-sky-950 to-cyan-900 p-8 text-white shadow-2xl md:p-12">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Error 404</p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Page Not Found</h1>
          <p className="mt-4 max-w-2xl text-cyan-100">
            The page you are looking for does not exist or may have been moved.
          </p>
          <div className="mt-7">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100"
            >
              Back To Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
