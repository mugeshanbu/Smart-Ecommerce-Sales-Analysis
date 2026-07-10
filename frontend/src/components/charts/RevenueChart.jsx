import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function RevenueChart({ data: rawData }) {
  const labels = rawData ? rawData.map((d) => d.month) : [];
  const values = rawData ? rawData.map((d) => d.sales) : [];

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: values,
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 280);
          gradient.addColorStop(0, "rgba(139, 92, 246, 0.9)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0.3)");
          return gradient;
        },
        borderRadius: 8,
        borderSkipped: false,
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
        grid: { display: false },
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

  return <Bar data={data} options={options} />;
}

export default RevenueChart;
