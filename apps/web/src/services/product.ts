interface Product {
  id: string
  name: string
  price: number
  stock: number
}

let products: Record<string, Product> = {}

export function resetProductStore() {
  products = {}
}

export function getProduct(id: string): Product {
  return products[id]
}

export function updateStock(product: Product, quantity: number): Product {
  if (!products[product.id]) {
    products[product.id] = { ...product }
  }
  
  const newStock = products[product.id].stock + quantity
  if (newStock < 0) {
    throw new Error('库存不足')
  }
  products[product.id].stock = newStock
  return products[product.id]
}

export { products }