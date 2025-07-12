"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { usePOSStore } from "../hooks/use-pos-store"

export function DashboardContent() {
  const { sales, products, customers, suppliers } = usePOSStore()

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
  const todaySales = sales.filter((sale) => sale.date === new Date().toISOString().split("T")[0])
  const lowStockProducts = products.filter((p) => p.stock <= 10)

  const stats = [
    {
      title: "Total Sales",
      value: `$${totalSales.toFixed(2)}`,
      description: "All time sales",
      icon: DollarSign,
      trend: "+12%",
    },
    {
      title: "Orders",
      value: sales.length.toString(),
      description: `${todaySales.length} today`,
      icon: ShoppingCart,
      trend: "+8%",
    },
    {
      title: "Products",
      value: products.length.toString(),
      description: `${lowStockProducts.length} low stock`,
      icon: Package,
      trend: "+2%",
    },
    {
      title: "Customers",
      value: customers.length.toString(),
      description: "Active customers",
      icon: Users,
      trend: "+15%",
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Dashboard</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your store today.</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">{stat.description}</p>
                <span className="text-xs font-medium text-green-600">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Sales
            </CardTitle>
            <CardDescription>Your recent sales activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sales
                .slice(-4)
                .reverse()
                .map((sale, index) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{sale.customer}</p>
                      <p className="text-sm text-gray-500">{sale.date}</p>
                    </div>
                    <span className="font-semibold text-green-600">${sale.total.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {[
                { title: "New Sale", description: "Process a new sale transaction" },
                { title: "Add Product", description: "Add new product to inventory" },
                { title: "View Reports", description: "Check sales and inventory reports" },
                { title: "Manage Customers", description: "Add or edit customer information" },
              ].map((action, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
