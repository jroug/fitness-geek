"use client";

import React, { useCallback, useEffect, useState } from "react";
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

const ChartsGradesPage: React.FC = () => {
  const [firstChartLoad, setFirstChartLoad] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    const priorDate = new Date().setDate(today.getDate() - 30);
    return new Date(priorDate).toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const chartDataFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-grades-data?startDate=${startDate}&endDate=${endDate}`;

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
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1,
          callback: (value: string | number) => `${value}`,
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

    const data: UserGradeDataForChart[] = await response.json();

    const labels: string[] = [];
    const values: number[] = [];
    const backgroundColor: string[] = [];

    let storeMonth = -1;
    data.forEach((item) => {
      const dateObj = new Date(item.date_of_comment);
      const formattedDate = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      if (storeMonth === -1 || storeMonth !== dateObj.getMonth()) {
        storeMonth = dateObj.getMonth();
      }

      labels.push(formattedDate);
      values.push(item.grade);
      backgroundColor.push(chart_colors[storeMonth]);
    });

    setChartData({
      labels,
      datasets: [
        {
          label: "Daily grade",
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
    <div className="mx-auto w-full max-w-[2000px] px-4 pb-24 md:px-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Chart</p>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Grades</h1>
        <p className="mt-2 text-sm text-cyan-100">Track your grades over time and compare weekly performance trends.</p>
      </section>
      <div className="mt-6 rounded-2xl bg-white p-4 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end w-full max-w-[700px]">
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-slate-700">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                max={endDate}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-slate-700">End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                min={startDate}
              />
            </div>
          </div>

          <button
            type="button"
            className="translate-y-[-4px] inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 md:w-auto"
            onClick={() => {
              if (!startDate || !endDate) return;
              if (startDate > endDate) return;
              getChartData();
            }}
          >
            Apply
          </button>
        </div>
        <div className="mt-4 h-[600px]">
          <Bar options={options} data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default ChartsGradesPage;
