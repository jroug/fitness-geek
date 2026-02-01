import CalendarHomePage from "./CalendarHomePage";
import Header from "@/components/Header";
// import BottomBar from "@/components/BottomBar";
import SideBar from "@/components/SideBar";

export default function CalendarPage() {

  return (
    <>
      <Header backUrl="/homepage" title={"Calendar"} />
      <main className="site-content full-width">
          <CalendarHomePage />
      </main>
      <SideBar />
      {/* <BottomBar /> */}
    </>
  );
}


         