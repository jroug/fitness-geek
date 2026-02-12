import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import SideBar from "@/components/SideBar";
import InnerLink from "@/components/InnerLink";
import BodyCompositionPage from "./BodyCompositionPage";

export default function Bodyfat() {
    return (
        <>
            <Header backUrl="/dashboard" title={"Body Composition"} />
            <div className="calendar-link-wrapper" >
                <InnerLink title="Calendar" goToUrl="/calendar" />
            </div>
            <main className="site-content full-width">
                <BodyCompositionPage />
            </main>
            <SideBar />
            <BottomBar />
        </>
    );
}
