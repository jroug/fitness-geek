import Image from "next/image";
import Preloader from "../components/Preloader";
import facebook from "../public/images/about-us/facebook.svg";
import instragram from "../public/images/about-us/instragram.svg";
import twitter from "../public/images/about-us/twitter.svg";
import youtube from "../public/images/about-us/youtube.svg";


export default function Home() {
  return (
    <main className="site-content">
        {/* <Preloader/> */}
        <header id="top-header" className="bg-white  py-4">
          <div className="header-wrap space-between">
            <div className="header-name flex justify-start">
              <h1 className="font-['Zen_Dots'] text-lg font-normal">Fitness Geek</h1>
            </div>
            <div className="flex justify-end mt-1" >
            <a href="/users/sign-in" className="" >sign in</a>
            &nbsp;&nbsp;/&nbsp;&nbsp;
            <a href="/users/sign-up" className="" >sign up</a>
            </div>
            
          </div>
        </header>


        <div className="verify-email pb-20" id="about-us">
          <div className="container mx-auto">
            <div className="about-us-section-wrap">

              <div className="about-us-screen-full border-b-2 border-gray-200">
                <div className="max-w-4xl mx-auto bg-white rounded-lg ">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6 mt-4">Your Ultimate Fitness Companion</h2>
                  <p className="text-lg mb-4 leading-relaxed">
                    In today’s fast-paced world, staying on top of your health and fitness goals can be a daunting task. Whether you’re juggling work, family, or other responsibilities, finding the time and motivation to focus on your fitness journey isn’t always easy. Enter <span className="font-semibold">Fitness Geek</span>, the all-in-one fitness app designed to help you track your workouts, monitor your nutrition, set goals, and stay motivated—no matter where you are in your fitness journey.
                  </p>
                  <p className="text-lg mb-4 leading-relaxed">
                    <span className="font-semibold">Fitness Geek</span> is more than just a tracking app. It’s a comprehensive platform that puts all the tools you need to succeed in one place. Whether you’re a seasoned athlete looking to fine-tune your progress or a beginner just starting out, <span className="font-semibold">Fitness Geek</span> offers personalized solutions tailored to your individual fitness goals. With advanced features for workout tracking, nutrition monitoring, and progress visualization, you’ll have everything you need to stay focused and committed to achieving your best self.
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">Personalized Workout Tracking</h2>
                  <p className="text-lg mb-4 leading-relaxed">
                    <span className="font-semibold">Fitness Geek</span> makes it simple to track your workouts and monitor your progress. The app allows you to log exercises, track reps, sets, weights, and cardio sessions with just a few taps. With a vast library of exercises, detailed descriptions, and video tutorials, the app ensures you perform every movement correctly and efficiently. Plus, you can customize your workout plans based on your fitness level and specific goals, be it strength training, weight loss, endurance, or flexibility. Whether you're hitting the gym or doing a home workout, <span className="font-semibold">Fitness Geek</span> is your personal trainer in your pocket, guiding you through each step.
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">Nutrition Tracking and Meal Planning</h2>
                  <p className="text-lg mb-4 leading-relaxed">
                    Proper nutrition is the foundation of any successful fitness program. With <span className="font-semibold">Fitness Geek</span>, you can easily log your daily meals and track your macronutrients (carbs, fats, and proteins) to ensure you're meeting your dietary goals. The app’s comprehensive food database allows you to quickly add foods or scan barcodes, providing instant nutritional information. You can also set daily caloric goals, create meal plans, and even explore curated meal suggestions based on your fitness objectives. Whether you’re bulking up, cutting down, or maintaining your physique, <span className="font-semibold">Fitness Geek</span> ensures your nutrition stays on point.
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">Goal Setting and Progress Tracking</h2>
                  <p className="text-lg mb-4 leading-relaxed">
                    Setting and achieving fitness goals has never been easier. With <span className="font-semibold">Fitness Geek</span>, you can establish personalized fitness goals—whether it’s losing weight, building muscle, or improving endurance. You can break these goals down into smaller, manageable milestones to keep yourself on track. The app offers detailed reports and progress charts, making it easy to visualize your journey and celebrate your achievements along the way. You’ll know exactly how far you’ve come and what’s needed to continue progressing.
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">Stay Engaged with Community Challenges</h2>
                  <p className="text-lg mb-4 leading-relaxed">
                    Fitness is more fun when you’re not doing it alone, and <span className="font-semibold">Fitness Geek</span> fosters a strong sense of community by allowing users to join fitness challenges, compete with friends, and share their successes. Whether you’re participating in monthly challenges or engaging with friends to stay accountable, <span className="font-semibold">Fitness Geek</span> helps you stay motivated and connected with like-minded fitness enthusiasts.
                  </p>
                  <p className="text-lg mt-6 leading-relaxed">
                    In conclusion, <span className="font-semibold">Fitness Geek</span> is your one-stop solution for managing all aspects of your fitness journey. From customized workouts to detailed nutrition tracking and progress monitoring, <span className="font-semibold">Fitness Geek</span> provides everything you need to stay on track and crush your fitness goals. Download <span className="font-semibold">Fitness Geek</span> today and embark on the path to a healthier, fitter, and stronger you!
                  </p>
                </div>
              </div>

              <div className="about-us-social-media">
                <h1 className="text-2xl font-bold mt-16">Follow Us</h1>
                <div className="about-us-icon-wrapper mt-12 flex">
                  
                  <div className="social-detail-about flex flex-col items-center">
                    <div className="shape facebook-bg bg-blue-600 p-4 rounded-full">
                      <a href="https://www.facebook.com/" target="_blank">
                        <Image src={facebook} alt="facebook" />
                      </a>
                    </div>
                    <div>
                      <p className="text-xs font-medium mt-2 text-center">Facebook</p>
                    </div>
                  </div>
                  <div className="social-detail-about flex flex-col items-center">
                    <div className="shape instragram-bg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4 rounded-full">
                      <a href="https://www.instagram.com/" target="_blank">
                        <Image src={instragram} alt="instagram" />
                      </a>
                    </div>
                    <div>
                      <p className="text-xs font-medium mt-2 text-center">Instagram</p>
                    </div>
                  </div>
                  <div className="social-detail-about flex flex-col items-center">
                    <div className="shape twitter-bg bg-blue-400 p-4 rounded-full">
                      <a href="https://twitter.com/" target="_blank">
                        <Image src={twitter} alt="twitter" />
                      </a>
                    </div>
                    <div>
                      <p className="text-xs font-medium mt-2 text-center">Twitter</p>
                    </div>
                  </div>
                  <div className="social-detail-about flex flex-col items-center">
                    <div className="shape youtube-bg bg-red-600 p-4 rounded-full">
                      <a href="https://www.youtube.com/" target="_blank">
                        <Image src={youtube} alt="youtube" />
                      </a>
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
