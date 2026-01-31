// import Image from "next/image";
// import Link from 'next/link';
// import Loading from "../components/Loading";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

 
export default async function LandingPage() {

  // server side component no need to call node API
 
  const fetchLandingPageDataUrl = `${process.env.WORDPRESS_API_URL}/wp/v2/pages?slug=landingpage&_fields=id,title,content`;
  // console.log('fetchLandingPageDataUrl', fetchLandingPageDataUrl);
  const response = await fetch(fetchLandingPageDataUrl);
  const data = await response.json();
  const pageData = data[0];
  // console.log('pageData', pageData);
  
  return (
    <main className="site-content">
        {/* <Loading/> */}
        <PublicHeader />
        <div className="verify-email pb-20" id="about-us">
          <div className="container mx-auto">
            <div className="about-us-section-wrap">
              <div className="about-us-screen-full border-b-2 border-gray-200">
                <div className="max-w-4xl mx-auto bg-white rounded-lg ">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6 mt-4">{pageData.title.rendered}</h2>
                  <div className="landing-page-content" dangerouslySetInnerHTML={{ __html: pageData.content.rendered }} />
                </div>
              </div>
              <PublicFooter />
            </div>
          </div>
        </div>
		</main>
  );
}


 
