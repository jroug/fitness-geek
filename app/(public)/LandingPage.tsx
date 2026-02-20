import Link from "next/link";
import PublicFooter from "@/components/PublicFooter";

type WpPage = {
  id: number;
  title?: { rendered?: string };
  content?: { rendered?: string };
};

export default async function LandingPage() {
  const wpApi = process.env.WORDPRESS_API_URL;
  if (!wpApi) {
    throw new Error("Missing WORDPRESS_API_URL env var");
  }

  const fetchLandingPageDataUrl = `${wpApi.replace(/\/$/, "")}/wp/v2/pages?slug=landingpage&_fields=id,title,content`;
  const response = await fetch(fetchLandingPageDataUrl, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Landing page (${response.status})`);
  }

  const data = (await response.json()) as WpPage[];
  const pageData = data?.[0];

  const pageTitle = pageData?.title?.rendered ?? "Fitness Geek";
  const pageContent = pageData?.content?.rendered ?? "";

  return (
    <main className="site-content full-width bg-slate-50 ">
      <div className="absolute left-[-120px] top-[70px] h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-2xl" />
      <div className="absolute right-[-160px] top-[40px] h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-3xl" />
      <section className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-4 pb-12 md:px-6 ">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-sky-950 to-cyan-900 px-6 py-10 text-white shadow-2xl md:px-10 md:py-14">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border-[30px] border-cyan-400/10" />
            <div className="absolute -right-16 bottom-[-80px] h-64 w-64 rounded-full border-[28px] border-sky-300/10" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Fitness Geek Platform</p>
                <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">{pageTitle}</h1>
                <p className="mt-4 max-w-2xl text-base text-cyan-100 md:text-lg">
                  Plan meals, log workouts, track body composition, and monitor progress with calendar-first insights.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/users/enter"
                    className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100"
                  >
                    Enter App
                  </Link>
                  <Link
                    href="/users/join"
                    className="inline-flex items-center rounded-xl border border-cyan-200/40 bg-cyan-200/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-200/20"
                  >
                    Create Account
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  { label: "Workout Tracking", value: "Daily Logs" },
                  { label: "Nutrition Journal", value: "Meal Insights" },
                  { label: "Body Composition", value: "Trend Charts" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-cyan-100/20 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">{item.label}</p>
                    <p className="mt-1 text-xl font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "Weekly averages and grades in one dashboard",
              "Calendar view with private + shared access links",
              "Weight, workouts, and body composition charts",
            ].map((text) => (
              <article key={text} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-800">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-8">
            <div
              className="landing-page-content text-slate-700 [&_a]:text-cyan-700 [&_a]:underline [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-slate-900 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_p]:leading-7"
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
        <PublicFooter />
      </section>
    </main>
  );
}
