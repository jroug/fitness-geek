import CalendarPublic from "./CalendarPublic";
// import Header from "@/components/Header";
// import BottomBar from "@/components/BottomBar";
 
type Params = Promise<{ jr_token: string }>


export default function CalendarPage({ params }: { params: Params }) {

  return (
    <>
      <CalendarPublic params={params} />
      {/* <BottomBar /> */}
    </>
  );
}


         
