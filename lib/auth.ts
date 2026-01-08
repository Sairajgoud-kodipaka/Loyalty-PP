import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

export type UserRole = 'staff' | 'manager' | 'admin'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  is_active: boolean
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  // Get user details from users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name, role, is_active')
    .eq('email', user.email)
    .single()
  
  if (userError || !userData || !userData.is_active) {
    return null
  }
  
  return {
    id: userData.id,
    email: userData.email,
    full_name: userData.full_name,
    role: userData.role as UserRole,
    is_active: userData.is_active,
  }
}

export async function requireAuth(requiredRole?: UserRole): Promise<User> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  if (requiredRole) {
    const roleHierarchy: Record<UserRole, number> = {
      staff: 1,
      manager: 2,
      admin: 3,
    }
    
    if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
      redirect('/dashboard')
    }
  }
  
  return user
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

