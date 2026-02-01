import Homepage from "./Homepage";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import SideBar from "@/components/SideBar";

const page = () => {
    return (
        <>
            <main className="site-content">
                <Header homeUrl="/homepage" title="FITNESS GEEK" />
                <Homepage />
            </main>
            <BottomBar />
            <SideBar />
        </>
    )
}

export default page;