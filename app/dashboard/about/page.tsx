import AboutPage from "./AboutPage";

type WpPage = {
  id: number;
  title?: { rendered?: string };
  content?: { rendered?: string };
};

export default async function About() {
  const wpApi = process.env.WORDPRESS_API_URL;
  if (!wpApi) {
    throw new Error("Missing WORDPRESS_API_URL env var");
  }

  const fetchPageDataUrl = `${wpApi.replace(/\/$/, "")}/wp/v2/pages?slug=about&_fields=id,title,content`;

  const response = await fetch(fetchPageDataUrl, {
    // Adjust caching as desired
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch About page (${response.status})`);
  }

  const data = (await response.json()) as WpPage[];
  const pageData = data?.[0];

  const pageTitle = pageData?.title?.rendered ?? "";
  const pageContent = pageData?.content?.rendered ?? "";

  return <AboutPage pageTitle={pageTitle} pageContent={pageContent} />;
}