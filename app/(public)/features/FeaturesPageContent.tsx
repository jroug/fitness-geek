import Link from "next/link";
import PublicFooter from "@/components/PublicFooter";

export default function FeaturesPageContent() {
  return (
    <main className="site-content full-width bg-slate-50 pt-0">
      <section className="relative overflow-hidden">
        <div className="absolute left-[-140px] top-[-140px] h-[360px] w-[360px] rounded-full bg-cyan-400/10 blur-2xl" />
        <div className="absolute right-[-180px] top-[30px] h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-3xl" />

        <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 md:px-6 md:pt-10">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-sky-950 to-cyan-900 px-6 py-10 text-white shadow-2xl md:px-10 md:py-14">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Fitness Geek Features</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              Everything You Need To Track Your Fitness Journey
            </h1>
            <p className="mt-4 max-w-2xl text-base text-cyan-100 md:text-lg">
              From daily logs to trend charts, Fitness Geek gives you one place to monitor progress and stay
              consistent.
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

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Workout Logging",
                text: "Track workouts with calories, duration, and descriptions so your training history is always available.",
              },
              {
                title: "Meal Tracking",
                text: "Record meals and nutrition entries day by day to build better eating consistency over time.",
              },
              {
                title: "Weight Monitoring",
                text: "Log weigh-ins and compare weekly averages to quickly spot meaningful changes.",
              },
              {
                title: "Body Composition",
                text: "Keep fat %, visceral fat, muscle mass, and waist measurements in one clear timeline.",
              },
              {
                title: "Calendar View",
                text: "See all key activities in calendar format for fast daily and weekly planning.",
              },
              {
                title: "Progress Charts",
                text: "Visualize workouts, weight, grades, and body composition with dedicated charts.",
              },
            ].map((feature) => (
              <article key={feature.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-bold text-slate-900">{feature.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Built for Consistency</h2>
            <p className="mt-4 max-w-3xl text-slate-700">
              Fitness Geek is designed to make tracking simple enough to use every day. When your logs are easy to
              maintain, your progress becomes easier to improve.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
        <PublicFooter />
      </section>
    </main>
  );
}
