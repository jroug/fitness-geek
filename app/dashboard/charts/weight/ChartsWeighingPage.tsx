"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getISOWeekNumber } from "@/lib/getISOWeekNumber";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { chart_colors } from "@/lib/globalSettings";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface UserChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

const ChartsWeighingPage: React.FC = () => {
  const [firstChartLoad, setFirstChartLoad] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-01-01`;
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const chartDataFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-weighing-data?startDate=${startDate}&endDate=${endDate}`;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "",
      },
    },
    scales: {
      y: {
        min: 70,
        max: 110,
        ticks: {
          stepSize: 5,
          callback: (value: string | number) => `${value} kg`,
        },
      },
    },
  };

  const [chartData, setChartData] = useState<UserChartData>({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [],
      },
    ],
  });

  const getChartData = useCallback(async (): Promise<void> => {
    const response = await fetch(chartDataFetchUrl, {
      method: "GET",
      credentials: "include",
    });

    const data: UserWeighingData[] = await response.json();

    const labels: string[] = [];
    const values: number[] = [];
    const backgroundColor: string[] = [];

    data.forEach((item) => {
      const dateObj = new Date(item.date_of_weighing);
      const formattedDate = dateObj.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });

      const helpCount = getISOWeekNumber(dateObj) % 12;

      labels.push(formattedDate);
      values.push(item.weight);
      backgroundColor.push(chart_colors[helpCount]);
    });

    setChartData({
      labels,
      datasets: [
        {
          label: "Daily weight (kg)",
          data: values,
          backgroundColor,
        },
      ],
    });
  }, [chartDataFetchUrl]);

  useEffect(() => {
    if (!firstChartLoad) {
      setFirstChartLoad(true);
      getChartData();
    }
  }, [firstChartLoad, getChartData]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-8">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-slate-700">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
              max={endDate}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-slate-700">End date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
              min={startDate}
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 md:w-auto"
              onClick={() => {
                if (!startDate || !endDate) return;
                if (startDate > endDate) return;
                getChartData();
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:p-6">
        <h2 className="text-lg font-bold text-slate-900">Weight Trend</h2>
        <div className="mt-4 h-[600px]">
          <Bar options={options} data={chartData} />
        </div>
      </div>
    </section>
  );
};

export default ChartsWeighingPage;
