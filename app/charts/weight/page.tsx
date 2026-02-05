import ChartsWeighingPage from "./ChartsWeighingPage";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import SideBar from "@/components/SideBar";
import InnerLink from "@/components/InnerLink";

export default function Weight() {

  return (
    <>
      <Header backUrl="/dashboard" title={"Weighing chart"} />
      <div className="calendar-link-wrapper" >
        <InnerLink title="Calendar" goToUrl="/calendar" />
      </div>
      <main className="site-content full-width">
          <ChartsWeighingPage />
      </main>
      <SideBar />
      <BottomBar />
    </>
  );
}