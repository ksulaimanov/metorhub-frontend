import { http } from '@/shared/api/http'
import type { AuthProfileResponse } from '@/entities/auth/model/types'

export async function fetchCurrentUserProfile(): Promise<AuthProfileResponse> {
  const { data } = await http.get('/api/users/me')
  return data
}

export async function requestLogout(): Promise<void> {
  await http.post('/api/auth/logout')
}

