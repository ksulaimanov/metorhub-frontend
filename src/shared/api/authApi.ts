import { http } from '@/shared/api/http'
import type { AuthProfileResponse, LoginRequest, LoginResponse } from '@/entities/auth/model/types'

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>('/api/auth/login', credentials)
  return data
}

export async function fetchCurrentUserProfile(): Promise<AuthProfileResponse> {
  const { data } = await http.get('/api/users/me')
  return data
}

export async function refreshAuthSession(): Promise<void> {
  await http.post('/api/auth/refresh')
}

export async function requestLogout(): Promise<void> {
  await http.post('/api/auth/logout')
}
