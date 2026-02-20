// import { headers } from "next/headers";

import CalendarPrivatePageDesktop from "./CalendarPrivatePageDesktop";
// import CalendarPrivatePageMobile from "./CalendarHomePrivateMobile";

// function isMobileUA(ua: string) {
//   // Simple heuristic. Not perfect, but good enough for “don’t ship big calendar to phones”.
//   return /Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(ua);
// }

export default async function CalendarPage() {
  // const ua = (await headers()).get("user-agent") ?? "";
  // const isMobile = isMobileUA(ua);
  // console.log("User agent:", ua, "isMobile:", isMobile);
  return (
    <>
      <main className="site-content full-width">
        <CalendarPrivatePageDesktop />
      </main>
    </>
  );
}
