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

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [83, 82.5, 82, 81.7, 81.9, 81.4, 81.2],
      backgroundColor: "rgba(53, 162, 235, 0.6)",
    }
  ],
};

export default function ChartsWeightPage() {
  const pageTitle = "Test title";
  const pageContent = "<p>test content</p>";

  return (
    <main className="site-content">
      <Header backUrl="/homepage" title={pageTitle} />

      <div className="verify-email pb-20" id="charts-weight">
        <div className="container mx-auto">
          <div className="about-us-section-wrap">
            <div className="about-us-screen-full border-b-2 border-gray-200 mt-4">
              <div className="max-w-4xl mx-auto bg-white rounded-lg mt-4 mb-6">
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