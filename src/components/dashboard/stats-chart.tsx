"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Main App Component

interface StatsChartProps {
  revenueData: Array<{ name: string; total: number }>;
  salesByLocation: Array<{
    name: string;
    value: number;
    change: number;
    color: string;
  }>;
  loading?: boolean;
}

export function StatsChart({
  revenueData,
  salesByLocation,
  loading = false,
}: StatsChartProps) {
  if (loading) {
    return (
      <div className="text-gray-900 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-900 mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Dashboard Area */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TotalRevenueCard revenueData={revenueData} />
          <SalesByLocationCard salesData={salesByLocation as any} />
        </div>
      </div>
    </div>
  );
}

// Card Components
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`p-4 sm:p-6 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-4 sm:p-6 ${className}`}>{children}</div>;

const Button = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "ghost";
  className?: string;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    default:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300",
    ghost: "hover:bg-gray-100",
  };
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Dashboard Card Components
function TotalRevenueCard({
  revenueData,
}: {
  revenueData: Array<{ name: string; total: number }>;
}) {
  if (!revenueData || revenueData.length === 0) {
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
          <p className="text-sm text-gray-500">Income in the last 28 days</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
        <p className="text-sm text-gray-500">Income in the last 28 days</p>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  hide
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    color: "#1f2937",
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="#1f2937"
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SalesByLocationCard({
  salesData,
}: {
  salesData: Array<{
    name: string;
    value: number;
    change: number;
    color: string;
  }>;
}) {
  if (!salesData || salesData.length === 0) {
    return (
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Sales by Location
            </h3>
            <p className="text-sm text-gray-500">Income in the last 28 days</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Sales by Location
          </h3>
          <p className="text-sm text-gray-500">Income in the last 28 days</p>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {salesData.map((item) => (
            <li key={item.name} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                      item.change > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.change > 0 ? "+" : ""}
                    {item.change}%
                  </span>
                </div>
                <span className="text-gray-500">{item.value}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gray-800 h-1.5 rounded-full"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
