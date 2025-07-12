"use client"

import { create } from "zustand"
import type { Product, Sale, Purchase, Supplier, Customer } from "../types/pos-types"

interface POSStore {
  // Navigation
  currentPage: string
  setCurrentPage: (page: string) => void

  // Products
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Sales
  sales: Sale[]
  addSale: (sale: Sale) => void

  // Purchases
  purchases: Purchase[]
  addPurchase: (purchase: Purchase) => void

  // Suppliers
  suppliers: Supplier[]
  addSupplier: (supplier: Supplier) => void

  // Customers
  customers: Customer[]
  addCustomer: (customer: Customer) => void

  // Cart for POS
  cart: Array<{ product: Product; quantity: number }>
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
}

export const usePOSStore = create<POSStore>((set, get) => ({
  // Navigation
  currentPage: "Dashboard",
  setCurrentPage: (page) => set({ currentPage: page }),

  // Sample data with barcodes
  products: [
    { id: "1", name: "Hair Towel", price: 115.0, stock: 100, category: "Cloth", barcode: "1234567890123" },
    { id: "2", name: "Kitchen Faucet", price: 750.0, stock: 50, category: "Gadgets", barcode: "2345678901234" },
    { id: "3", name: "Luxury wallet", price: 245.0, stock: 30, category: "Bag", barcode: "3456789012345" },
    { id: "4", name: "Gadgets", price: 800.0, stock: 75, category: "Gadgets", barcode: "4567890123456" },
    { id: "5", name: "Coca Cola", price: 2.5, stock: 200, category: "Beverages", barcode: "5678901234567" },
    { id: "6", name: "Bread", price: 1.2, stock: 150, category: "Bakery", barcode: "6789012345678" },
  ],

  sales: [
    {
      id: "1",
      date: "2024-01-10",
      customer: "John Doe",
      items: [{ productId: "1", productName: "Hair Towel", quantity: 2, price: 115.0, total: 230.0 }],
      total: 230.0,
      status: "completed",
    },
  ],

  purchases: [],
  suppliers: [
    {
      id: "1",
      name: "ABC Distributors",
      contact: "+1234567890",
      email: "abc@dist.com",
      address: "123 Main St",
      balance: 0,
    },
  ],
  customers: [
    { id: "1", name: "John Doe", phone: "+1234567890", email: "john@email.com", address: "456 Oak St", dueAmount: 0 },
    {
      id: "2",
      name: "Jane Smith",
      phone: "+1234567891",
      email: "jane@email.com",
      address: "789 Pine St",
      dueAmount: 0,
    },
  ],

  cart: [],

  // Actions
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
    })),
  deleteProduct: (id) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

  addSale: (sale) => set((state) => ({ sales: [...state.sales, sale] })),
  addPurchase: (purchase) => set((state) => ({ purchases: [...state.purchases, purchase] })),
  addSupplier: (supplier) => set((state) => ({ suppliers: [...state.suppliers, supplier] })),
  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),

  addToCart: (product, quantity) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.product.id === product.id)
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          ),
        }
      }
      return { cart: [...state.cart, { product, quantity }] }
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),

  clearCart: () => set({ cart: [] }),
}))
