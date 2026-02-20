import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

type WpPage = {
  id: number;
  title?: { rendered?: string };
  content?: { rendered?: string };
};

export default async function LandingPage() {
  const wpApi = process.env.WORDPRESS_API_URL;
  if (!wpApi) {
    throw new Error('Missing WORDPRESS_API_URL env var');
  }

  const fetchLandingPageDataUrl = `${wpApi.replace(/\/$/, '')}/wp/v2/pages?slug=landingpage&_fields=id,title,content`;
  const response = await fetch(fetchLandingPageDataUrl, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Landing page (${response.status})`);
  }

  const data = (await response.json()) as WpPage[];
  const pageData = data?.[0];

  const pageTitle = pageData?.title?.rendered ?? 'Fitness Geek';
  const pageContent = pageData?.content?.rendered ?? '';

  return (
    <main className="site-content full-width bg-slate-50">
      <PublicHeader />

      <section className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 md:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Fitness Geek</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{pageTitle}</h1>
          <p className="mt-2 text-sm text-cyan-100 md:text-base">
            Track workouts, food, and progress in one place.
          </p>
          <div className="mt-5">
            <Link
              href="/users/enter"
              className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100"
            >
              Enter App
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-8">
          <div
            className="landing-page-content text-slate-700 [&_a]:text-cyan-700 [&_a]:underline [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_p]:leading-7"
            dangerouslySetInnerHTML={{ __html: pageContent }}
          />
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
