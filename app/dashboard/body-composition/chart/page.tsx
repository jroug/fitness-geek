import BottomBar from "@/components/BottomBar";
import BodyCompositionChart from "./BodyCompositionChart";

export default function Bodyfat() {
    return (
        <>
            <main className="site-content full-width">
                <BodyCompositionChart />
            </main>
            <BottomBar />
        </>
    );
}
