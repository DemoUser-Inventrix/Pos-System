"use client"

import type * as React from "react"
import {
  BarChart3,
  Calculator,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Home,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Truck,
  User,
  Users,
  Wallet,
} from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePOSStore } from "../hooks/use-pos-store"

// Menu data structure matching the POS requirements
const menuData = [
  {
    title: "Admin",
    icon: User,
    items: [],
  },
  {
    title: "Dashboard",
    icon: Home,
    items: [],
  },
  {
    title: "Sales",
    icon: ShoppingCart,
    items: [
      { title: "POS", page: "POS" },
      { title: "New Sale", page: "New Sale" },
      { title: "Sales List", page: "Sales List" },
      { title: "Sales Return", page: "Sales Return" },
      { title: "Sales Return List", page: "Sales Return List" },
    ],
  },
  {
    title: "Purchase",
    icon: ShoppingBag,
    items: [
      { title: "New Purchase", page: "New Purchase" },
      { title: "Purchase List", page: "Purchase List" },
      { title: "Purchase Return", page: "Purchase Return" },
      { title: "Purchase Return List", page: "Purchase Return List" },
    ],
  },
  {
    title: "Supplier",
    icon: Truck,
    items: [
      { title: "New Supplier", page: "New Supplier" },
      { title: "Supplier List", page: "Supplier List" },
    ],
  },
  {
    title: "Products",
    icon: Package,
    items: [
      { title: "Add Products", page: "Add Products" },
      { title: "All Products", page: "All Products" },
      { title: "Print Labels", page: "Print Labels" },
      { title: "Category", page: "Category" },
      { title: "Brand", page: "Brand" },
      { title: "Unit", page: "Unit" },
    ],
  },
  {
    title: "Expenses",
    icon: CreditCard,
    items: [
      { title: "New Expense", page: "New Expense" },
      { title: "Expenses List", page: "Expenses List" },
      { title: "New Category", page: "New Category" },
      { title: "Categories List", page: "Categories List" },
    ],
  },
  {
    title: "Due List",
    icon: Wallet,
    items: [
      { title: "Customer Due", page: "Customer Due" },
      { title: "Supplier Due", page: "Supplier Due" },
    ],
  },
  {
    title: "Loss and Profit",
    icon: TrendingUp,
    items: [],
  },
  {
    title: "Reports",
    icon: BarChart3,
    items: [
      { title: "Sale", page: "Sale Report" },
      { title: "Sale Return", page: "Sale Return Report" },
      { title: "Purchase", page: "Purchase Report" },
      { title: "Purchase Return", page: "Purchase Return Report" },
      { title: "All Income", page: "All Income" },
      { title: "All Expense", page: "All Expense" },
      { title: "Current Stock", page: "Current Stock" },
      { title: "Customer Due", page: "Customer Due Report" },
      { title: "Supplier Due", page: "Supplier Due Report" },
      { title: "Loss & Profit", page: "Loss & Profit" },
      { title: "Transaction", page: "Transaction" },
    ],
  },
  {
    title: "User",
    icon: Users,
    items: [],
  },
  {
    title: "Setting",
    icon: Settings,
    items: [],
  },
  {
    title: "Help",
    icon: HelpCircle,
    items: [],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentPage, setCurrentPage } = usePOSStore()
  const { setOpenMobile, isMobile } = useSidebar()

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    // Auto-close sidebar on mobile when menu item is selected
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar className="border-r border-gray-200" {...props}>
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Calculator className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">POS System</span>
            <span className="text-xs text-gray-500">Point of Sale</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuData.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items.length > 0 ? (
                    <Collapsible className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full justify-between hover:bg-gray-100 data-[state=open]:bg-gray-50">
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{item.title}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={currentPage === subItem.page}>
                                <button
                                  onClick={() => handlePageChange(subItem.page)}
                                  className="flex items-center gap-2 px-6 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full text-left"
                                >
                                  <span className="h-1 w-1 rounded-full bg-gray-400" />
                                  {subItem.title}
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild isActive={currentPage === item.title}>
                      <button
                        onClick={() => handlePageChange(item.title)}
                        className="flex items-center gap-2 hover:bg-gray-100 w-full text-left"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
