export interface MenuItem {
  icon: JSX.Element
  label: string
  info?: string
  onClick?: () => void
}

export interface MenuSection {
  title: string
  items: MenuItem[]
}

export interface Address {
  id: number
  type: string
  address: string
  default: boolean
}

export interface Card {
  id: number
  type: string
  number: string
  expiry: string
  default: boolean
}

export interface PersonalInfo {
  name: string
  email: string
  phone: string
  dob: string
} 