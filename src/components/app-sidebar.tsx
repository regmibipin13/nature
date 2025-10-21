"use client";

import {
  IconBorderBottom,
  IconCategory,
  IconChartBar,
  IconDashboard,
  IconEyeClosed,
  IconFileAi,
  IconHelp,
  IconInfoCircle,
  IconListDetails,
  IconPhoneFilled,
  IconReport,
  IconSettings,
  IconTrademark,
  IconUserCheck,
} from "@tabler/icons-react";
import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavMain } from "./nav-main";

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: IconListDetails,
    },
    {
      title: "Product Collections",
      url: "/dashboard/collections",
      icon: IconTrademark,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: IconChartBar,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: IconCategory,
    },
  ],

  navPageBuilder: [
    {
      name: "About us",
      url: "/dashboard/page-builder/about",
      icon: IconUserCheck,
    },
    {
      name: "Hero Section",
      url: "/dashboard/page-builder/hero",
      icon: IconSettings,
    },
    {
      name: "Info Section",
      url: "/dashboard/page-builder/info",
      icon: IconInfoCircle,
    },
    {
      name: "FAQ",
      url: "/dashboard/page-builder/faq",
      icon: IconHelp,
    },
    {
      name: "Contact",
      url: "/dashboard/page-builder/contact",
      icon: IconPhoneFilled,
    },
    {
      name: "Terms Of Service",
      url: "/dashboard/page-builder/tos",
      icon: IconFileAi,
    },
    {
      name: "Privacy Policy",
      url: "/dashboard/page-builder/privacy",
      icon: IconEyeClosed,
    },
    {
      name: "Footer",
      url: "/dashboard/page-builder/footer",
      icon: IconBorderBottom,
    },
  ],
  documents: [
    {
      name: "Blogs",
      url: "/dashboard/blogs",
      icon: IconReport,
    },
  ],
};

// export function AppSidebar({ ...props, orderCount }: React.ComponentProps<typeof Sidebar>) {
// add orderCount prop to the above line
export function AppSidebar({
  orderCount,
  ...props
}: React.ComponentProps<typeof Sidebar> & { orderCount?: React.ReactNode }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <img src={"/logo.png"} alt="Logo" className="h-4 " />
                <span className="text-base font-semibold">Admin Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain orderCount={orderCount} />

        <NavDocuments title="Documents" items={data.documents} />
        <NavDocuments title="Page Builder" items={data.navPageBuilder} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
