import AddMeal from "./AddMeal";
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import InnerLink from "@/components/InnerLink";
 
const PageMeals = () => {
 
    return (
        <>
            <Header title="Add Meal" backUrl="/homepage" />
            <main className="site-content form-width">
                <InnerLink title="Calendar" goToUrl="/calendar" />
                <AddMeal  />
            </main>
            <SideBar />
        </>
    );

}
export default PageMeals;