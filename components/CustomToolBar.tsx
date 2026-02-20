import React from "react";
import { type NavigateAction } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Link from "next/link";
import { jsPDF } from "jspdf";

let arialRegularFontBase64Cache: string | null = null;
let arialBoldFontBase64Cache: string | null = null;

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
};

const loadUnicodeFont = async (doc: jsPDF) => {
  if (!arialRegularFontBase64Cache) {
    const regularResponse = await fetch("/fonts/Arial.ttf");
    if (!regularResponse.ok) {
      throw new Error("Unable to load Arial.ttf");
    }
    const regularBuffer = await regularResponse.arrayBuffer();
    arialRegularFontBase64Cache = bytesToBase64(new Uint8Array(regularBuffer));
  }

  if (!arialBoldFontBase64Cache) {
    const boldResponse = await fetch("/fonts/Arial-Bold.ttf");
    if (!boldResponse.ok) {
      throw new Error("Unable to load Arial-Bold.ttf");
    }
    const boldBuffer = await boldResponse.arrayBuffer();
    arialBoldFontBase64Cache = bytesToBase64(new Uint8Array(boldBuffer));
  }

  doc.addFileToVFS("Arial-Regular.ttf", arialRegularFontBase64Cache);
  doc.addFileToVFS("Arial-Bold.ttf", arialBoldFontBase64Cache);
  doc.addFont("Arial-Regular.ttf", "ArialUnicode", "normal");
  doc.addFont("Arial-Bold.ttf", "ArialUnicode", "bold");
};

 
const CustomToolBar: React.FC<CustomToolBarProps> = ({ label, date, onNavigate, calcWeeklyGrades, calcAverageWeeklyWeight, calcNumberOfWeeklyWorkouts, generateWeeklyExportData }) => {
  const nav = (action: NavigateAction) => onNavigate(action);
  const orderedMealSlots = ["Breakfast", "Morning Snack", "Lunch", "Afternoon Snack", "Post Workout", "Dinner"] as const;
  const normalizeSlot = (slot: string) => slot.trim().toLowerCase().replace(/\s+/g, " ");


  const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(new Date(date));
  // console.log("Start of the week:", startOfWeek.toISOString().split("T")[0]);

  const handleWeekExport = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const exportData = generateWeeklyExportData(startOfWeek);
    const weekRangeForFilename = startOfWeek.toISOString().split("T")[0];

    const doc = new jsPDF({ orientation: "l", unit: "mm", format: "a4" });
    let useUnicodeFont = true;
    try {
      await loadUnicodeFont(doc);
    } catch (error) {
      useUnicodeFont = false;
      console.error("Could not load Unicode font for PDF export:", error);
      alert("Could not load Unicode font. PDF may not render Greek text correctly.");
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageMargin = 4;
    const gridX = pageMargin;
    const gridY = pageMargin;
    const gridW = pageWidth - pageMargin * 2;
    const gridH = pageHeight - pageMargin * 2;
    const headerH = 7;
    const infoRowH = 18;
    const mealRows = 6;
    const mealRowH = (gridH - headerH - infoRowH) / mealRows;
    const colW = gridW / 7;
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const drawCellText = (
      text: string,
      x: number,
      y: number,
      w: number,
      h: number,
      bold = false,
      fontSize = 7,
      align: "left" | "center" = "left"
    ) => {
      const innerPadding = 1.8;
      doc.setFont(useUnicodeFont ? "ArialUnicode" : "helvetica", bold ? "bold" : "normal");
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, w - innerPadding * 2) as string[];
      const maxLines = Math.max(1, Math.floor((h - innerPadding * 2) / 3.4));
      const clipped = lines.slice(0, maxLines);
      clipped.forEach((line, idx) => {
        const textY = y + innerPadding + 2.5 + idx * 3.4;
        if (align === "center") {
          doc.text(line, x + w / 2, textY, { align: "center" });
          return;
        }
        doc.text(line, x + innerPadding, textY);
      });
    };

    // Page light-gray background (template style)
    doc.setFillColor(244, 244, 244);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Outer border
    doc.setDrawColor(148, 148, 148);
    doc.setLineWidth(0.3);
    doc.rect(gridX, gridY, gridW, gridH);

    // Header background
    doc.setFillColor(232, 232, 232);
    doc.rect(gridX, gridY, gridW, headerH, "F");

    // Horizontal lines (1 compact info row + 6 meal rows)
    const infoRowBottomY = gridY + headerH + infoRowH;
    doc.line(gridX, infoRowBottomY, gridX + gridW, infoRowBottomY);
    for (let row = 1; row <= mealRows; row++) {
      const y = infoRowBottomY + row * mealRowH;
      doc.line(gridX, y, gridX + gridW, y);
    }

    // Vertical lines
    for (let col = 1; col <= 6; col++) {
      const x = gridX + col * colW;
      doc.line(x, gridY, x, gridY + gridH);
    }

    // Header labels
    weekDays.forEach((weekDay, col) => {
      const x = gridX + col * colW;
      drawCellText(weekDay, x, gridY, colW, headerH, true, 9.2, "center");
    });

    // Fill each day column in a row-based style matching the template grid
    exportData.days.forEach((day, col) => {
      const x = gridX + col * colW;
      const dateLabel = day.date.split(",").slice(1).join(",").trim() || day.date;
      const mealsBySlot = new Map<string, string>();
      day.meals.forEach((meal) => {
        const normalized = normalizeSlot(meal.slot);
        const text = "-" + meal.items.join("\n-") || "N/A";
        const existing = mealsBySlot.get(normalized);
        mealsBySlot.set(normalized, existing ? `${existing} | ${text}` : text);
      });

      // drawCellText(dateLabel || day.date, x, gridY + headerH, colW, infoRowH, true, 7.1);
      // drawCellText(`Grade: ${day.grade}`, x, gridY + headerH + rowH * 1, colW, rowH, false, 6.8);
      // drawCellText(`Weight: ${day.weight}\nWorkout: ${day.workout}`, x, gridY + headerH + rowH * 2, colW, rowH, false, 6.6);
      // drawCellText(`Comment: ${day.comment}`, x, gridY + headerH + rowH * 3, colW, rowH, false, 6.6);

      // compact info cell below weekday (bold labels only)
      const infoY = gridY + headerH;
      const infoLineH = infoRowH / 3;
      const labelX = x + 1.8;
      const valueX = x + 12;
      const lineBaseOffset = 3.2;
      doc.setFontSize(5.8);

      doc.setFont(useUnicodeFont ? "ArialUnicode" : "helvetica", "bold");
      doc.text("Date:", labelX, infoY + lineBaseOffset);
      doc.setFont(useUnicodeFont ? "ArialUnicode" : "helvetica", "normal");
      doc.text(dateLabel, valueX, infoY + lineBaseOffset);

      doc.setFont(useUnicodeFont ? "ArialUnicode" : "helvetica", "bold");
      doc.text("Workout:", labelX, infoY + infoLineH + lineBaseOffset);
      doc.setFont(useUnicodeFont ? "ArialUnicode" : "helvetica", "normal");
      const workoutLines = doc.splitTextToSize(day.workout || "N/A", colW - (valueX - x) - 1.8) as string[];
      workoutLines.slice(0, 2).forEach((line, idx) => {
        doc.text(line, valueX, infoY + infoLineH + lineBaseOffset + idx * 2.8);
      });

      doc.setFont(useUnicodeFont ? "ArialUnicode" : "helvetica", "bold");
      doc.text("Weight:", labelX, infoY + infoLineH * 2 + lineBaseOffset);
      doc.setFont(useUnicodeFont ? "ArialUnicode" : "helvetica", "normal");
      doc.text(day.weight, valueX, infoY + infoLineH * 2 + lineBaseOffset);

      // add all 6 meals in separate rows
      for (let mealIndex = 0; mealIndex < 6; mealIndex++) {
        const mealCellY = gridY + headerH + infoRowH + mealRowH * mealIndex;
        const slotLabel = orderedMealSlots[mealIndex];
        const mealText = mealsBySlot.get(normalizeSlot(slotLabel)) || "N/A";
        const mealX = x + 1.8;
        const mealY = mealCellY + 3.7;

        doc.setFontSize(6.4);
        doc.setFont(useUnicodeFont ? "ArialUnicode" : "helvetica", "bold");
        doc.text(`${slotLabel}:`, mealX, mealY);

        doc.setFont(useUnicodeFont ? "ArialUnicode" : "helvetica", "normal");
        const wrappedMealText = doc.splitTextToSize(mealText, colW - 3.6) as string[];
        const mealTextMaxLines = Math.max(1, Math.floor((mealRowH - 5) / 3.1));
        wrappedMealText.slice(0, mealTextMaxLines).forEach((line, idx) => {
          doc.text(line, mealX, mealY + 3.1 + idx * 3.1);
        });
      }

    });

    doc.save(`weekly-report-${weekRangeForFilename}.pdf`);
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
            <Link href="#" onClick={handleWeekExport} className="green-link-btn" >
                Export week 
            </Link>
      </span>


    </div>
  );
}

export default CustomToolBar;
