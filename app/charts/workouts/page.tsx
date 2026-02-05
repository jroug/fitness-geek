import ChartsWorkoputsPage from  "./ChartsWorkoutsPage";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import SideBar from "@/components/SideBar";
import InnerLink from "@/components/InnerLink";

export default function Workouts() {

  return (
    <>
      <Header backUrl="/dashboard" title={"Workouts chart"} />
      <div className="calendar-link-wrapper" >
        <InnerLink title="Calendar" goToUrl="/calendar" />
      </div>
      <main className="site-content full-width">
          <ChartsWorkoputsPage />
      </main>
      <SideBar />
      <BottomBar />
    </>
  );
}