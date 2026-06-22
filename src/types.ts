export interface Accessory {
  id: string
  name: string
  category: string
  price: number
  description: string
  stock: number
  image: string
}

export interface ContactFormValues {
  name: string
  email: string
  message: string
}

export interface ContactFormErrors {
  name?: string
  email?: string
  message?: string
}
