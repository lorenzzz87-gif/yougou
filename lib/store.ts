// Simple in-memory store using localStorage for demo (no backend needed)
export type Role = 'admin' | 'buyer' | 'salesperson'

export interface User {
  id: string
  name: string
  role: Role
  phone: string
}

export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  categoryId: string
  price: number
  unit: string
  stock: number
  image?: string
  barcode?: string
  description?: string
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface Order {
  id: string
  orderNo: string
  buyerId: string
  buyerName: string
  salesId?: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled'
  createdAt: string
  remark?: string
}

export interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  unit: string
}

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: '待确认',
  confirmed: '已确认',
  shipped: '已发货',
  completed: '已完成',
  cancelled: '已取消',
}

export function getStatusLabel(status: Order['status']) {
  return STATUS_LABELS[status]
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

// Seed default data
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'c1', name: '饮料' },
  { id: 'c2', name: '零食' },
  { id: 'c3', name: '日用品' },
  { id: 'c4', name: '粮油' },
]

const DEFAULT_PRODUCTS: Product[] = [
  { id: 'p1', name: '可口可乐 330ml', categoryId: 'c1', price: 3.5, unit: '罐', stock: 200, barcode: '6901234567890' },
  { id: 'p2', name: '农夫山泉 550ml', categoryId: 'c1', price: 2.0, unit: '瓶', stock: 500, barcode: '6901234567891' },
  { id: 'p3', name: '红牛 250ml', categoryId: 'c1', price: 6.0, unit: '罐', stock: 100, barcode: '6901234567892' },
  { id: 'p4', name: '薯片（原味）', categoryId: 'c2', price: 8.5, unit: '包', stock: 150, barcode: '6901234567893' },
  { id: 'p5', name: '方便面（红烧牛肉）', categoryId: 'c2', price: 4.5, unit: '袋', stock: 300, barcode: '6901234567894' },
  { id: 'p6', name: '洗洁精 1kg', categoryId: 'c3', price: 12.0, unit: '瓶', stock: 80, barcode: '6901234567895' },
  { id: 'p7', name: '大米 5kg', categoryId: 'c4', price: 38.0, unit: '袋', stock: 60, barcode: '6901234567896' },
  { id: 'p8', name: '花生油 5L', categoryId: 'c4', price: 88.0, unit: '桶', stock: 40, barcode: '6901234567897' },
]

const DEFAULT_USERS: User[] = [
  { id: 'u1', name: '管理员', role: 'admin', phone: '13800000001' },
  { id: 'u2', name: '张老板（门店A）', role: 'buyer', phone: '13800000002' },
  { id: 'u3', name: '李老板（门店B）', role: 'buyer', phone: '13800000003' },
  { id: 'u4', name: '王业务员', role: 'salesperson', phone: '13800000004' },
]

export const store = {
  // Users
  getUsers(): User[] { return load('yg_users', DEFAULT_USERS) },
  getCurrentUser(): User | null { return load('yg_current_user', null) },
  setCurrentUser(user: User | null) { save('yg_current_user', user) },

  // Categories
  getCategories(): Category[] { return load('yg_categories', DEFAULT_CATEGORIES) },
  saveCategories(cats: Category[]) { save('yg_categories', cats) },
  addCategory(name: string): Category {
    const cats = this.getCategories()
    const cat = { id: `c${Date.now()}`, name }
    cats.push(cat)
    this.saveCategories(cats)
    return cat
  },

  // Products
  getProducts(): Product[] { return load('yg_products', DEFAULT_PRODUCTS) },
  saveProducts(products: Product[]) { save('yg_products', products) },
  addProduct(p: Omit<Product, 'id'>): Product {
    const products = this.getProducts()
    const product = { ...p, id: `p${Date.now()}` }
    products.push(product)
    this.saveProducts(products)
    return product
  },
  updateProduct(id: string, updates: Partial<Product>) {
    const products = this.getProducts().map(p => p.id === id ? { ...p, ...updates } : p)
    this.saveProducts(products)
  },
  deleteProduct(id: string) {
    this.saveProducts(this.getProducts().filter(p => p.id !== id))
  },
  findByBarcode(barcode: string): Product | undefined {
    return this.getProducts().find(p => p.barcode === barcode)
  },

  // Cart
  getCart(): CartItem[] { return load('yg_cart', []) },
  saveCart(cart: CartItem[]) { save('yg_cart', cart) },
  addToCart(productId: string, quantity: number) {
    const cart = this.getCart()
    const idx = cart.findIndex(i => i.productId === productId)
    if (idx >= 0) cart[idx].quantity += quantity
    else cart.push({ productId, quantity })
    this.saveCart(cart)
  },
  updateCartItem(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.saveCart(this.getCart().filter(i => i.productId !== productId))
    } else {
      const cart = this.getCart().map(i => i.productId === productId ? { ...i, quantity } : i)
      this.saveCart(cart)
    }
  },
  clearCart() { save('yg_cart', []) },

  // Orders
  getOrders(): Order[] { return load('yg_orders', []) },
  saveOrders(orders: Order[]) { save('yg_orders', orders) },
  createOrder(buyerId: string, buyerName: string, items: CartItem[], remark?: string, salesId?: string): Order {
    const products = this.getProducts()
    const orderItems: OrderItem[] = items.map(item => {
      const p = products.find(p => p.id === item.productId)!
      return { productId: item.productId, productName: p.name, price: p.price, quantity: item.quantity, unit: p.unit }
    })
    const totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const order: Order = {
      id: `o${Date.now()}`,
      orderNo: `YG${Date.now()}`,
      buyerId,
      buyerName,
      salesId,
      items: orderItems,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      remark,
    }
    const orders = this.getOrders()
    orders.unshift(order)
    this.saveOrders(orders)
    this.clearCart()
    return order
  },
  updateOrderStatus(id: string, status: Order['status']) {
    const orders = this.getOrders().map(o => o.id === id ? { ...o, status } : o)
    this.saveOrders(orders)
  },
  getOrdersByBuyer(buyerId: string): Order[] {
    return this.getOrders().filter(o => o.buyerId === buyerId)
  },
}
