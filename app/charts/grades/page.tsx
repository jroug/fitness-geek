import ChartsGradesPage from "./ChartsGradesPage";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import SideBar from "@/components/SideBar";
import InnerLink from "@/components/InnerLink";

export default function Grades() {
  const pageTitle = "Grades chart";

  return (
    <>
      <Header backUrl="/homepage" title={pageTitle} />
      <div className="calendar-link-wrapper" >
        <InnerLink title="Calendar" goToUrl="/calendar" />
      </div>
      <main className="site-content full-width">
          <ChartsGradesPage />
      </main>
      <SideBar />
      <BottomBar />
    </>
  );
}