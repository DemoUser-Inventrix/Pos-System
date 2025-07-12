"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Scan, Minus, Trash2 } from "lucide-react"
import { usePOSStore } from "../../hooks/use-pos-store"

export function POSTerminal() {
  const { products, cart, addToCart, removeFromCart, clearCart, addSale, customers } = usePOSStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [barcodeInput, setBarcodeInput] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState("")
  const [receiveAmount, setReceiveAmount] = useState(0)
  const [paymentType, setPaymentType] = useState("Cash")
  const [note, setNote] = useState("N/A")
  const [vatPercent, setVatPercent] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [shippingCharge, setShippingCharge] = useState(0)

  const filteredProducts = products.filter(
    (product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode?.includes(searchTerm),
  )

  const subTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const vatAmount = (subTotal * vatPercent) / 100
  const totalAmount = subTotal + vatAmount - discountAmount + shippingCharge
  const changeAmount = receiveAmount - totalAmount
  const dueAmount = totalAmount - receiveAmount

  const handleBarcodeSearch = (barcode: string) => {
    const product = products.find((p) => p.barcode === barcode || p.id === barcode)
    if (product) {
      addToCart(product, 1)
      setBarcodeInput("")
    } else {
      alert("Product not found!")
    }
  }

  const handleBarcodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && barcodeInput.trim()) {
      handleBarcodeSearch(barcodeInput.trim())
    }
  }

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      const product = products.find((p) => p.id === productId)
      if (product) {
        removeFromCart(productId)
        addToCart(product, newQuantity)
      }
    }
  }

  const handleSave = () => {
    if (cart.length === 0) {
      alert("Please add items to cart!")
      return
    }

    const sale = {
      id: `S-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      customer: selectedCustomer || "Walk-in Customer",
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
      })),
      total: totalAmount,
      status: "completed" as const,
    }

    addSale(sale)
    clearCart()
    setReceiveAmount(0)
    setSelectedCustomer("")
    setSelectedWarehouse("")
    setBarcodeInput("")
    alert("Sale completed successfully!")
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Remove the duplicate header section completely */}

      {/* Main Form */}
      <div className="bg-white rounded-lg p-4 lg:p-6 mb-6">
        {/* Sale ID and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Input value={`S-${Date.now().toString().slice(-5)}`} readOnly className="bg-gray-100" />
          </div>
          <div>
            <Input value={new Date().toLocaleDateString("en-GB")} readOnly className="bg-gray-100" />
          </div>
        </div>

        {/* Customer and Warehouse Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex gap-2">
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select Customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="icon" className="bg-red-500 hover:bg-red-600">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select Warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Warehouse</SelectItem>
                <SelectItem value="secondary">Secondary Warehouse</SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon" className="bg-red-500 hover:bg-red-600">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Barcode Scanner Input */}
        <div className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Scan className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Scan barcode or enter product code..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyPress={handleBarcodeKeyPress}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => handleBarcodeSearch(barcodeInput)}
              className="bg-green-500 hover:bg-green-600"
              disabled={!barcodeInput.trim()}
            >
              <Scan className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Items Table - Responsive */}
        <div className="mb-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">Image</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="hidden sm:table-cell">Code</TableHead>
                <TableHead className="hidden sm:table-cell">Unit</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="hidden lg:table-cell">Serials</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                    No items in cart. Scan barcode or select products below.
                  </TableCell>
                </TableRow>
              ) : (
                cart.map((item) => (
                  <TableRow key={item.product.id}>
                    <TableCell className="hidden md:table-cell">
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">IMG</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.product.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{item.product.id}</TableCell>
                    <TableCell className="hidden sm:table-cell">Pcs</TableCell>
                    <TableCell>৳{item.product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(item.product.id, Number.parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                          min="0"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">-</TableCell>
                    <TableCell className="font-semibold">৳{(item.product.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Payment and Total Section - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Payment Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="text-sm font-medium">Receive Amount</label>
              <Input
                type="number"
                value={receiveAmount}
                onChange={(e) => setReceiveAmount(Number(e.target.value))}
                className="text-center"
                step="0.01"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="text-sm font-medium">Change Amount</label>
              <Input
                value={changeAmount > 0 ? changeAmount.toFixed(2) : "0"}
                readOnly
                className="text-center bg-gray-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="text-sm font-medium">Due Amount</label>
              <Input value={dueAmount > 0 ? dueAmount.toFixed(2) : "0"} readOnly className="text-center bg-gray-100" />
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="text-sm font-medium">Payment Type</label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Mobile Banking">Mobile Banking</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="text-sm font-medium">Note</label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>

          {/* Right Side - Totals */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Sub Total</span>
              <span className="font-bold">৳{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Vat</span>
              <div className="flex items-center gap-2">
                <Select value={vatPercent.toString()} onValueChange={(v) => setVatPercent(Number(v))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="15">15%</SelectItem>
                  </SelectContent>
                </Select>
                <span className="w-16 text-right">৳{vatAmount.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Discount</span>
              <div className="flex items-center gap-2">
                <Select defaultValue="flat">
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat (৳)</SelectItem>
                    <SelectItem value="percent">Percent (%)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-20"
                  step="0.01"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping Charge</span>
              <Input
                type="number"
                value={shippingCharge}
                onChange={(e) => setShippingCharge(Number(e.target.value))}
                className="w-20"
                step="0.01"
              />
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total Amount</span>
              <span>৳{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={clearCart}>
            Cancel
          </Button>
          <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      {/* Product Search and Grid */}
      <div className="bg-white rounded-lg p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">Category</Button>
          <Button className="bg-blue-500 hover:bg-blue-600">Brand</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => addToCart(product, 1)}
            >
              <CardContent className="p-4">
                <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                <p className="font-bold text-lg">৳{product.price.toFixed(2)}</p>
                {product.barcode && <p className="text-xs text-gray-400 mt-1">Code: {product.barcode}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
