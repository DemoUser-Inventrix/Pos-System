"use client"

import { AppSidebar } from "./components/app-sidebar"
import { DashboardContent } from "./components/dashboard-content"
import { POSTerminal } from "./components/pages/pos-terminal"
import { SalesManagement } from "./components/pages/sales-management"
import { ProductManagement } from "./components/pages/product-management"
import { PurchaseManagement } from "./components/pages/purchase-management"
import { SupplierManagement } from "./components/pages/supplier-management"
import { ReportsDashboard } from "./components/pages/reports-dashboard"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { usePOSStore } from "./hooks/use-pos-store"

export default function POSDashboard() {
  const { currentPage } = usePOSStore()

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "POS":
        return <POSTerminal />
      case "Sales List":
        return <SalesManagement />
      case "All Products":
      case "Add Products":
        return <ProductManagement />
      case "New Purchase":
      case "Purchase List":
        return <PurchaseManagement />
      case "New Supplier":
      case "Supplier List":
        return <SupplierManagement />
      case "Reports":
      case "Sale Report":
      case "Purchase Report":
      case "Loss & Profit":
        return <ReportsDashboard />
      case "Dashboard":
      default:
        return <DashboardContent />
    }
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Header with Sidebar Trigger for all screen sizes */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-8 w-8" />
              <span className="font-semibold text-gray-900">POS System</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Hello👋</span>
              <span className="text-sm font-medium">China Gateway</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderCurrentPage()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
