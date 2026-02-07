"use client";

import React, {  useCallback, useEffect, useState } from "react";
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




const ChartsWeighingPage: React.FC = () => {

  const [firstChartLoad, setFirstChartLoad] = useState<boolean>(false);
  
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return today.getFullYear() + "-01-01";
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
        min: 70,
        max: 110,
        ticks: {
          stepSize: 5, // optional but nice
          callback: (value: string | number) => `${value} kg`,
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





  const getChartData = useCallback(async (): Promise<void> => {

        const response = await fetch(chartDataFetchUrl, {
            method: 'GET',
            credentials: 'include',
        });

        const data: UserWeighingData[] = await response.json();
        // console.log(data);

        // process data and populate helper arrays to fit chart data format
        const _labels: string[] = [];
        const _data: number[] = [];
        const _backgroundColor: string[] = [];
    
 
        data.forEach(item => {
            const dateObj = new Date(item.date_of_weighing);
            const formattedDate = dateObj.toLocaleDateString('en-GB', {  weekday: 'short', day: '2-digit', month: '2-digit', year: '2-digit' });
            const _numberIfWeek = getISOWeekNumber(dateObj);
            // console.log("New month1:", dateObj.getMonth());

            const helpCount = _numberIfWeek % 12;
            // console.log("helpCount:", helpCount);
       
            _labels.push(formattedDate);
            _data.push(item.weight);
            _backgroundColor.push(chart_colors[helpCount]);
 
        });


 

        // console.log('processedData', processedData);
        setChartData({
          labels: _labels,
          datasets: [
            {
              label: "Daily weight (kg)",
              data: _data,
              backgroundColor: _backgroundColor,
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
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 chart-dates-filter-wrap flex items-center mt-[50px] mx-auto px-[30px]">
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
                    getChartData();
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}

export default ChartsWeighingPage;