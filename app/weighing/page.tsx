import AddWeighing from "./AddWeighing";
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import InnerLink from "@/components/InnerLink";
 
const PageWeighing = () => {
 
    return (
        <>
            <main className="site-content">
                <Header title="Add Weighing" backUrl="/homepage" />
                <InnerLink title="Calendar" goToUrl="/calendar" />
                <AddWeighing  />
            </main>
            <SideBar />
        </>
    );

}
export default PageWeighing;