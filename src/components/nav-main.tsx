"use client";

import { IconCirclePlusFilled } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconCategory,
  IconChartBar,
  IconDashboard,
  IconListDetails,
  IconTrademark,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const items = [
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
];

export function NavMain({ orderCount }: { orderCount?: React.ReactNode }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="w-full">
            <DropdownMenu>
              <DropdownMenuTrigger className="h-full w-full flex justify-center items-center text-center">
                <div className="bg-primary text-secondary peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] :bg-sidebar-accent focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0">
                  <IconCirclePlusFilled className="w-5 h-5" />
                  <span className="text-center">Quick Create</span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard/products/create" className="w-full">
                    Create Product
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard/categories/create" className="w-full">
                    Create Category
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard/blogs/create" className="w-full">
                    Create Blog
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <Link
                  href={item.url}
                  className="flex items-center justify-between gap-2 p-2 text-sm w-full"
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.title}</span>
                  </div>

                  {item.title === "Orders" && <div>{orderCount}</div>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
