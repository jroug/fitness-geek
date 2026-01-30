"use client";

import React, { use, useEffect, useState } from "react";
import Header from "@/components/Header";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
 
interface userChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

const ChartsWorkoutsPage: React.FC = () => {

  const pageTitle = "Workouts chart";
  const pageContent = "";
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    const priorDate = new Date().setDate(today.getDate() - 30);
    return new Date(priorDate).toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const chartDataFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-workout-data?startDate=${startDate}&endDate=${endDate}`;
  
 

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 120,
        ticks: {
          stepSize: 5, // optional but nice
          callback: (value: string | number) => `${value} minutes`,
        },
      },
    },
  };


  const [chartData, setChartData] = useState<userChartData>({
  labels: [],
  datasets: [
    {
      label: "",
      data: [],
      backgroundColor: [],
    },
  ],
})


  useEffect(() => {
    getCalendarData();
  }, []);

  const getCalendarData = async (): Promise<void> => {
    const response = await fetch(chartDataFetchUrl, {
        method: 'GET',
        credentials: 'include',
    });

    const data: UserWorkoutDataForChart[] = await response.json();
    console.log(data);

    // process data and populate helper arrays to fit chart data format
    const _labels: string[] = [];
    const _data: number[] = [];
    const _backgroundColor: string[] = [];
 
    let storeMonth = -1;
    data.forEach(item => {
        const dateObj = new Date(item.date_of_workout);
        const formattedDate = dateObj.toLocaleDateString('en-GB', {  day: '2-digit', month: 'long', year: 'numeric' });
        // console.log("New month1:", dateObj.getMonth());
        if (storeMonth === -1 || storeMonth !== dateObj.getMonth()){
          storeMonth = dateObj.getMonth();
          console.log("storeMonth:", storeMonth);
      
        }
        _labels.push(formattedDate);
        _data.push(item.w_time);
        _backgroundColor.push(chart_colors[storeMonth]);
    });


    // process data to fit chart format
    const processedData = {
      labels: _labels,
      datasets: [
        {
          label: "Daily workout (minutes)",
          data: _data,
          backgroundColor: _backgroundColor,
        },
      ],
    };

    console.log('processedData', processedData);
    setChartData(processedData);

    return;
  }




  return (
    <main className="site-content full-width">
      <Header backUrl="/homepage" title={pageTitle} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 chart-dates-filter-wrap flex items-center mt-[50px] mx-auto">
          <div className="flex flex-col">
            <label className="text-sm mb-1">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-2"
              max={endDate}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">End date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-3 py-2"
              min={startDate}
            />
          </div>
          <div className="flex flex-col">
            <button
              type="button"
              className="green-btn mt-[25px] dateApplyBtn"
              onClick={() => {
                if (!startDate || !endDate) return;
                if (startDate > endDate) return;
                getCalendarData();
              }}
            >
              Apply
            </button>
          </div>
      </div>
      <div className="verify-email pb-20" id="charts-weight">
        <div className="container mx-auto">
          <div className="about-us-section-wrap">
            <div className="about-us-screen-full border-b-2 border-gray-200 mt-4">
              <div className="mx-auto bg-white rounded-lg mt-4 mb-6">
                <div className="setting-bottom-img p-0 mt-16">
                  <div className="verify-email-img-sec">
                    <div className="main-img-top">
                      <Bar options={options} data={chartData} />       
                    </div>
                  </div>
                </div>
                <div
                  className="page-content mt-4"
                  dangerouslySetInnerHTML={{ __html: pageContent }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ChartsWorkoutsPage;