import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
);

function SalesChart({ data: rawData }) {
  const labels = rawData ? rawData.map((d) => d.month) : [];
  const salesData = rawData ? rawData.map((d) => d.sales) : [];

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: salesData,
        borderColor: "#6366f1",
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.3)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");
          return gradient;
        },
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(17, 17, 24, 0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#94a3b8",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx) => ` ₹${(ctx.parsed.y / 1000).toFixed(0)}K`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.04)", drawBorder: false },
        ticks: { color: "#475569", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.04)", drawBorder: false },
        ticks: {
          color: "#475569",
          font: { size: 11 },
          callback: (v) => `₹${(v / 1000).toFixed(0)}K`,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default SalesChart;