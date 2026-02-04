import CalendarPublic from "./CalendarPublic";
// import Header from "@/components/Header";
// import BottomBar from "@/components/BottomBar";
import SideBar from "@/components/SideBar";
 
type Params = Promise<{ jr_token: string }>


export default function CalendarPage({ params }: { params: Params }) {

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


         