import AddBodyComposition from "./AddBodyComposition";
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import InnerLink from "@/components/InnerLink";
 
const PageBodyComposition = () => {
 
    return (
        <>
            <Header title="Add Body Composition" backUrl="/dashboard" />
            <main className="site-content form-width">
                <InnerLink title="Calendar" goToUrl="/calendar" />
                <AddBodyComposition />
            </main>
            <SideBar />
        </>
    );

}
export default PageBodyComposition;
