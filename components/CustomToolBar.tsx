import React from "react";
import { type NavigateAction } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Link from "next/link";
import Image from "next/image";
import { exportWeeklyReportPdf } from "@/lib/exportWeeklyReportPdf";
import settingsIcon from "@/public/svg/calendar-settings-custom.svg";
import settingsIconWhite from "@/public/svg/calendar-settings-custom-white.svg";
import closeIcon from "@/public/svg/close-icon.svg";

 
const CustomToolBar: React.FC<CustomToolBarProps> = ({
  label,
  date,
  onNavigate,
  settingsVisible = false,
  onSettingsToggle,
  onSettingsClose,
  isPublished = false,
  handlePublishingCalendar,
  calendarPageUrl = "",
  magicLoginForContributorUrl = "",
  handleCopyLink,
  calcWeeklyGrades,
  calcAverageWeeklyWeight,
  calcNumberOfWeeklyWorkouts,
  generateWeeklyExportData,
}) => {
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
      const weekStart = new Date(startOfWeek);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const formatDate = (d: Date) => d.toISOString().split("T")[0];

      const chatQuestion = `Summarize my week (${formatDate(weekStart)} to ${formatDate(weekEnd)}) with wins, risks, next-week actions, and progress on daily/weekly goals.`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a fitness coach. Generate a concise weekly summary with: 1) wins, 2) risks, 3) next-week actions, 4) progress vs daily/weekly goals. Keep it under 140 words and use plain text bullet points.",
            },
            {
              role: "user",
              content: chatQuestion,
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

  const handleSettingsClick = (e?: React.MouseEvent<HTMLElement>) => {
    e?.preventDefault?.();
    onSettingsToggle?.();
  };
  const closeSettings = () => onSettingsClose?.();

  const onCopyLink = (url: string) => {
    if (handleCopyLink) {
      handleCopyLink(url);
      return;
    }
    navigator.clipboard.writeText(url).catch((err) => {
      console.error("Failed to copy:", err);
    });
  };


  return (
    <>
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={() => nav("PREV")}>← Prev</button>
          <button type="button" onClick={() => nav("TODAY")}>Today</button>
          <button type="button" onClick={() => nav("NEXT")}>Next →</button>
        </span>
        
        <div className="rbc-toolbar-label font-bold">
            <span className="mx-2">{label}</span>        
            <span className={`rounded-full px-2 py-1 text-xs ${isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {isPublished ? "Published" : "Not Published"}
            </span>
            <button
              type="button"
              className="group mx-2 inline-flex items-center !mx-[5px] !px-[5px]"
              onClick={handleSettingsClick}
              aria-label="Calendar settings"
            >
              <span className="relative block h-[18px] w-[18px]">
                <Image
                  src={settingsIcon}
                  alt="Settings"
                  width={18}
                  height={18}
                  className="absolute inset-0 transition-opacity duration-150 group-hover:opacity-0"
                />
                <Image
                  src={settingsIconWhite}
                  alt="Settings"
                  width={18}
                  height={18}
                  className="absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                />
              </span>
            </button>   
        </div>

        <span className="rbc-btn-group mr-[50px] show_on_desktop_only">
          <span className="grades-info" >{calcWeeklyGrades(startOfWeek).avg} </span>
          <span className="weight-info" >{calcAverageWeeklyWeight(startOfWeek)} </span>
          <span className="training-info" >{calcNumberOfWeeklyWorkouts(startOfWeek)}</span>
        </span>
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

      <div
        className={`${settingsVisible ? "" : "hidden"} fixed inset-0 z-[120] bg-black/60 backdrop-blur-[2px] px-4 pt-6`}
        onClick={closeSettings}
      >
        <div
          className="calendar-link-container w-full max-w-[640px] rounded-2xl bg-white px-5 pb-6 pt-5 shadow-xl ring-1 ring-slate-200 mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
            <div className="mb-3 flex items-center justify-between">
                <h1 className="text-lg font-bold text-slate-900">Calendar Settings</h1>
                <button
                    type="button"
                    onClick={closeSettings}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-slate-200"
                    aria-label="Close settings"
                >
                    <Image src={closeIcon} alt="Close" width={16} height={16} />
                </button>
            </div>

            <p className="text-sm text-slate-700">
                Status:{' '}
                <span className={`font-semibold ${isPublished ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {isPublished ? 'Published' : 'Not Published'}
                </span>
            </p>

            <button
                type="button"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                onClick={handlePublishingCalendar}
            >
                {isPublished ? 'Unpublish' : 'Publish'}
            </button>

            <div className="mt-5 space-y-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-sm text-slate-700">
                    <span className="font-semibold">Public URL:</span>{' '}
                    {isPublished && calendarPageUrl ? (
                        <Link href={calendarPageUrl} target="_blank" className="text-cyan-700 underline">
                            Open calendar
                        </Link>
                    ) : (
                        <span className="text-slate-500">Available after publishing</span>
                    )}
                </p>

                <p className="text-sm text-slate-700">
                    <span className="font-semibold">Contributor URL:</span>{' '}
                    {isPublished && magicLoginForContributorUrl ? (
                      <>
                        <Link href={magicLoginForContributorUrl} target="_blank" className="text-cyan-700 underline">
                            Open link
                        </Link>
                        {' · '}
                        <button
                            type="button"
                            onClick={() => onCopyLink(magicLoginForContributorUrl)}
                            className="text-cyan-700 underline"
                        >
                            Copy to Clipboard
                        </button>
                      </>
                    ) : (
                      <span className="text-slate-500">Available after publishing</span>
                    )}
                </p>
            </div>
        </div>
      </div>
      
    </>
  );
}

export default CustomToolBar;
