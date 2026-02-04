import CalendarPublic from "./CalendarPublic";
import Header from "@/components/Header";
// import BottomBar from "@/components/BottomBar";
import SideBar from "@/components/SideBar";

interface CalendarPageProps {
  params: any; // Replace 'any' with the actual Params type if available
}

export default function CalendarPage({ params }: CalendarPageProps) {

  return (
    <>
      <main className="site-content full-width">
          <CalendarPublic params={params} />
      </main>
      <SideBar />
      {/* <BottomBar /> */}
    </>
  );
}


         