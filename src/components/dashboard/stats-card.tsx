"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { ArrowUp } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "../ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface StatCardProps {
  title: string;
  value: string;
  percentage: number;
  data: Array<{ name: string; value: number }>;
  chartColor: string;
}

interface TinyChartProps {
  data: Array<{ name: string; value: number }>;
  strokeColor: string;
}

const TinyChart = ({ data, strokeColor }: TinyChartProps) => (
  <div className="h-20 w-full">
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937", // bg-gray-800
            borderColor: "#374151", // border-gray-700
            color: "#ffffff",
            borderRadius: "0.5rem",
            fontSize: "12px",
            padding: "4px 8px",
          }}
          labelStyle={{ display: "none" }}
          itemStyle={{ color: "#ffffff" }}
          formatter={(value) => [`$${value.toLocaleString()}`]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={2.5}
          dot={false}
          activeDot={{
            r: 6,
            fill: strokeColor,
            strokeWidth: 2,
            stroke: "#ffffff",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const CongratsCard = ({ totalRevenue }: { totalRevenue: number }) => (
  <div className="relative bg-gray-50 p-6 rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
    <div
      className="absolute -top-10 -right-10 text-8xl opacity-10"
      aria-hidden="true"
    >
      🎉
    </div>
    <div className="relative z-10 flex flex-col flex-grow justify-between">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">Hello Admin! 🎉</h3>
        <p className="text-sm text-gray-500 mt-1">Overview of your store</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 mt-4">${totalRevenue}</p>
        <div className="flex items-center text-sm text-green-600 font-medium mt-1">
          <ArrowUp className="h-4 w-4 mr-1" />
          <span>+65% from last month</span>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({
  title,
  value,
  percentage,
  data,
  chartColor,
}: StatCardProps) => {
  const isPositive = percentage > 0;
  return (
    // <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-full flex flex-col justify-between">
    //   <div>
    //     <div className="flex justify-between items-start">
    //       <h4 className="text-base font-medium text-gray-600">{title}</h4>
    //     </div>
    //     <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
    //   </div>
    //   <TinyChart data={data} strokeColor={chartColor} />
    // </div>

    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {isPositive ? <IconTrendingUp /> : <IconTrendingDown />}
            {isPositive ? (
              <span>+{percentage.toFixed(1)}%</span>
            ) : (
              <span>{percentage.toFixed(1)}%</span>
            )}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start  text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {isPositive ? (
            <>
              Trending up this month <IconTrendingUp className="size-4" />
            </>
          ) : (
            <>
              Trending down this month <IconTrendingDown className="size-4" />
            </>
          )}
        </div>
        <TinyChart data={data} strokeColor={chartColor} />
      </CardFooter>
    </Card>
  );
};

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueData: Array<{ name: string; value: number }>;
  salesData: Array<{ name: string; value: number }>;
  customersData: Array<{ name: string; value: number }>;
}

export function StatsCards({ data }: { data: DashboardData }) {
  return (
    <div className="mb-12">
      <div className=" mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Congrats Card */}
          <div className="md:col-span-1">
            <CongratsCard totalRevenue={data.totalRevenue} />
          </div>

          {/* Stat Cards */}
          <StatCard
            title="Revenue"
            value={`$${data.totalRevenue.toLocaleString()}`}
            percentage={20.1} // You might want to calculate this dynamically
            data={data.revenueData}
            chartColor="#3b82f6" // blue-500
          />
          <StatCard
            title="Sales"
            value={data.totalOrders.toString()}
            percentage={-1.7} // You might want to calculate this dynamically
            data={data.salesData}
            chartColor="#8b5cf6" // violet-500
          />
        </div>
      </div>
    </div>
  );
}
