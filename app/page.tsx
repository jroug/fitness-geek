import Image from "next/image";
import Link from 'next/link';
// import Loading from "../components/Loading";
import facebook from "../public/images/about-us/facebook.svg";
import instragram from "../public/images/about-us/instragram.svg";
import twitter from "../public/images/about-us/twitter.svg";
import youtube from "../public/images/about-us/youtube.svg";

 
export default async function LandingPage() {

  // server side component no need to call node API
 
  const fetchLandingPageDataUrl = `${process.env.WORDPRESS_API_URL}/wp/v2/pages?slug=landingpage&_fields=id,title,content`;
  // console.log('fetchLandingPageDataUrl', fetchLandingPageDataUrl);
  const response = await fetch(fetchLandingPageDataUrl);
  const data = await response.json();
  const pageData = data[0];

  

  return (
    <main className="site-content">
        {/* <Loading/> */}
        <header id="top-header" className="bg-white  py-4">
          <div className="justify-between header-wrap space-between">
            <div className="flex header-name justify-start">
              <h1 className="font-['Zen_Dots'] text-lg font-normal">Fitness Geek</h1>
            </div>
            <div className="flex justify-end" >
            <Link href="/users/sign-in" className="" >sign in</Link>
            &nbsp;&nbsp;/&nbsp;&nbsp;
            <Link href="/users/sign-up" className="" >sign up</Link>
            </div>
          </div>
        </header>


        <div className="verify-email pb-20" id="about-us">
          <div className="container mx-auto">
            <div className="about-us-section-wrap">

              <div className="about-us-screen-full border-b-2 border-gray-200">
                <div className="max-w-4xl mx-auto bg-white rounded-lg ">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6 mt-4">{pageData.title.rendered}</h2>
                  <div className="landing-page-content" dangerouslySetInnerHTML={{ __html: pageData.content.rendered }} />
                   
                </div>
              </div>

              <div className="about-us-social-media">
                <h1 className="text-2xl font-bold mt-16">Follow Us</h1>
                <div className="about-us-icon-wrapper mt-12 flex">
                  
                  <div className="social-detail-about flex flex-col items-center">
                    <div className="shape facebook-bg bg-blue-600 p-4 rounded-full">
                      <Link href="https://www.facebook.com/" target="_blank">
                        <Image src={facebook} alt="facebook" />
                      </Link>
                    </div>
                    <div>
                      <p className="text-xs font-medium mt-2 text-center">Facebook</p>
                    </div>
                  </div>
                  <div className="social-detail-about flex flex-col items-center">
                    <div className="shape instragram-bg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4 rounded-full">
                      <Link href="https://www.instagram.com/" target="_blank">
                        <Image src={instragram} alt="instagram" />
                      </Link>
                    </div>
                    <div>
                      <p className="text-xs font-medium mt-2 text-center">Instagram</p>
                    </div>
                  </div>
                  <div className="social-detail-about flex flex-col items-center">
                    <div className="shape twitter-bg bg-blue-400 p-4 rounded-full">
                      <Link href="https://twitter.com/" target="_blank">
                        <Image src={twitter} alt="twitter" />
                      </Link>
                    </div>
                    <div>
                      <p className="text-xs font-medium mt-2 text-center">Twitter</p>
                    </div>
                  </div>
                  <div className="social-detail-about flex flex-col items-center">
                    <div className="shape youtube-bg bg-red-600 p-4 rounded-full">
                      <Link href="https://www.youtube.com/" target="_blank">
                        <Image src={youtube} alt="youtube" />
                      </Link>
                    </div>
                    <div>
                      <p className="text-xs font-medium mt-2 text-center">YouTube</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

		</main>
  );
}


 
