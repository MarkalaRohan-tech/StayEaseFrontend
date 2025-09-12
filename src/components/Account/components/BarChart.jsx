import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ bookingData }) => {
  console.log("Chart Data :", bookingData);

  // Check if we have valid data
  const hasData =
    bookingData?.datasets &&
    bookingData.datasets.length > 0 &&
    bookingData.datasets.some(
      (dataset) => dataset.data && dataset.data.length > 0
    );

  // Calculate total values for stats
  const getTotalBookings = () => {
    if (!hasData) return 0;
    const bookingDataset = bookingData.datasets.find((ds) =>
      ds.label?.toLowerCase().includes("booking")
    );
    return bookingDataset
      ? bookingDataset.data.reduce((sum, val) => sum + val, 0)
      : 0;
  };

  const getTotalHostings = () => {
    if (!hasData) return 0;
    const hostingDataset = bookingData.datasets.find((ds) =>
      ds.label?.toLowerCase().includes("hosting")
    );
    return hostingDataset
      ? hostingDataset.data.reduce((sum, val) => sum + val, 0)
      : 0;
  };

  // Enhanced chart options with modern styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "rect",
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#fbbf24",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function (context) {
            return `${context[0].label}`;
          },
          label: function (context) {
            return ` ${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            weight: "500",
          },
          color: "#6b7280",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#f3f4f6",
          drawBorder: false,
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
            weight: "500",
          },
          color: "#6b7280",
          callback: function (value) {
            return Number.isInteger(value) ? value : "";
          },
        },
        suggestedMax: hasData
          ? Math.max(...bookingData.datasets.flatMap((ds) => ds.data)) + 2
          : 5,
      },
    },
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false,
      },
    },
  };

  return (
    <div className="my-8 flex justify-center items-center px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-6xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className=" p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Activity Overview
              </h2>
              <p className="text-yellow-100 text-sm">
                Your booking and hosting statistics
              </p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="p-8">
          {hasData ? (
            <div className="h-96 sm:h-[500px]">
              <Bar data={bookingData} options={chartOptions} />
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No activity data available
              </h3>
              <p className="text-gray-600 mb-6">
                Start booking or hosting properties to see your activity
                statistics here.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
                  Browse Properties
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
                  Host a Property
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
