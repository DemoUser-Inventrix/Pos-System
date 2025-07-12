"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, DollarSign, FileText, TrendingDown, TrendingUp } from "lucide-react"
import { usePOSStore } from "../../hooks/use-pos-store"

export function ReportsDashboard() {
  const { sales, purchases, products } = usePOSStore()

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.total, 0)
  const grossProfit = totalSales - totalPurchases
  const totalStock = products.reduce((sum, product) => sum + product.price * product.stock, 0)

  const reportCategories = [
    {
      title: "Sales Reports",
      items: [
        { name: "Daily Sales", description: "View daily sales performance" },
        { name: "Monthly Sales", description: "Monthly sales analysis" },
        { name: "Sales by Product", description: "Product-wise sales breakdown" },
        { name: "Sales by Category", description: "Category-wise sales analysis" },
      ],
    },
    {
      title: "Purchase Reports",
      items: [
        { name: "Purchase Summary", description: "Overall purchase analysis" },
        { name: "Supplier Performance", description: "Supplier-wise purchase data" },
        { name: "Purchase Trends", description: "Purchase trend analysis" },
      ],
    },
    {
      title: "Inventory Reports",
      items: [
        { name: "Current Stock", description: "Current inventory levels" },
        { name: "Low Stock Alert", description: "Products running low" },
        { name: "Stock Valuation", description: "Total inventory value" },
      ],
    },
    {
      title: "Financial Reports",
      items: [
        { name: "Profit & Loss", description: "P&L statement" },
        { name: "Cash Flow", description: "Cash flow analysis" },
        { name: "Due Reports", description: "Customer and supplier dues" },
      ],
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports Dashboard</h1>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Export All Reports
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">All time sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Total Purchases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalPurchases.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">All time purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Gross Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${grossProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${grossProfit.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Sales - Purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stock Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totalStock.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCategories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle className="text-lg">{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
