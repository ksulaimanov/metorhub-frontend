import { http } from './http'

export interface AdminUser {
  id: number
  firstName: string
  lastName: string
  username?: string
  email: string
  role: string
  status: string
  avatarUrl?: string
}

export const adminUsersApi = {
  async getUsers(search?: string): Promise<AdminUser[]> {
    const { data } = await http.get('/api/admin/users', {
      params: { search: search || undefined }
    })
    return data.content || data // adapt to pageable or array response
  },

  async toggleBlock(id: number, status: string): Promise<void> {
    await http.put(`/api/admin/users/${id}/status`, { status })
  },

  async resetPhoto(id: number): Promise<void> {
    await http.post(`/api/admin/users/${id}/reset-photo`)
  }
}

