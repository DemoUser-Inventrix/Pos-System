"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Eye } from "lucide-react"
import { usePOSStore } from "../../hooks/use-pos-store"
import type { Purchase } from "../../types/pos-types"

export function PurchaseManagement() {
  const { purchases, suppliers, products, addPurchase } = usePOSStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPurchase, setNewPurchase] = useState({
    supplier: "",
    items: [{ productId: "", quantity: 0, cost: 0 }],
  })

  const handleAddPurchase = () => {
    if (newPurchase.supplier && newPurchase.items.length > 0) {
      const purchase: Purchase = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        supplier: suppliers.find((s) => s.id === newPurchase.supplier)?.name || "",
        items: newPurchase.items.map((item) => {
          const product = products.find((p) => p.id === item.productId)
          return {
            productId: item.productId,
            productName: product?.name || "",
            quantity: item.quantity,
            cost: item.cost,
            total: item.quantity * item.cost,
          }
        }),
        total: newPurchase.items.reduce((sum, item) => sum + item.quantity * item.cost, 0),
        status: "completed",
      }

      addPurchase(purchase)
      setNewPurchase({ supplier: "", items: [{ productId: "", quantity: 0, cost: 0 }] })
      setIsAddDialogOpen(false)
    }
  }

  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.total, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Purchase Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Purchase
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Purchase</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Select
                  value={newPurchase.supplier}
                  onValueChange={(value) => setNewPurchase({ ...newPurchase, supplier: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Purchase Items</Label>
                {newPurchase.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 mt-2">
                    <Select
                      value={item.productId}
                      onValueChange={(value) => {
                        const updatedItems = [...newPurchase.items]
                        updatedItems[index].productId = value
                        setNewPurchase({ ...newPurchase, items: updatedItems })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => {
                        const updatedItems = [...newPurchase.items]
                        updatedItems[index].quantity = Number.parseInt(e.target.value) || 0
                        setNewPurchase({ ...newPurchase, items: updatedItems })
                      }}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Cost per unit"
                      value={item.cost}
                      onChange={(e) => {
                        const updatedItems = [...newPurchase.items]
                        updatedItems[index].cost = Number.parseFloat(e.target.value) || 0
                        setNewPurchase({ ...newPurchase, items: updatedItems })
                      }}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 bg-transparent"
                  onClick={() =>
                    setNewPurchase({
                      ...newPurchase,
                      items: [...newPurchase.items, { productId: "", quantity: 0, cost: 0 }],
                    })
                  }
                >
                  Add Item
                </Button>
              </div>

              <Button onClick={handleAddPurchase} className="w-full">
                Create Purchase
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPurchases.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchases.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Purchases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">#{purchase.id}</TableCell>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell>{purchase.supplier}</TableCell>
                  <TableCell>{purchase.items.length} items</TableCell>
                  <TableCell className="font-semibold">${purchase.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {purchase.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
