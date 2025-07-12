export interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  barcode?: string
}

export interface Sale {
  id: string
  date: string
  customer: string
  items: SaleItem[]
  total: number
  status: "completed" | "pending" | "returned"
}

export interface SaleItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface Purchase {
  id: string
  date: string
  supplier: string
  items: PurchaseItem[]
  total: number
  status: "completed" | "pending"
}

export interface PurchaseItem {
  productId: string
  productName: string
  quantity: number
  cost: number
  total: number
}

export interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  address: string
  balance: number
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  dueAmount: number
}
