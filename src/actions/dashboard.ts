"use server";

import prisma from "@/lib/db";

export async function getDashboardStats() {
  try {
    // Get total revenue
    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        amountTotal: true,
      },
    });

    // Get total orders
    const totalOrders = await prisma.order.count();

    // Get total products
    const totalProducts = await prisma.product.count();

    // Get total users

    // Get recent orders (last 10)
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Get best selling products
    const bestSellingProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 10,
    });

    // Get products with details
    const productIds = bestSellingProducts
      .map((p: any) => p.productId)
      .filter(Boolean);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    // Get monthly revenue data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await prisma.order.groupBy({
      by: ["createdAt"],
      _sum: {
        amountTotal: true,
      },
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Process monthly data
    const revenueData = monthlyRevenue.map((item: any) => ({
      name: item.createdAt
        ? item.createdAt.toLocaleDateString("en-US", { month: "short" })
        : "Unknown",
      value: item._sum.amountTotal ? item._sum.amountTotal / 100 : 0, // Convert cents to dollars
    }));

    // Get monthly sales data
    const monthlySales = await prisma.order.groupBy({
      by: ["createdAt"],
      _sum: {
        amountTotal: true,
      },
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const salesData = monthlySales.map((item: any) => ({
      name: item.createdAt
        ? item.createdAt.toLocaleDateString("en-US", { month: "short" })
        : "Unknown",
      value: item._sum.amountTotal ? item._sum.amountTotal / 100 : 0,
    }));

    return {
      totalRevenue: totalRevenue._sum.amountTotal
        ? totalRevenue._sum.amountTotal / 100
        : 0,
      totalOrders,
      totalProducts,
      recentOrders: recentOrders.map((order: any) => ({
        id: order.id,
        customer: order.customerName,
        product: order.items[0]?.product?.name || "Unknown Product",
        amount: `$${(order.amountTotal / 100).toFixed(2)}`,
        status: order.status,
        avatar: order.customerName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase(),
      })),
      bestSellingProducts: bestSellingProducts.map((item: any) => {
        const product = products.find((p: any) => p.id === item.productId);
        return {
          name: product?.name || "Unknown Product",
          sales: product ? `$${product.price.toFixed(2)}` : "$0.00",
          quantity: item._sum.quantity || 0,
        };
      }),
      revenueData,
      salesData,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard data");
  }
}

export async function getSalesByLocation() {
  try {
    const salesByLocation = await prisma.order.groupBy({
      by: ["customerCountry"],
      _sum: {
        amountTotal: true,
      },
      _count: {
        _all: true,
      },
      where: {
        customerCountry: {
          not: null,
        },
      },
      orderBy: {
        _sum: {
          amountTotal: "desc",
        },
      },
      take: 6,
    });

    // Calculate total sales for percentage
    const totalSales = salesByLocation.reduce(
      (sum, item) => sum + (item._sum.amountTotal || 0),
      0
    );

    return salesByLocation.map((item) => ({
      name: item.customerCountry || "Unknown",
      value: Math.round(((item._sum.amountTotal || 0) / totalSales) * 100),
      change: 0, // Placeholder, would need historical data to calculate
      color: "bg-green-500", // Placeholder
    }));
  } catch (error) {
    console.error("Error fetching sales by location:", error);
    throw new Error("Failed to fetch sales by location");
  }
}

export async function getCustomerReviewsStats() {
  try {
    const reviews = await prisma.review.findMany({
      select: {
        rating: true,
        createdAt: true,
      },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    // Count ratings by stars
    const ratingCounts = [1, 2, 3, 4, 5].map((stars) => ({
      stars,
      count: reviews.filter((review) => review.rating === stars).length,
      color:
        stars >= 4
          ? "bg-green-500"
          : stars === 3
          ? "bg-yellow-400"
          : "bg-red-500",
    }));

    return {
      average: Math.round(averageRating * 10) / 10,
      total: totalReviews,
      ratings: ratingCounts,
    };
  } catch (error) {
    console.error("Error fetching customer reviews stats:", error);
    throw new Error("Failed to fetch customer reviews stats");
  }
}

export async function getRevenueByDevice() {
  try {
    // Get daily revenue data for the last 28 days
    const twentyEightDaysAgo = new Date();
    twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);

    const dailyRevenue = await prisma.$queryRaw`
      SELECT
        DATE("createdAt") as date,
        SUM("amountTotal") as total_revenue
      FROM orders
      WHERE "createdAt" >= ${twentyEightDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC
    `;

    // Format the data for the chart
    const revenueData = (dailyRevenue as any[]).map((item) => {
      const total = Number(item.total_revenue) / 100; // Convert from cents to dollars
      const date = new Date(item.date);
      return {
        name: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        total: Math.round(total),
      };
    });

    return revenueData;
  } catch (error) {
    console.error("Error fetching revenue by device:", error);
    throw new Error("Failed to fetch revenue by device");
  }
}
