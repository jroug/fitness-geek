"use client";

import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Weight chart",
    },
  },
};

const labels = [
  "Week 1",
  "Week 2",
  "Week 3",
  "Week 4",
  "Week 5",
  "Week 6",
  "Week 7",
  "Week 8",
  "Week 9",
  "Week 10",
  "Week 11",
  "Week 12",
  "Week 13",
  "Week 14",
  "Week 15",
];

const data = {
  labels,
  datasets: [
    {
      label: "Weekly average weight (kg)",
      data: [
        83.2,
        82.9,
        82.6,
        82.3,
        82.1,
        81.9,
        81.8,
        71.6,
        81.5,
        81.4,
        81.3,
        81.2,
        81.1,
        81.0,
        70.9,
      ],
      backgroundColor: "rgba(53, 162, 235, 0.6)",
    },
  ],
};

export default function ChartsWeightPage() {
  const pageTitle = "Test title";
  const pageContent = "<p>test content</p>";

  return (
    <main className="site-content full-width">
      <Header backUrl="/homepage" title={pageTitle} />

      <div className="verify-email pb-20" id="charts-weight">
        <div className="container mx-auto">
          <div className="about-us-section-wrap">
            <div className="about-us-screen-full border-b-2 border-gray-200 mt-4">
              <div className="mx-auto bg-white rounded-lg mt-4 mb-6">
                <div className="setting-bottom-img p-0 mt-16">
                  <div className="verify-email-img-sec">
                    <div className="main-img-top">
                      <Bar options={options} data={data} />       
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