'use client'

import { useAuthStore } from '@/store/auth.store'
import Navbar from './Navbar'

export default function NavbarWrapper() {
  const { user } = useAuthStore()
  
  if (!user) return null
  
  return <Navbar />
}