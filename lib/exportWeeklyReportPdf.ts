import { jsPDF } from "jspdf";

let arialRegularFontBase64Cache: string | null = null;
let arialBoldFontBase64Cache: string | null = null;

const orderedMealSlots = ["Breakfast", "Morning Snack", "Lunch", "Afternoon Snack", "Post Workout", "Dinner"] as const;

const normalizeSlot = (slot: string) => slot.trim().toLowerCase().replace(/\s+/g, " ");

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

export const exportWeeklyReportPdf = async (
  startOfWeek: Date,
  generateWeeklyExportData: CustomToolBarProps["generateWeeklyExportData"]
) => {
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

  doc.setFillColor(244, 244, 244);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setDrawColor(148, 148, 148);
  doc.setLineWidth(0.3);
  doc.rect(gridX, gridY, gridW, gridH);

  doc.setFillColor(232, 232, 232);
  doc.rect(gridX, gridY, gridW, headerH, "F");

  const infoRowBottomY = gridY + headerH + infoRowH;
  doc.line(gridX, infoRowBottomY, gridX + gridW, infoRowBottomY);
  for (let row = 1; row <= mealRows; row++) {
    const y = infoRowBottomY + row * mealRowH;
    doc.line(gridX, y, gridX + gridW, y);
  }

  for (let col = 1; col <= 6; col++) {
    const x = gridX + col * colW;
    doc.line(x, gridY, x, gridY + gridH);
  }

  weekDays.forEach((weekDay, col) => {
    const x = gridX + col * colW;
    drawCellText(weekDay, x, gridY, colW, headerH, true, 9.2, "center");
  });

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
