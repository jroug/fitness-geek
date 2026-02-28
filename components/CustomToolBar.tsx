import React from "react";
import { type NavigateAction } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Link from "next/link";
import { exportWeeklyReportPdf } from "@/lib/exportWeeklyReportPdf";

 
const CustomToolBar: React.FC<CustomToolBarProps> = ({ label, date, onNavigate, calcWeeklyGrades, calcAverageWeeklyWeight, calcNumberOfWeeklyWorkouts, generateWeeklyExportData }) => {
  const nav = (action: NavigateAction) => onNavigate(action);
  const [isSummarizing, setIsSummarizing] = React.useState(false);


  const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(new Date(date));
  // console.log("Start of the week:", startOfWeek.toISOString().split("T")[0]);


  const handleAISummary = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isSummarizing) return;

    setIsSummarizing(true);
    try {
      const exportData = generateWeeklyExportData(startOfWeek);
      const chatQuestion = `Summarize my week (${exportData.weekTitle}) with wins, risks, and next-week actions.`;
      const compactWeekData = {
        weekTitle: exportData.weekTitle,
        summary: exportData.summary,
        days: exportData.days.map((day) => ({
          date: day.date,
          grade: day.grade,
          comment: day.comment,
          weight: day.weight,
          workout: day.workout,
          meals: day.meals.map((meal) => ({
            slot: meal.slot,
            items: meal.items,
          })),
        })),
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a fitness coach. Generate a concise weekly summary with: 1) wins, 2) risks, 3) next-week actions. Keep it under 140 words and use plain text bullet points.",
            },
            {
              role: "user",
              content: `${chatQuestion}\n\nData:\n${JSON.stringify(compactWeekData)}`,
            },
          ],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate AI summary");
      }

      const summaryText =
        typeof data?.answer === "string" && data.answer.trim().length > 0
          ? data.answer.trim()
          : "No summary generated.";

      window.dispatchEvent(
        new CustomEvent("fitness-geek:chatbox-message", {
          detail: {
            question: chatQuestion,
            answer: summaryText,
          },
        })
      );
    } catch (error) {
      console.error("AI summary error:", error);
      const errorText = error instanceof Error ? error.message : "Could not generate AI summary.";
      window.dispatchEvent(
        new CustomEvent("fitness-geek:chatbox-message", {
          detail: {
            question: "Summarize my week with wins, risks, and next-week actions.",
            answer: `I couldn't generate your summary right now. ${errorText}`,
          },
        })
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  
  const handleWeekExport = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await exportWeeklyReportPdf(startOfWeek, generateWeeklyExportData);
  };


  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => nav("PREV")}>← Prev</button>
        <button type="button" onClick={() => nav("TODAY")}>Today</button>
        <button type="button" onClick={() => nav("NEXT")}>Next →</button>
      </span>
      {/* <span className="rbc-btn-group">
        <button type="button" className="show_on_desktop_only" onClick={() => onView(Views.WEEK)}>Week</button>
        <button type="button" className="show_on_mobile_only" onClick={() => onView(Views.DAY)}>Day</button>
      </span> */}
      <span className="rbc-toolbar-label font-bold">{label}</span>

      {/* Custom Button */}
      <span className="rbc-btn-group mr-[50px] show_on_desktop_only">
        <span className="grades-info" >{calcWeeklyGrades(startOfWeek).total} </span>
        <span className="grades-info" >{calcWeeklyGrades(startOfWeek).avg} </span>
        <span className="weight-info" >{calcAverageWeeklyWeight(startOfWeek)} </span>
        <span className="training-info" >{calcNumberOfWeeklyWorkouts(startOfWeek)}</span>
      </span>
      {/* <span className="rbc-btn-group show_on_desktop_only">
            <Link href="/dashboard/add-meal" className="green-link-btn"  >
                + Meal
            </Link>
            <Link href="/dashboard/add-weighing" className="green-link-btn"  >
                + Weighing  
            </Link>
            <Link href="/dashboard/add-workout" className="green-link-btn" >
                + workouts 
            </Link>
      </span> */}
      <span className="rbc-btn-group">
            <Link href="#" onClick={handleWeekExport} className="green-link-btn inline-flex h-9 items-center" >
                Export week 
            </Link>
      </span>
      <span className="rbc-btn-group">
            <Link
              href="#"
              onClick={handleAISummary}
              aria-disabled={isSummarizing}
              className={`green-link-btn inline-flex h-9 items-center gap-2 ${isSummarizing ? "pointer-events-none opacity-70" : ""}`}
            >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3L13.6 7.4L18 9L13.6 10.6L12 15L10.4 10.6L6 9L10.4 7.4L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.5 13.5L19.3 15.7L21.5 16.5L19.3 17.3L18.5 19.5L17.7 17.3L15.5 16.5L17.7 15.7L18.5 13.5Z"
                    fill="currentColor"
                  />
                  <circle cx="7" cy="17" r="1.2" fill="currentColor" />
                </svg>
                {isSummarizing ? "Summarizing..." : "Summary"}
            </Link>
      </span>

    </div>
  );
}

export default CustomToolBar;
